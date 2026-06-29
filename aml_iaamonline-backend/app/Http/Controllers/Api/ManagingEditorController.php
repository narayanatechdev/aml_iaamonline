<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ManagingEditorController extends Controller
{
    /**
     * Get manuscripts awaiting initial screening (status=submitted).
     */
    public function screeningQueue(Request $request): JsonResponse
    {
        $this->authorizeManagingEditor();

        $perPage = min($request->integer('per_page', 10), 100);

        $manuscripts = Manuscript::select([
            'id',
            'submission_id',
            'title',
            'authors',
            'author_email',
            'category',
            'status',
            'submitted_at',
            'created_at',
        ])
            ->where('status', 'submitted')
            ->latest('submitted_at')
            ->paginate($perPage);

        return response()->json([
            'data' => $manuscripts->items(),
            'meta' => [
                'total' => $manuscripts->total(),
                'per_page' => $manuscripts->perPage(),
                'current_page' => $manuscripts->currentPage(),
                'last_page' => $manuscripts->lastPage(),
            ],
        ]);
    }

    /**
     * Mark manuscript as screened with decision (forward/reject/revision).
     *
     * @param  array{
     *   decision: string,
     *   notes?: string
     * } $request
     */
    public function performScreening(Request $request, int $id): JsonResponse
    {
        $this->authorizeManagingEditor();

        $manuscript = Manuscript::findOrFail($id);

        if ($manuscript->status !== 'submitted') {
            return response()->json([
                'message' => 'Manuscript is not in submitted status.',
                'errors' => ['status' => ['Only submitted manuscripts can be screened.']],
            ], 422);
        }

        $validated = $request->validate([
            'decision' => ['required', 'string', Rule::in(['forward', 'reject', 'revision'])],
            'notes' => ['sometimes', 'string', 'max:5000', 'nullable'],
        ]);

        $statusMap = [
            'forward' => 'editor-review',
            'reject' => 'rejected',
            'revision' => 'revision-requested',
        ];

        $newStatus = $statusMap[$validated['decision']];

        $updateData = [
            'status' => $newStatus,
            'editor_notes' => $validated['notes'] ?? null,
        ];

        if ($newStatus === 'rejected') {
            $updateData['final_decision'] = 'rejected';
            $updateData['decision_date'] = now();
        }

        $manuscript->update($updateData);

        $this->logAction('decision_made', "Screening completed with decision '{$validated['decision']}' for manuscript: {$manuscript->submission_id}", [
            'manuscript_id' => $manuscript->id,
            'changes' => json_encode([
                'status' => ['old' => 'submitted', 'new' => $newStatus],
                'screening_decision' => $validated['decision'],
            ]),
        ]);

        return response()->json([
            'data' => $manuscript->fresh(),
            'message' => 'Screening completed successfully.',
        ]);
    }

    /**
     * Get manuscripts awaiting editor assignment.
     */
    public function editorAssignmentQueue(Request $request): JsonResponse
    {
        $this->authorizeManagingEditor();

        $perPage = min($request->integer('per_page', 10), 100);

        $manuscripts = Manuscript::select([
            'id',
            'submission_id',
            'title',
            'authors',
            'author_email',
            'category',
            'status',
            'submitted_at',
            'created_at',
        ])
            ->where('status', 'editor-review')
            ->latest('submitted_at')
            ->paginate($perPage);

        return response()->json([
            'data' => $manuscripts->items(),
            'meta' => [
                'total' => $manuscripts->total(),
                'per_page' => $manuscripts->perPage(),
                'current_page' => $manuscripts->currentPage(),
                'last_page' => $manuscripts->lastPage(),
            ],
        ]);
    }

    /**
     * Assign handling editor to manuscript.
     *
     * @param  array{
     *   editor_id: int,
     *   notes?: string
     * } $request
     */
    public function assignEditor(Request $request, int $id): JsonResponse
    {
        $this->authorizeManagingEditor();

        $manuscript = Manuscript::findOrFail($id);

        if (! in_array($manuscript->status, ['submitted', 'editor-review'], true)) {
            return response()->json([
                'message' => 'Manuscript cannot have an editor assigned in current status.',
                'errors' => ['status' => ['Manuscript must be in submitted or editor-review status.']],
            ], 422);
        }

        $validated = $request->validate([
            'editor_id' => ['required', 'integer', 'exists:users,id'],
            'notes' => ['sometimes', 'string', 'max:5000', 'nullable'],
        ]);

        $editor = User::findOrFail($validated['editor_id']);

        if (! $editor->hasAnyRole(['editor', 'managing-editor', 'admin'])) {
            return response()->json([
                'message' => 'Selected user is not an editor.',
                'errors' => ['editor_id' => ['User must have editor, managing-editor, or admin role.']],
            ], 422);
        }

        $oldStatus = $manuscript->status;

        $manuscript->update([
            'status' => 'under_review',
            'assigned_editor_id' => $editor->id,
            'editor_notes' => $validated['notes'] ?? $manuscript->editor_notes,
            'editor_review_completed_at' => now(),
        ]);

        Notification::add($editor->email, 'editor_assigned', 'Manuscript assigned to you',
            'You are now the handling editor for "'.$manuscript->title.'".', '/editor');

        $this->logAction('decision_made', "Editor {$editor->email} assigned to manuscript: {$manuscript->submission_id}", [
            'manuscript_id' => $manuscript->id,
            'changes' => json_encode([
                'status' => ['old' => $oldStatus, 'new' => 'under-review'],
                'assigned_editor_id' => $editor->id,
                'assigned_editor_email' => $editor->email,
            ]),
        ]);

        return response()->json([
            'data' => [
                'manuscript' => $manuscript->fresh(),
                'assigned_editor' => [
                    'id' => $editor->id,
                    'name' => $editor->name,
                    'email' => $editor->email,
                ],
            ],
            'message' => 'Editor assigned successfully.',
        ]);
    }

    /**
     * All manuscripts with status-based grouping for Kanban view.
     */
    public function manuscriptTracking(Request $request): JsonResponse
    {
        $this->authorizeManagingEditor();

        $statuses = [
            'submitted',
            'editor-review',
            'under-review',
            'revision-requested',
            'accepted',
            'rejected',
        ];

        $grouped = [];

        foreach ($statuses as $status) {
            $manuscripts = Manuscript::select([
                'id',
                'submission_id',
                'title',
                'authors',
                'category',
                'status',
                'submitted_at',
                'updated_at',
            ])
                ->where('status', $status)
                ->latest('submitted_at')
                ->limit(50)
                ->get()
                ->map(function ($manuscript) {
                    return [
                        'id' => $manuscript->id,
                        'submission_id' => $manuscript->submission_id,
                        'title' => $manuscript->title,
                        'authors' => $manuscript->authors,
                        'category' => $manuscript->category,
                        'status' => $manuscript->status,
                        'submitted_at' => $manuscript->submitted_at,
                        'days_in_status' => $manuscript->updated_at
                            ? now()->diffInDays($manuscript->updated_at)
                            : 0,
                    ];
                });

            $grouped[$status] = [
                'status' => $status,
                'count' => Manuscript::where('status', $status)->count(),
                'manuscripts' => $manuscripts,
            ];
        }

        return response()->json([
            'data' => $grouped,
            'message' => 'Success',
        ]);
    }

    /**
     * Authorize that the current user has managing-editor or admin role.
     */
    private function authorizeManagingEditor(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasAnyRole(['managing-editor', 'admin'])) {
            abort(403, 'Unauthorized. Managing editor or admin role required.');
        }
    }

    /**
     * Log an action to the audit_logs table.
     *
     * @param  array<string, mixed>  $extra
     */
    private function logAction(string $action, string $description, array $extra = []): void
    {
        $user = auth()->user();

        AuditLog::create(array_merge([
            'action' => $action,
            'actor_email' => $user?->email,
            'actor_type' => $user ? ($user->getRoleNames()[0] ?? 'user') : null,
            'description' => $description,
            'status' => 'success',
            'actor_ip' => request()->ip(),
        ], $extra));
    }
}
