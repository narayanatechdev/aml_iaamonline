# Email Integration Guide

Complete examples for integrating email templates into your API endpoints.

---

## 1. Submission Confirmation (Phase 1)

### Location: `app/Http/Controllers/Api/SubmissionController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Mail\SubmissionConfirmationMail;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SubmissionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'authors' => 'required|string|max:500',
            'author_email' => 'required|email',
            'affiliation' => 'required|string|max:255',
            'abstract' => 'required|string',
            'keywords' => 'required|string',
            'category' => 'required|string|in:computer-science,engineering,medicine,physics,chemistry',
            'pdf' => 'required|mimes:pdf|max:51200', // 50MB max
        ]);

        // Create manuscript record
        $manuscript = Manuscript::create([
            'submission_id' => 'SUB-' . strtoupper(Str::random(12)),
            'title' => $validated['title'],
            'authors' => $validated['authors'],
            'author_email' => $validated['author_email'],
            'affiliation' => $validated['affiliation'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'],
            'category' => $validated['category'],
            'status' => 'submitted',
        ]);

        // Store manuscript PDF
        if ($request->hasFile('pdf')) {
            $path = $request->file('pdf')->store('manuscripts', 'private');
            $manuscript->files()->create([
                'file_name' => $request->file('pdf')->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => 'application/pdf',
                'file_size' => $request->file('pdf')->getSize(),
                'mime_type' => 'application/pdf',
            ]);
        }

        // Log audit trail
        $manuscript->auditLogs()->create([
            'action' => 'submitted',
            'actor_type' => 'author',
            'actor_email' => $manuscript->author_email,
            'actor_ip' => $request->ip(),
            'resource_type' => 'manuscript',
            'status' => 'success',
        ]);

        // Send confirmation email (queued - non-blocking)
        $trackingUrl = config('app.url') . '/track?id=' . $manuscript->submission_id;
        Mail::to($manuscript->author_email)->send(
            new SubmissionConfirmationMail($manuscript, $trackingUrl)
        );

        return response()->json([
            'success' => true,
            'message' => 'Manuscript submitted successfully!',
            'data' => [
                'submission_id' => $manuscript->submission_id,
                'tracking_url' => $trackingUrl,
            ],
        ], 201);
    }
}
```

---

## 2. Reviewer Invitation (Phase 3)

### Location: `app/Http/Controllers/Api/EditorController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Mail\ReviewerInvitationMail;
use App\Mail\ReviewAssignmentMail;
use App\Models\Manuscript;
use App\Models\ReviewAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class EditorController extends Controller
{
    public function inviteReviewers(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'reviewers' => 'required|array|min:1|max:10',
            'reviewers.*.email' => 'required|email',
            'reviewers.*.name' => 'required|string|max:255',
            'due_days' => 'required|integer|min:14|max:56', // 2-8 weeks
        ]);

        $manuscript = Manuscript::findOrFail($validated['manuscript_id']);
        $editor = $request->user();
        $dueDate = Carbon::now()->addDays($validated['due_days']);
        $reviewerEmails = [];

        // Create assignments and send invitations
        foreach ($validated['reviewers'] as $reviewerData) {
            // Create review assignment
            $assignment = ReviewAssignment::create([
                'manuscript_id' => $manuscript->id,
                'reviewer_email' => $reviewerData['email'],
                'reviewer_name' => $reviewerData['name'],
                'status' => 'invited',
                'invited_at' => now(),
                'due_date' => $dueDate,
            ]);

            // Send invitation email (queued)
            $reviewPortalUrl = config('app.url') . '/reviewer/access';
            Mail::to($assignment->reviewer_email)->send(
                new ReviewerInvitationMail(
                    $assignment,
                    $reviewPortalUrl,
                    $manuscript->title,
                    $editor->name
                )
            );

            $reviewerEmails[] = $reviewerData['email'];

            // Log audit
            $manuscript->auditLogs()->create([
                'action' => 'reviewer_invited',
                'actor_type' => 'editor',
                'actor_email' => $editor->email,
                'actor_ip' => $request->ip(),
                'review_assignment_id' => $assignment->id,
                'resource_type' => 'review_assignment',
                'metadata' => ['reviewer_email' => $reviewerData['email']],
                'status' => 'success',
            ]);
        }

        // Send confirmation to editor
        Mail::to($editor->email)->send(
            new ReviewAssignmentMail(
                $editor->name,
                $manuscript->title,
                $reviewerEmails,
                $dueDate->format('M d, Y')
            )
        );

        // Update manuscript status
        $manuscript->update(['status' => 'under_review']);

        return response()->json([
            'success' => true,
            'message' => count($validated['reviewers']) . ' reviewers invited successfully',
            'data' => [
                'reviewer_count' => count($validated['reviewers']),
                'due_date' => $dueDate->format('Y-m-d'),
            ],
        ]);
    }
}
```

---

## 3. Verification Code (Phase 4)

### Location: `app/Http/Controllers/Api/ReviewerController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Mail\VerificationCodeMail;
use App\Models\ReviewAssignment;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class ReviewerController extends Controller
{
    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        // Find reviewer assignment
        $assignment = ReviewAssignment::where('reviewer_email', $validated['email'])
            ->where('status', '!=', 'declined')
            ->latest('created_at')
            ->firstOrFail();

        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete old codes for this assignment
        VerificationCode::where('review_assignment_id', $assignment->id)->delete();

        // Create new verification code
        VerificationCode::create([
            'review_assignment_id' => $assignment->id,
            'code' => $code,
            'code_hash' => hash('sha256', $code),
            'reviewer_email' => $validated['email'],
            'expires_at' => Carbon::now()->addMinutes(10),
            'max_attempts' => 3,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Get manuscript
        $manuscript = $assignment->manuscript;

        // Send verification code (queued)
        Mail::to($validated['email'])->send(
            new VerificationCodeMail(
                $code,
                $manuscript->title,
                10 // expires in 10 minutes
            )
        );

        // Log audit
        $manuscript->auditLogs()->create([
            'action' => 'verification_code_sent',
            'actor_type' => 'reviewer',
            'actor_email' => $validated['email'],
            'actor_ip' => $request->ip(),
            'review_assignment_id' => $assignment->id,
            'resource_type' => 'verification_code',
            'status' => 'success',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Verification code sent to ' . $validated['email'],
            'data' => [
                'expires_in_minutes' => 10,
            ],
        ]);
    }

    public function verifyCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|regex:/^\d{6}$/',
        ]);

        // Find assignment
        $assignment = ReviewAssignment::where('reviewer_email', $validated['email'])
            ->firstOrFail();

        // Find verification code record
        $verificationRecord = VerificationCode::where('review_assignment_id', $assignment->id)
            ->where('reviewer_email', $validated['email'])
            ->firstOrFail();

        // Check if expired
        if ($verificationRecord->expires_at->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Code has expired. Request a new one.',
            ], 410);
        }

        // Check if code is locked (too many attempts)
        if ($verificationRecord->is_locked && $verificationRecord->locked_until->isFuture()) {
            return response()->json([
                'success' => false,
                'message' => 'Too many attempts. Please try again later.',
            ], 429);
        }

        // Check code
        if (!hash_equals($verificationRecord->code_hash, hash('sha256', $validated['code']))) {
            $verificationRecord->increment('attempt_count');

            if ($verificationRecord->attempt_count >= $verificationRecord->max_attempts) {
                $verificationRecord->update([
                    'is_locked' => true,
                    'locked_until' => Carbon::now()->addMinutes(15),
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Invalid code. Please try again.',
            ], 401);
        }

        // Mark as used
        $verificationRecord->update([
            'is_used' => true,
            'used_at' => now(),
        ]);

        // Generate review token
        $reviewToken = ReviewToken::create([
            'review_assignment_id' => $assignment->id,
            'token' => bin2hex(random_bytes(32)),
            'reviewer_email' => $validated['email'],
            'expires_at' => Carbon::now()->addDays(30),
            'ip_addresses' => [$request->ip()],
        ]);

        // Log audit
        $assignment->manuscript->auditLogs()->create([
            'action' => 'code_verified',
            'actor_type' => 'reviewer',
            'actor_email' => $validated['email'],
            'actor_ip' => $request->ip(),
            'review_assignment_id' => $assignment->id,
            'resource_type' => 'verification_code',
            'status' => 'success',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Code verified! Access granted.',
            'data' => [
                'token' => $reviewToken->token,
                'manuscript_id' => $assignment->manuscript_id,
            ],
        ]);
    }
}
```

---

## 4. Editorial Decision (Phase 5)

### Location: `app/Http/Controllers/Api/EditorController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Mail\ManuscriptAcceptedMail;
use App\Mail\ManuscriptRejectedMail;
use App\Mail\RevisionRequestedMail;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class EditorController extends Controller
{
    public function makeDecision(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'decision' => 'required|in:accepted,revision_required,rejected',
            'comments' => 'nullable|string',
            'revision_deadline_days' => 'nullable|required_if:decision,revision_required|integer|min:14|max:90',
        ]);

        $manuscript = Manuscript::findOrFail($validated['manuscript_id']);
        $editor = $request->user();
        $author = $manuscript->author_email;
        $trackingUrl = config('app.url') . '/track?id=' . $manuscript->submission_id;

        // Update manuscript status
        $statusMap = [
            'accepted' => 'accepted',
            'revision_required' => 'revision_requested',
            'rejected' => 'rejected',
        ];

        $manuscript->update([
            'status' => $statusMap[$validated['decision']],
            'editor_comments' => $validated['comments'],
            'decision_made_at' => now(),
        ]);

        // Send appropriate email based on decision
        if ($validated['decision'] === 'accepted') {
            Mail::to($author)->send(
                new ManuscriptAcceptedMail(
                    $manuscript->title,
                    $manuscript->submission_id,
                    $editor->name,
                    $manuscript->authors,
                    Carbon::now()->addMonths(3)->format('M Y'), // expected publication
                    $trackingUrl
                )
            );
        } elseif ($validated['decision'] === 'revision_required') {
            $revisionDue = Carbon::now()->addDays($validated['revision_deadline_days']);

            Mail::to($author)->send(
                new RevisionRequestedMail(
                    $manuscript->title,
                    $manuscript->submission_id,
                    $editor->name,
                    $revisionDue->format('M d, Y'),
                    $validated['comments'],
                    $trackingUrl
                )
            );
        } elseif ($validated['decision'] === 'rejected') {
            Mail::to($author)->send(
                new ManuscriptRejectedMail(
                    $manuscript->title,
                    $manuscript->submission_id,
                    $editor->name,
                    $manuscript->authors,
                    $validated['comments'],
                    $trackingUrl
                )
            );
        }

        // Log audit
        $manuscript->auditLogs()->create([
            'action' => 'decision_made',
            'actor_type' => 'editor',
            'actor_email' => $editor->email,
            'actor_ip' => $request->ip(),
            'resource_type' => 'manuscript',
            'metadata' => ['decision' => $validated['decision']],
            'status' => 'success',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Decision recorded and author notified',
            'data' => [
                'decision' => $validated['decision'],
                'notification_sent' => true,
            ],
        ]);
    }
}
```

---

## 5. Review Reminders (Scheduled Task)

### Location: `app/Console/Commands/SendReviewReminders.php`

```php
<?php

namespace App\Console\Commands;

use App\Mail\ReviewReminderMail;
use App\Models\ReviewAssignment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendReviewReminders extends Command
{
    protected $signature = 'emails:send-review-reminders';
    protected $description = 'Send review reminders to reviewers with approaching deadlines';

    public function handle()
    {
        // Find assignments due in 7, 3, and 1 days
        $dueDates = [
            7 => 'Send 7-day reminders',
            3 => 'Send 3-day reminders',
            1 => 'Send 1-day reminders',
        ];

        foreach ($dueDates as $daysFromNow => $label) {
            $this->info($label . '...');

            // Find assignments with due date in $daysFromNow days (within 24 hour window)
            $assignments = ReviewAssignment::whereBetween('due_date', [
                Carbon::now()->addDays($daysFromNow)->startOfDay(),
                Carbon::now()->addDays($daysFromNow)->endOfDay(),
            ])
            ->where('status', 'accepted')
            ->doesntHave('reviews') // No review submitted yet
            ->with('manuscript')
            ->get();

            foreach ($assignments as $assignment) {
                $reviewPortalUrl = config('app.url') . '/reviewer/access';

                Mail::to($assignment->reviewer_email)->send(
                    new ReviewReminderMail(
                        $assignment->manuscript->title,
                        (string) $daysFromNow,
                        $assignment->due_date->format('M d, Y'),
                        $reviewPortalUrl
                    )
                );

                // Log sent reminder
                $assignment->increment('reminder_count');
                $assignment->update(['last_reminder_sent_at' => now()]);

                $this->line("  ✓ Reminder sent to {$assignment->reviewer_email}");
            }
        }

        $this->info('Done!');
    }
}
```

### Register in scheduler (`app/Console/Kernel.php`):

```php
protected function schedule(Schedule $schedule)
{
    // Send review reminders daily at 9 AM
    $schedule->command('emails:send-review-reminders')
        ->dailyAt('09:00')
        ->onOneServer();
}
```

---

## Summary of Integration Points

| Email Type | Controller/Command | Trigger |
|----------|-----------------|---------|
| SubmissionConfirmationMail | SubmissionController@store | After manuscript created |
| ReviewerInvitationMail | EditorController@inviteReviewers | After reviewer assigned |
| ReviewAssignmentMail | EditorController@inviteReviewers | After invitations sent |
| VerificationCodeMail | ReviewerController@verifyEmail | When reviewer requests access |
| ReviewReminderMail | SendReviewReminders (scheduled) | Daily (7, 3, 1 days before) |
| RevisionRequestedMail | EditorController@makeDecision | When decision = revision_required |
| ManuscriptAcceptedMail | EditorController@makeDecision | When decision = accepted |
| ManuscriptRejectedMail | EditorController@makeDecision | When decision = rejected |

---

## Testing Integration

```php
// In tests/Feature/EmailTest.php
use Illuminate\Support\Facades\Mail;
use App\Mail\SubmissionConfirmationMail;

test('submission confirmation is sent when author submits', function () {
    Mail::fake();

    $response = $this->post('/api/submit', [
        'title' => 'Test Manuscript',
        'authors' => 'John Doe',
        'author_email' => 'john@example.com',
        'affiliation' => 'Test University',
        'abstract' => 'Test abstract...',
        'keywords' => 'test, keywords',
        'category' => 'computer-science',
        'pdf' => UploadedFile::fake()->create('manuscript.pdf', 100),
    ]);

    $response->assertOk();
    Mail::assertSent(SubmissionConfirmationMail::class);
    Mail::assertSent(SubmissionConfirmationMail::class, function ($mail) {
        return $mail->hasTo('john@example.com');
    });
});
```

---

All email templates are now ready for integration into your API endpoints!
