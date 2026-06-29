<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EditorialDecisionMail;
use App\Mail\ReviewAssignmentMail;
use App\Mail\RevisionRequestedMail;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Notification;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

        // Per-manuscript scoping: a plain editor only sees manuscripts assigned
        // to them. Admin / managing-editor / EiC see the whole pipeline.
        $user = $request->user();
        if ($user && ! $user->hasAnyRole(['admin', 'managing-editor', 'editor-in-chief'])) {
            $query->where('assigned_editor_id', $user->id);
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
            'new_triage' => Manuscript::whereIn('status', ['submitted', 'with_editor'])->count(),
            'under_review' => Manuscript::where('status', 'under_review')->count(),
            'pending_decision' => Manuscript::where('status', 'decision')->count(),
            'in_revision' => Manuscript::where('status', 'revision_required')->count(),
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
    /**
     * Move an accepted manuscript into production.
     */
    public function sendToProduction(Request $request, int $id)
    {
        $manuscript = Manuscript::findOrFail($id);
        if ($manuscript->status !== 'accepted') {
            return response()->json(['success' => false, 'message' => 'Only accepted manuscripts can enter production.'], 422);
        }
        $manuscript->update(['status' => 'production']);

        return response()->json(['success' => true, 'data' => $manuscript]);
    }

    /**
     * Toggle a production checklist step.
     */
    public function updateProduction(Request $request, int $id)
    {
        $validated = $request->validate([
            'step' => 'required|in:prod_copyedit,prod_typeset,prod_proof,prod_xml',
            'value' => 'required|boolean',
        ]);
        $manuscript = Manuscript::findOrFail($id);
        $manuscript->update([$validated['step'] => $validated['value']]);

        return response()->json(['success' => true, 'data' => $manuscript]);
    }

    /**
     * Publish a manuscript: assign volume/issue/pages, register a DOI.
     */
    public function publish(Request $request, int $id)
    {
        $validated = $request->validate([
            'volume' => 'required|string|max:50',
            'issue' => 'required|string|max:50',
            'pages' => 'nullable|string|max:50',
            'doi' => 'nullable|string|max:255',
        ]);
        $manuscript = Manuscript::findOrFail($id);
        if (! $manuscript->prod_copyedit || ! $manuscript->prod_typeset || ! $manuscript->prod_proof || ! $manuscript->prod_xml) {
            return response()->json(['success' => false, 'message' => 'Complete all production steps before publishing.'], 422);
        }

        $doi = ($validated['doi'] ?? null) ?: '10.5185/amlett.'.now()->year.'.'.str_pad((string) $manuscript->id, 6, '0', STR_PAD_LEFT);

        $manuscript->update([
            'status' => 'published',
            'volume' => $validated['volume'],
            'issue' => $validated['issue'],
            'pages' => $validated['pages'] ?? null,
            'doi' => $doi,
            'published_at' => now(),
        ]);

        AuditLog::create([
            'action' => 'decision_made',
            'actor_email' => $request->user()->email,
            'actor_type' => 'editor',
            'manuscript_id' => $manuscript->id,
            'description' => 'Published manuscript: '.$manuscript->submission_id." (DOI {$doi})",
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        Notification::add($manuscript->author_email, 'published', 'Your manuscript is published',
            '"'.$manuscript->title.'" is now published. DOI: '.$doi, '/dashboard');

        return response()->json(['success' => true, 'message' => 'Manuscript published.', 'data' => $manuscript]);
    }

    /**
     * List reviewers the editor can assign (excludes the editor themselves).
     */
    public function reviewers(Request $request)
    {
        $reviewers = User::whereHas('activeRoles', function ($q) {
            $q->where('name', 'reviewer');
        })
            ->where('id', '!=', $request->user()?->id)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return response()->json(['data' => $reviewers]);
    }

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

        Notification::add($validated['reviewer_email'], 'review_invitation', 'New review invitation',
            'You have been invited to review a manuscript. Due '.$validated['due_date'].'.', '/reviewer');

        try {
            Mail::to($validated['reviewer_email'])->send(new ReviewAssignmentMail(
                $request->user()->name, $manuscript->title, [$validated['reviewer_email']], $validated['due_date']
            ));
        } catch (\Throwable $e) {
            // Email failure must not block the invitation
        }

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
            'force' => 'sometimes|boolean',
        ]);

        $manuscript = Manuscript::findOrFail($validated['manuscript_id']);

        // Guard: at least two completed reviews before a decision (EiC/admin may
        // override with force=true).
        $completedReviews = Review::where('manuscript_id', $manuscript->id)->where('is_submitted', true)->count();
        $canOverride = $request->user()->hasAnyRole(['admin', 'editor-in-chief', 'managing-editor']);
        if ($completedReviews < 2 && ! ($request->boolean('force') && $canOverride)) {
            return response()->json([
                'success' => false,
                'message' => "At least two completed reviews are required before a decision ({$completedReviews} so far).",
                'completed_reviews' => $completedReviews,
                'can_override' => $canOverride,
            ], 422);
        }

        $editorName = $request->user()->name;
        $dueDate = now()->addDays(30)->toDateString();

        $manuscript->update([
            'status' => $validated['decision'] === 'accept' ? 'accepted' : ($validated['decision'] === 'reject' ? 'rejected' : 'revision_required'),
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

        Notification::add($manuscript->author_email, 'decision', 'Editorial decision: '.$validated['decision'],
            'A decision has been recorded for "'.$manuscript->title.'".', '/dashboard');

        // Email the author (logged when MAIL_MAILER=log; real once SMTP is set)
        try {
            if (in_array($validated['decision'], ['minor-revisions', 'major-revisions'], true)) {
                Mail::to($manuscript->author_email)->send(new RevisionRequestedMail(
                    $manuscript->title, $manuscript->submission_id, $editorName, $dueDate, $validated['notes'] ?? null
                ));
            } else {
                Mail::to($manuscript->author_email)->send(new EditorialDecisionMail(
                    $manuscript->title, $validated['decision'], $editorName
                ));
            }
        } catch (\Throwable $e) {
            // Email failure must not block the decision
        }

        return response()->json([
            'success' => true,
            'message' => 'Decision recorded successfully.',
            'data' => $manuscript,
        ]);
    }
}
