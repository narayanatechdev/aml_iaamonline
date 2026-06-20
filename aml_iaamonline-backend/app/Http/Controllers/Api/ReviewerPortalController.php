<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewerPortalController extends Controller
{
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

        $assignment->update([
            'status' => $validated['decision'] === 'accept' ? 'accepted' : 'declined',
            'response_date' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $assignment]);
    }

    /**
     * Submit a structured review; marks the assignment completed.
     */
    public function review(Request $request, int $id): JsonResponse
    {
        $assignment = $this->ownedAssignment($request, $id);

        $validated = $request->validate([
            'recommendation' => ['required', Rule::in(['accept', 'minor-revisions', 'major-revisions', 'reject'])],
            'quality_score' => 'nullable|integer|min:1|max:5',
            'novelty_score' => 'nullable|integer|min:1|max:5',
            'relevance_score' => 'nullable|integer|min:1|max:5',
            'comments' => 'required|string|max:10000',
            'confidential_comments' => 'nullable|string|max:10000',
        ]);

        Review::create(array_merge($validated, [
            'review_assignment_id' => $assignment->id,
            'manuscript_id' => $assignment->manuscript_id,
            'reviewer_email' => $request->user()->email,
            'is_submitted' => true,
            'submitted_at' => now(),
            'ip_address' => $request->ip(),
        ]));

        $assignment->update(['status' => 'completed', 'completed_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Review submitted.']);
    }

    private function ownedAssignment(Request $request, int $id): ReviewAssignment
    {
        return ReviewAssignment::where('reviewer_email', $request->user()->email)->findOrFail($id);
    }
}
