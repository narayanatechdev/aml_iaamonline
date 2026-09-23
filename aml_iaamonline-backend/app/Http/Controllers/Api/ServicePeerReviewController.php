<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\User;
use App\Services\PeerReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Peer review, driven by the IAAM Portal.
 *
 * The Portal acts for a person rather than as one, so a reviewer is named by
 * IAAM ID and resolved to the email that review assignments are keyed on.
 * Everything else is delegated to PeerReviewService, so a review run from the
 * Portal is indistinguishable from one run on the journal's own screens.
 */
class ServicePeerReviewController extends Controller
{
    public function __construct(private readonly PeerReviewService $reviews) {}

    /* ---------------------------------------------------------------- editor */

    /** Reviewers invited to a manuscript, with any submitted reviews. */
    public function index(string $submissionId): JsonResponse
    {
        $manuscript = $this->manuscript($submissionId);

        $assignments = ReviewAssignment::where('manuscript_id', $manuscript->id)
            ->latest('invited_at')
            ->get();

        $reviews = Review::where('manuscript_id', $manuscript->id)
            ->where('is_submitted', true)
            ->get()
            ->keyBy('review_assignment_id');

        return response()->json([
            'data' => $assignments->map(fn (ReviewAssignment $a) => $this->presentAssignment($a, $reviews->get($a->id))),
        ]);
    }

    /** Invite a reviewer to a manuscript. */
    public function invite(Request $request, string $submissionId): JsonResponse
    {
        $manuscript = $this->manuscript($submissionId);
        $validated = $request->validate(PeerReviewService::inviteRules());

        $assignment = $this->reviews->invite(
            $manuscript,
            $validated,
            actorEmail: $request->input('actor_email', 'portal@iaamonline.org'),
            actorType: 'portal',
            actorIp: $request->ip(),
        );

        return response()->json(['data' => $this->presentAssignment($assignment)], 201);
    }

    /** Withdraw an invitation that has not produced a review. */
    public function withdraw(string $submissionId, int $assignmentId): JsonResponse
    {
        $manuscript = $this->manuscript($submissionId);

        $assignment = ReviewAssignment::where('manuscript_id', $manuscript->id)->findOrFail($assignmentId);

        $this->reviews->withdraw($assignment);

        return response()->json(['message' => 'Invitation withdrawn.']);
    }

    /* -------------------------------------------------------------- reviewer */

    /** Everything this person has been asked to review. */
    public function assignments(string $iaamId): JsonResponse
    {
        $email = $this->reviewerEmail($iaamId);

        $assignments = ReviewAssignment::where('reviewer_email', $email)
            ->with(['manuscript:id,submission_id,title,abstract,category,division,status'])
            ->latest('invited_at')
            ->get();

        return response()->json([
            'data' => $assignments->map(fn (ReviewAssignment $a) => $this->presentAssignment($a) + [
                'manuscript' => $a->manuscript,
            ]),
            'stats' => [
                'invited' => $assignments->where('status', 'invited')->count(),
                'accepted' => $assignments->where('status', 'accepted')->count(),
                'completed' => $assignments->where('status', 'completed')->count(),
            ],
        ]);
    }

    /** Accept or decline an invitation. */
    public function respond(Request $request, string $iaamId, int $assignmentId): JsonResponse
    {
        $validated = $request->validate(['decision' => 'required|in:accept,decline']);

        $assignment = $this->ownedAssignment($iaamId, $assignmentId);

        return response()->json([
            'data' => $this->presentAssignment($this->reviews->respond($assignment, $validated['decision'])),
        ]);
    }

    /** Submit the review itself. */
    public function review(Request $request, string $iaamId, int $assignmentId): JsonResponse
    {
        $validated = $request->validate(PeerReviewService::reviewRules());

        $email = $this->reviewerEmail($iaamId);
        $assignment = $this->ownedAssignment($iaamId, $assignmentId);

        $this->reviews->submitReview($assignment, $validated, $email, $request->ip());

        return response()->json(['message' => 'Review submitted.'], 201);
    }

    /* ---------------------------------------------------------------- helpers */

    private function manuscript(string $submissionId): Manuscript
    {
        return Manuscript::where('submission_id', $submissionId)->firstOrFail();
    }

    /** Assignments are keyed on the reviewer's email, not their IAAM ID. */
    private function reviewerEmail(string $iaamId): string
    {
        return User::where('iaam_id', $iaamId)->firstOrFail()->email;
    }

    private function ownedAssignment(string $iaamId, int $assignmentId): ReviewAssignment
    {
        return ReviewAssignment::where('reviewer_email', $this->reviewerEmail($iaamId))->findOrFail($assignmentId);
    }

    /**
     * A reviewer's identity is deliberately absent from the review body: the
     * journal runs double-blind review, and this payload is read by editors
     * and reviewers through the same Portal.
     */
    private function presentAssignment(ReviewAssignment $assignment, ?Review $review = null): array
    {
        return [
            'id' => $assignment->id,
            'reviewer_name' => $assignment->reviewer_name,
            'reviewer_email' => $assignment->reviewer_email,
            'status' => $assignment->status,
            'invited_at' => optional($assignment->invited_at)->toIso8601String(),
            'response_date' => optional($assignment->response_date)->toIso8601String(),
            'due_date' => optional($assignment->due_date)->toIso8601String(),
            'completed_at' => optional($assignment->completed_at)->toIso8601String(),
            'review' => $review ? [
                'recommendation' => $review->recommendation,
                'quality_score' => $review->quality_score,
                'novelty_score' => $review->novelty_score,
                'relevance_score' => $review->relevance_score,
                'comments' => $review->comments,
                'confidential_comments' => $review->confidential_comments,
                'submitted_at' => optional($review->submitted_at)->toIso8601String(),
            ] : null,
        ];
    }
}
