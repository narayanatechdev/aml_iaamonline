<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Services\PeerReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewerPortalController extends Controller
{
    public function __construct(private readonly PeerReviewService $reviews) {}

    /**
     * The logged-in reviewer's assignments (invitations + in-progress + done).
     */
    public function assignments(Request $request): JsonResponse
    {
        $email = $request->user()->email;

        $assignments = ReviewAssignment::where('reviewer_email', $email)
            ->with(['manuscript:id,submission_id,title,abstract,category,division'])
            ->latest('invited_at')
            ->get();

        return response()->json([
            'data' => $assignments,
            'stats' => [
                'invited' => $assignments->where('status', 'invited')->count(),
                'accepted' => $assignments->where('status', 'accepted')->count(),
                'completed' => $assignments->where('status', 'completed')->count(),
            ],
        ]);
    }

    /**
     * Accept or decline an invitation.
     */
    public function respond(Request $request, int $id): JsonResponse
    {
        $assignment = $this->ownedAssignment($request, $id);

        $validated = $request->validate([
            'decision' => ['required', Rule::in(['accept', 'decline'])],
        ]);

        $assignment = $this->reviews->respond($assignment, $validated['decision']);

        return response()->json(['success' => true, 'data' => $assignment]);
    }

    /**
     * Submit a structured review; marks the assignment completed.
     */
    public function review(Request $request, int $id): JsonResponse
    {
        $assignment = $this->ownedAssignment($request, $id);

        $validated = $request->validate(PeerReviewService::reviewRules());

        $this->reviews->submitReview($assignment, $validated, $request->user()->email, $request->ip());

        return response()->json(['success' => true, 'message' => 'Review submitted.']);
    }

    private function ownedAssignment(Request $request, int $id): ReviewAssignment
    {
        return ReviewAssignment::where('reviewer_email', $request->user()->email)->findOrFail($id);
    }
}
