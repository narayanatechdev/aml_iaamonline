<?php

namespace App\Services;

use App\Mail\ReviewAssignmentMail;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Notification;
use App\Models\Review;
use App\Models\ReviewAssignment;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * The peer-review workflow, in one place.
 *
 * Editors reach it from the journal's own editor screens and from the IAAM
 * Portal, and reviewers likewise. Both routes must invite, accept and record
 * a review identically — a second implementation behind the Portal would
 * drift, and the two would disagree about the same manuscript.
 */
class PeerReviewService
{
    public const RECOMMENDATIONS = ['accept', 'minor-revisions', 'major-revisions', 'reject'];

    /** An assignment may still be withdrawn while it is in one of these. */
    private const WITHDRAWABLE = ['invited', 'declined'];

    /**
     * Invite a reviewer and move the manuscript into review.
     *
     * @param  array{reviewer_email: string, reviewer_name: string, due_date: string}  $data
     */
    public function invite(
        Manuscript $manuscript,
        array $data,
        string $actorEmail,
        string $actorType,
        ?string $actorIp = null,
    ): ReviewAssignment {
        $existing = ReviewAssignment::where('manuscript_id', $manuscript->id)
            ->where('reviewer_email', $data['reviewer_email'])
            ->whereIn('status', ['invited', 'accepted', 'completed'])
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'reviewer_email' => 'That reviewer is already invited to this manuscript.',
            ]);
        }

        $assignment = ReviewAssignment::create([
            'manuscript_id' => $manuscript->id,
            'reviewer_email' => $data['reviewer_email'],
            'reviewer_name' => $data['reviewer_name'],
            'status' => 'invited',
            'invited_at' => now(),
            'due_date' => $data['due_date'],
        ]);

        // A manuscript sitting with the editor moves on once review begins.
        if (in_array($manuscript->status, ['submitted', 'with_editor', 'editor-review'], true)) {
            $manuscript->update(['status' => 'under_review']);
        }

        AuditLog::create([
            'action' => 'reviewer_invited',
            'actor_email' => $actorEmail,
            'actor_type' => $actorType,
            'manuscript_id' => $manuscript->id,
            'description' => "Reviewer {$data['reviewer_email']} invited for manuscript: ".$manuscript->submission_id,
            'status' => 'success',
            'actor_ip' => $actorIp,
        ]);

        Notification::add(
            $data['reviewer_email'],
            'review_invitation',
            'New review invitation',
            'You have been invited to review a manuscript. Due '.$data['due_date'].'.',
            '/reviewer'
        );

        try {
            Mail::to($data['reviewer_email'])->send(new ReviewAssignmentMail(
                $actorEmail,
                $manuscript->title,
                [$data['reviewer_email']],
                $data['due_date'],
            ));
        } catch (\Throwable) {
            // A mail outage must not lose the invitation itself.
        }

        return $assignment;
    }

    /** Accept or decline an invitation. */
    public function respond(ReviewAssignment $assignment, string $decision): ReviewAssignment
    {
        if ($assignment->status === 'completed') {
            throw ValidationException::withMessages([
                'decision' => 'This review has already been submitted.',
            ]);
        }

        $assignment->update([
            'status' => $decision === 'accept' ? 'accepted' : 'declined',
            'response_date' => now(),
        ]);

        return $assignment->refresh();
    }

    /**
     * Record a review and close the assignment.
     *
     * @param  array<string, mixed>  $data
     */
    public function submitReview(
        ReviewAssignment $assignment,
        array $data,
        string $reviewerEmail,
        ?string $ip = null,
    ): Review {
        if ($assignment->status === 'completed') {
            throw ValidationException::withMessages([
                'recommendation' => 'A review has already been submitted for this assignment.',
            ]);
        }

        if ($assignment->status === 'declined') {
            throw ValidationException::withMessages([
                'recommendation' => 'This invitation was declined and cannot be reviewed.',
            ]);
        }

        $review = Review::create(array_merge($data, [
            'review_assignment_id' => $assignment->id,
            'manuscript_id' => $assignment->manuscript_id,
            'reviewer_email' => $reviewerEmail,
            'is_submitted' => true,
            'submitted_at' => now(),
            'ip_address' => $ip,
        ]));

        $assignment->update(['status' => 'completed', 'completed_at' => now()]);

        return $review;
    }

    /** Withdraw an invitation that has not produced a review. */
    public function withdraw(ReviewAssignment $assignment): void
    {
        if (! in_array($assignment->status, self::WITHDRAWABLE, true)) {
            throw ValidationException::withMessages([
                'assignment' => 'Only an invitation that is still pending or declined can be withdrawn.',
            ]);
        }

        $assignment->delete();
    }

    /** Validation rules for a submitted review, shared by both entry points. */
    public static function reviewRules(): array
    {
        return [
            'recommendation' => ['required', 'in:'.implode(',', self::RECOMMENDATIONS)],
            'quality_score' => 'nullable|integer|min:1|max:5',
            'novelty_score' => 'nullable|integer|min:1|max:5',
            'relevance_score' => 'nullable|integer|min:1|max:5',
            'comments' => 'required|string|max:10000',
            'confidential_comments' => 'nullable|string|max:10000',
        ];
    }

    /** Validation rules for an invitation, shared by both entry points. */
    public static function inviteRules(): array
    {
        return [
            'reviewer_email' => 'required|email',
            'reviewer_name' => 'required|string|max:255',
            'due_date' => 'required|date|after:today',
        ];
    }
}
