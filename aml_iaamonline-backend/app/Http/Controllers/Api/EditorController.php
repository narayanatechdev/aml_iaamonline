<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ReviewAssignment;
use Illuminate\Http\Request;

class EditorController extends Controller
{
    /**
     * List all manuscripts with optional filtering.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Manuscript::with(['files', 'reviewAssignments']);

        if ($status) {
            $query->where('status', $status);
        }

        $manuscripts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $manuscripts,
        ]);
    }

    /**
     * Show detailed view of a manuscript.
     */
    public function show($id)
    {
        $manuscript = Manuscript::with(['files', 'reviewAssignments', 'reviews', 'auditLogs'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $manuscript,
        ]);
    }

    /**
     * Get dashboard metrics.
     */
    public function stats()
    {
        $stats = [
            'total_manuscripts' => Manuscript::count(),
            'new_submissions' => Manuscript::where('status', 'submitted')->count(),
            'under_review' => Manuscript::where('status', 'under_review')->count(),
            'accepted' => Manuscript::where('status', 'accepted')->count(),
            'rejected' => Manuscript::where('status', 'rejected')->count(),
            'pending_assignments' => Manuscript::where('status', 'submitted')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Invite a reviewer.
     */
    public function inviteReviewer(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'reviewer_email' => 'required|email',
            'reviewer_name' => 'required|string|max:255',
            'due_date' => 'required|date|after:today',
        ]);

        $assignment = ReviewAssignment::create([
            'manuscript_id' => $validated['manuscript_id'],
            'reviewer_email' => $validated['reviewer_email'],
            'reviewer_name' => $validated['reviewer_name'],
            'status' => 'invited',
            'invited_at' => now(),
            'due_date' => $validated['due_date'],
        ]);

        // Update manuscript status if it was just submitted
        $manuscript = Manuscript::find($validated['manuscript_id']);
        if ($manuscript->status === 'submitted') {
            $manuscript->update(['status' => 'under_review']);
        }

        AuditLog::create([
            'action' => 'reviewer_invited',
            'actor_email' => $request->user()->email,
            'actor_type' => 'editor',
            'manuscript_id' => $validated['manuscript_id'],
            'description' => "Reviewer {$validated['reviewer_email']} invited for manuscript: ".$manuscript->submission_id,
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reviewer invited successfully.',
            'data' => $assignment,
        ]);
    }

    /**
     * Make an editorial decision.
     */
    public function makeDecision(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'decision' => 'required|in:accept,minor-revisions,major-revisions,reject',
            'notes' => 'nullable|string',
        ]);

        $manuscript = Manuscript::findOrFail($validated['manuscript_id']);

        $manuscript->update([
            'status' => $validated['decision'] === 'accept' ? 'accepted' : ($validated['decision'] === 'reject' ? 'rejected' : 'revision_requested'),
            'final_decision' => $validated['decision'],
            'decision_date' => now(),
            'decision_notes' => $validated['notes'],
        ]);

        AuditLog::create([
            'action' => 'decision_made',
            'actor_email' => $request->user()->email,
            'actor_type' => 'editor',
            'manuscript_id' => $manuscript->id,
            'description' => "Decision made: {$validated['decision']} for manuscript: ".$manuscript->submission_id,
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Decision recorded successfully.',
            'data' => $manuscript,
        ]);
    }
}
