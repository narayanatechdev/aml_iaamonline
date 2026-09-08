<?php

namespace App\Console\Commands;

use App\Http\Controllers\Api\WorkflowSettingsController;
use App\Mail\ReviewAssignmentMail;
use App\Mail\ReviewReminderMail;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\ReviewAssignment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendReviewReminders extends Command
{
    protected $signature = 'reviews:send-reminders';

    protected $description = 'Send the peer-review reminder cadence: invitation nudges, invitation expiry, and review due-date reminders. Run daily via the scheduler.';

    public function handle(): int
    {
        $settings = WorkflowSettingsController::current();
        $portalUrl = rtrim(config('app.frontend_url', 'https://amljournal.iaamonline.org'), '/').'/reviewer';

        $nudged = $this->nudgeUnansweredInvitations($settings, $portalUrl);
        $expired = $this->expireStaleInvitations($settings);
        $dueSoon = $this->remindDueSoon($settings, $portalUrl);
        $overdue = $this->remindDueNow($portalUrl);

        $this->info("Invitation nudges: {$nudged}, expired invitations: {$expired}, due-soon reminders: {$dueSoon}, due/overdue reminders: {$overdue}");

        return self::SUCCESS;
    }

    /** Re-send the invitation once when a reviewer has not answered after N days. */
    private function nudgeUnansweredInvitations(array $settings, string $portalUrl): int
    {
        $count = 0;
        $assignments = ReviewAssignment::with('manuscript')
            ->where('status', 'invited')
            ->whereNull('invite_reminder_sent_at')
            ->where('invited_at', '<=', now()->subDays($settings['invite_reminder_after_days']))
            ->where('invited_at', '>', now()->subDays($settings['invite_response_days']))
            ->get();

        foreach ($assignments as $assignment) {
            try {
                Mail::to($assignment->reviewer_email)->send(new ReviewAssignmentMail(
                    'AML Editorial Office',
                    $assignment->manuscript?->title ?? 'a manuscript',
                    [$assignment->reviewer_email],
                    optional($assignment->due_date)->toDateString() ?? ''
                ));
                Notification::add($assignment->reviewer_email, 'review_invitation', 'Reminder: review invitation awaiting your response',
                    'Your review invitation is still open. Please accept or decline.', '/reviewer');
                $assignment->update(['invite_reminder_sent_at' => now()]);
                $count++;
            } catch (\Throwable $e) {
                $this->warn("Nudge failed for {$assignment->reviewer_email}: {$e->getMessage()}");
            }
        }

        return $count;
    }

    /** Expire invitations that were never answered within the response window. */
    private function expireStaleInvitations(array $settings): int
    {
        $assignments = ReviewAssignment::where('status', 'invited')
            ->where('invited_at', '<=', now()->subDays($settings['invite_response_days']))
            ->get();

        foreach ($assignments as $assignment) {
            $assignment->update(['status' => 'expired']);
            $assignment->tokens()->update(['expires_at' => now()]);
            AuditLog::create([
                'action' => 'invitation_expired',
                'actor_email' => 'system',
                'actor_type' => 'scheduler',
                'manuscript_id' => $assignment->manuscript_id,
                'description' => "Review invitation for {$assignment->reviewer_email} expired after {$settings['invite_response_days']} days without a response.",
                'status' => 'success',
            ]);
        }

        return $assignments->count();
    }

    /** Remind accepted reviewers once, N days before their deadline. */
    private function remindDueSoon(array $settings, string $portalUrl): int
    {
        $count = 0;
        $assignments = ReviewAssignment::with('manuscript')
            ->where('status', 'accepted')
            ->whereNull('completed_at')
            ->whereNull('due_soon_reminder_sent_at')
            ->whereNotNull('due_date')
            ->where('due_date', '>', now())
            ->where('due_date', '<=', now()->addDays($settings['due_soon_reminder_days']))
            ->get();

        foreach ($assignments as $assignment) {
            $days = (string) max(1, (int) ceil(now()->diffInHours($assignment->due_date, false) / 24));
            if ($this->sendDueReminder($assignment, $days, $portalUrl)) {
                $assignment->update(['due_soon_reminder_sent_at' => now()]);
                $count++;
            }
        }

        return $count;
    }

    /** Remind accepted reviewers once more on/after the deadline itself. */
    private function remindDueNow(string $portalUrl): int
    {
        $count = 0;
        $assignments = ReviewAssignment::with('manuscript')
            ->where('status', 'accepted')
            ->whereNull('completed_at')
            ->whereNull('due_reminder_sent_at')
            ->whereNotNull('due_date')
            ->where('due_date', '<=', now())
            ->get();

        foreach ($assignments as $assignment) {
            if ($this->sendDueReminder($assignment, '0', $portalUrl)) {
                $assignment->update(['due_reminder_sent_at' => now()]);
                $count++;
            }
        }

        return $count;
    }

    private function sendDueReminder(ReviewAssignment $assignment, string $daysRemaining, string $portalUrl): bool
    {
        try {
            Mail::to($assignment->reviewer_email)->send(new ReviewReminderMail(
                $assignment->manuscript?->title ?? 'a manuscript',
                $daysRemaining,
                optional($assignment->due_date)->toDateString() ?? '',
                $portalUrl
            ));
            Notification::add($assignment->reviewer_email, 'review_reminder', 'Review deadline reminder',
                $daysRemaining === '0' ? 'Your review is due today.' : "Your review is due in {$daysRemaining} days.", '/reviewer');

            return true;
        } catch (\Throwable $e) {
            $this->warn("Due reminder failed for {$assignment->reviewer_email}: {$e->getMessage()}");

            return false;
        }
    }
}
