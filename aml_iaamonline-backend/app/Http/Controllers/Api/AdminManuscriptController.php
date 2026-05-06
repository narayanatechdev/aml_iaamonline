<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminManuscriptController extends Controller
{
    /**
     * Valid status values for manuscripts.
     */
    private const VALID_STATUSES = [
        'submitted',
        'editor-review',
        'under-review',
        'revision-requested',
        'accepted',
        'rejected',
    ];

    /**
     * Valid status transitions map.
     *
     * @var array<string, string[]>
     */
    private const STATUS_TRANSITIONS = [
        'submitted' => ['editor-review', 'rejected'],
        'editor-review' => ['under-review', 'revision-requested', 'rejected'],
        'under-review' => ['revision-requested', 'accepted', 'rejected'],
        'revision-requested' => ['submitted', 'under-review', 'rejected'],
        'accepted' => [],
        'rejected' => [],
    ];

    /**
     * List all manuscripts with filters (status, date range, editor, category).
     *
     * @param  array{
     *   status?: string,
     *   category?: string,
     *   from_date?: string,
     *   to_date?: string,
     *   search?: string,
     *   sort_by?: string,
     *   sort_order?: string,
     *   per_page?: int
     * } $request
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $query = Manuscript::select([
            'id',
            'submission_id',
            'title',
            'authors',
            'author_email',
            'category',
            'status',
            'submitted_at',
            'created_at',
            'updated_at',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('from_date')) {
            $query->where('submitted_at', '>=', Carbon::parse($request->input('from_date'))->startOfDay());
        }

        if ($request->filled('to_date')) {
            $query->where('submitted_at', '<=', Carbon::parse($request->input('to_date'))->endOfDay());
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('submission_id', 'ilike', "%{$search}%")
                    ->orWhere('authors', 'ilike', "%{$search}%")
                    ->orWhere('author_email', 'ilike', "%{$search}%");
            });
        }

        $sortBy = $request->input('sort_by', 'submitted_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $allowedSorts = ['submitted_at', 'title', 'status', 'created_at'];

        if (in_array($sortBy, $allowedSorts, true)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest('submitted_at');
        }

        $perPage = min($request->integer('per_page', 10), 100);
        $manuscripts = $query->paginate($perPage);

        $data = collect($manuscripts->items())->map(function ($manuscript) {
            return [
                'id' => $manuscript->id,
                'submission_id' => $manuscript->submission_id,
                'title' => $manuscript->title,
                'authors' => $manuscript->authors,
                'author_email' => $manuscript->author_email,
                'category' => $manuscript->category,
                'status' => $manuscript->status,
                'submitted_at' => $manuscript->submitted_at,
                'days_in_status' => $manuscript->updated_at ? Carbon::parse($manuscript->updated_at)->diffInDays(now()) : 0,
            ];
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'total' => $manuscripts->total(),
                'per_page' => $manuscripts->perPage(),
                'current_page' => $manuscripts->currentPage(),
                'last_page' => $manuscripts->lastPage(),
            ],
        ]);
    }

    /**
     * Get manuscript detail with all related data (files, reviews, timeline, audit logs).
     */
    public function show(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $manuscript = Manuscript::with([
            'files',
            'reviews',
            'reviewAssignments',
            'auditLogs' => function ($query) {
                $query->latest()->limit(50);
            },
        ])->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $manuscript->id,
                'submission_id' => $manuscript->submission_id,
                'title' => $manuscript->title,
                'authors' => $manuscript->authors,
                'author_email' => $manuscript->author_email,
                'author_affiliation' => $manuscript->author_affiliation,
                'abstract' => $manuscript->abstract,
                'keywords' => $manuscript->keywords,
                'category' => $manuscript->category,
                'status' => $manuscript->status,
                'file_path' => $manuscript->file_path,
                'file_name' => $manuscript->file_name,
                'file_size' => $manuscript->file_size,
                'submitted_at' => $manuscript->submitted_at,
                'editor_review_completed_at' => $manuscript->editor_review_completed_at,
                'editor_notes' => $manuscript->editor_notes,
                'peer_review_completed_at' => $manuscript->peer_review_completed_at,
                'reviewer_count' => $manuscript->reviewer_count,
                'final_decision' => $manuscript->final_decision,
                'decision_date' => $manuscript->decision_date,
                'decision_notes' => $manuscript->decision_notes,
                'files' => $manuscript->files,
                'reviews' => $manuscript->reviews,
                'review_assignments' => $manuscript->reviewAssignments,
                'audit_logs' => $manuscript->auditLogs,
                'created_at' => $manuscript->created_at,
                'updated_at' => $manuscript->updated_at,
            ],
            'message' => 'Success',
        ]);
    }

    /**
     * Change manuscript status with validation.
     *
     * @param  array{
     *   status: string,
     *   notes?: string
     * } $request
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $manuscript = Manuscript::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(self::VALID_STATUSES)],
            'notes' => ['sometimes', 'string', 'max:5000', 'nullable'],
        ]);

        $currentStatus = $manuscript->status;
        $newStatus = $validated['status'];

        $allowedTransitions = self::STATUS_TRANSITIONS[$currentStatus] ?? [];
        if (! in_array($newStatus, $allowedTransitions, true) && $currentStatus !== $newStatus) {
            return response()->json([
                'message' => "Invalid status transition from '{$currentStatus}' to '{$newStatus}'.",
                'errors' => [
                    'status' => ["Cannot transition from '{$currentStatus}' to '{$newStatus}'. Allowed: ".implode(', ', $allowedTransitions)],
                ],
            ], 422);
        }

        $updateData = ['status' => $newStatus];

        if (isset($validated['notes'])) {
            $updateData['editor_notes'] = $validated['notes'];
        }

        if ($newStatus === 'editor-review') {
            $updateData['editor_review_completed_at'] = now();
        }

        if (in_array($newStatus, ['accepted', 'rejected'], true)) {
            $updateData['final_decision'] = $newStatus;
            $updateData['decision_date'] = now();
        }

        $manuscript->update($updateData);

        $this->logAction('decision_made', "Status changed from '{$currentStatus}' to '{$newStatus}' for manuscript: {$manuscript->submission_id}", [
            'manuscript_id' => $manuscript->id,
            'changes' => json_encode(['status' => ['old' => $currentStatus, 'new' => $newStatus]]),
        ]);

        return response()->json([
            'data' => $manuscript->fresh(),
            'message' => 'Manuscript status updated successfully.',
        ]);
    }

    /**
     * Return status change history/timeline for manuscript.
     */
    public function getTimeline(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $manuscript = Manuscript::findOrFail($id);

        $auditLogs = AuditLog::where('manuscript_id', $id)
            ->whereIn('action', ['submission_created', 'decision_made', 'review_submitted', 'reviewer_invited'])
            ->select(['id', 'action', 'actor_email', 'actor_type', 'description', 'status', 'created_at'])
            ->latest()
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'actor_email' => $log->actor_email,
                    'actor_type' => $log->actor_type,
                    'description' => $log->description,
                    'status' => $log->status,
                    'timestamp' => $log->created_at,
                ];
            });

        return response()->json([
            'data' => [
                'manuscript_id' => $manuscript->id,
                'submission_id' => $manuscript->submission_id,
                'current_status' => $manuscript->status,
                'timeline' => $auditLogs,
            ],
            'message' => 'Success',
        ]);
    }

    /**
     * Authorize that the current user has admin role.
     */
    private function authorizeAdmin(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasRole('admin')) {
            abort(403, 'Unauthorized. Admin role required.');
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
