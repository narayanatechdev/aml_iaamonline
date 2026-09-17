<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Notification;
use App\Models\Role;
use App\Models\ServiceClient;
use App\Models\User;
use App\Services\IaamIdService;
use App\Services\ManuscriptPresenter;
use App\Services\ManuscriptSubmissionService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Journal administration for the IAAM Portal's admin panel: every
 * manuscript, editor assignment, status changes, roles, and giving a person
 * (known by IAAM ID) roles on this journal. Needs the `journal.admin`
 * ability on the calling service key.
 */
class ServiceAdminController extends Controller
{
    /** Statuses an admin may move a manuscript between (the editor workflow's vocabulary). */
    public const STATUS_TRANSITIONS = [
        'submitted' => ['with_editor', 'under_review', 'rejected'],
        'with_editor' => ['under_review', 'revision_required', 'decision', 'rejected'],
        'under_review' => ['decision', 'revision_required', 'accepted', 'rejected'],
        'decision' => ['revision_required', 'accepted', 'rejected'],
        'revision_required' => ['with_editor', 'under_review', 'rejected'],
        'accepted' => ['published'],
        'rejected' => [],
        'published' => [],
    ];

    /** Roles that may handle a manuscript as its editor. */
    private const EDITOR_ROLES = ['editor', 'managing-editor', 'admin'];

    public function __construct(
        private IaamIdService $iaamIds,
        private ManuscriptPresenter $presenter,
    ) {}

    public function manuscripts(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'max:50'],
            'stage' => ['nullable', Rule::in(array_keys(ManuscriptSubmissionService::STATUS_GROUPS))],
            'search' => ['nullable', 'string', 'max:200'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $like = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $page = Manuscript::query()
            ->with('assignedEditor:id,name,email')
            ->when($validated['status'] ?? null, fn (Builder $q, $status) => $q->whereIn('status', $this->spellings($status)))
            ->when($validated['stage'] ?? null, fn (Builder $q, $stage) => $q->whereIn('status', ManuscriptSubmissionService::STATUS_GROUPS[$stage]))
            ->when($validated['search'] ?? null, function (Builder $q, $search) use ($like) {
                $term = '%'.str_replace(['%', '_'], ['\%', '\_'], $search).'%';
                $q->where(fn (Builder $q) => $q->where('title', $like, $term)
                    ->orWhere('submission_id', $like, $term)
                    ->orWhere('author_email', $like, $term)
                    ->orWhere('authors', $like, $term)
                    ->orWhere('iaam_id', $like, $term));
            })
            ->latest('submitted_at')
            ->paginate($validated['per_page'] ?? 25);

        $this->audit($request, 'service_fetch', 'Listed manuscripts (admin)');

        return response()->json([
            'data' => $page->getCollection()->map(fn (Manuscript $m) => $this->presenter->summary($m) + [
                'iaam_id' => $m->iaam_id,
                'authors' => $m->authors,
                'author_email' => $m->author_email,
                'editor' => $this->person($m->assignedEditor),
            ])->values(),
            'meta' => [
                'total' => $page->total(),
                'per_page' => $page->perPage(),
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
            ],
            'stats' => collect(ManuscriptSubmissionService::STATUS_GROUPS)
                ->map(fn ($statuses) => Manuscript::whereIn('status', $statuses)->count())
                ->put('total', Manuscript::count()),
        ]);
    }

    public function manuscript(Request $request, string $submissionId): JsonResponse
    {
        $manuscript = $this->findManuscript($submissionId);

        $this->audit($request, 'service_fetch', "Fetched {$submissionId} (admin)", $manuscript);

        return response()->json(['data' => $this->adminDetail($manuscript)]);
    }

    public function assignEditor(Request $request, string $submissionId): JsonResponse
    {
        $manuscript = $this->findManuscript($submissionId);

        $validated = $request->validate([
            'editor_id' => ['required', 'integer', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ]);

        if (! in_array(ManuscriptSubmissionService::normalizeStatus($manuscript->status), ['submitted', 'with_editor'], true)) {
            return response()->json([
                'message' => 'An editor can only be assigned while the manuscript is submitted or with the editor.',
                'errors' => ['status' => ['Manuscript must be submitted or with the editor.']],
            ], 422);
        }

        $editor = User::findOrFail($validated['editor_id']);

        if (! $editor->hasAnyRole(self::EDITOR_ROLES)) {
            return response()->json([
                'message' => 'Selected user is not an editor.',
                'errors' => ['editor_id' => ['User must have editor, managing-editor, or admin role.']],
            ], 422);
        }

        $oldStatus = $manuscript->status;

        // Same effect as AML's managing-editor assignment.
        $manuscript->update([
            'status' => 'under_review',
            'assigned_editor_id' => $editor->id,
            'editor_notes' => $validated['notes'] ?? $manuscript->editor_notes,
            'editor_review_completed_at' => now(),
        ]);

        Notification::add($editor->email, 'editor_assigned', 'Manuscript assigned to you',
            'You are now the handling editor for "'.$manuscript->title.'".', '/editor');

        $this->audit($request, 'decision_made', "Editor {$editor->email} assigned to manuscript: {$manuscript->submission_id}", $manuscript, [
            'status' => ['old' => $oldStatus, 'new' => 'under_review'],
            'assigned_editor_id' => $editor->id,
        ]);

        return response()->json(['data' => $this->adminDetail($manuscript->fresh())]);
    }

    public function updateStatus(Request $request, string $submissionId): JsonResponse
    {
        $manuscript = $this->findManuscript($submissionId);

        $validated = $request->validate([
            'status' => ['required', Rule::in(array_keys(self::STATUS_TRANSITIONS))],
            'notes' => ['nullable', 'string', 'max:5000'],
            'decision_letter' => ['nullable', 'string', 'max:10000'],
        ]);

        $current = ManuscriptSubmissionService::normalizeStatus($manuscript->status);
        $new = $validated['status'];
        $allowed = self::STATUS_TRANSITIONS[$current] ?? [];

        if ($new !== $current && ! in_array($new, $allowed, true)) {
            return response()->json([
                'message' => "Cannot move a manuscript from '{$current}' to '{$new}'.",
                'errors' => ['status' => ['Allowed from here: '.(implode(', ', $allowed) ?: 'none')]],
            ], 422);
        }

        $update = ['status' => $new];

        if (filled($validated['notes'] ?? null)) {
            $update['editor_notes'] = $validated['notes'];
        }

        if (filled($validated['decision_letter'] ?? null)) {
            $update['decision_notes'] = $validated['decision_letter'];
        }

        match ($new) {
            'with_editor' => $update['editor_review_completed_at'] = now(),
            'revision_required' => $update += ['final_decision' => 'revision-requested', 'decision_date' => now()],
            'accepted', 'rejected' => $update += ['final_decision' => $new, 'decision_date' => now()],
            'published' => $update['published_at'] = $manuscript->published_at ?? now(),
            default => null,
        };

        $oldStatus = $manuscript->status;
        $manuscript->update($update);

        $this->audit($request, 'decision_made', "Status changed from '{$oldStatus}' to '{$new}' for manuscript: {$manuscript->submission_id}", $manuscript, [
            'status' => ['old' => $oldStatus, 'new' => $new],
        ]);

        return response()->json(['data' => $this->adminDetail($manuscript->fresh())]);
    }

    public function editors(): JsonResponse
    {
        return response()->json([
            'data' => User::whereHas('activeRoles', fn (Builder $q) => $q->whereIn('name', self::EDITOR_ROLES))
                ->orderBy('name')
                ->get(['id', 'name', 'first_name', 'last_name', 'email', 'iaam_id'])
                ->map(fn (User $u) => $this->person($u) + ['roles' => $u->getRoleNames()])
                ->values(),
        ]);
    }

    public function roles(): JsonResponse
    {
        return response()->json([
            'data' => Role::withCount(['users as holders_count' => fn (Builder $q) => $q->where('role_user.is_active', true)])
                ->orderBy('name')
                ->get()
                ->map(fn (Role $r) => [
                    'name' => $r->name,
                    'display_name' => $r->display_name ?: Str::headline($r->name),
                    'description' => $r->description,
                    'type' => $r->type,
                    'is_active' => (bool) $r->is_active,
                    'holders' => $r->holders_count,
                ])
                ->values(),
        ]);
    }

    public function createRole(Request $request): JsonResponse
    {
        // Same rules as AML's own role admin.
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name', 'regex:/^[a-z0-9\-_]+$/'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['nullable', 'string', 'max:100'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'] ?? Str::headline($validated['name']),
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? 'custom',
            'is_active' => true,
        ]);

        $this->audit($request, 'role_created', "Role created: {$role->name}");

        return response()->json(['data' => ['name' => $role->name, 'display_name' => $role->display_name]], 201);
    }

    /** Everyone holding a role other than plain author. */
    public function staff(): JsonResponse
    {
        return response()->json([
            'data' => User::whereHas('activeRoles', fn (Builder $q) => $q->where('name', '!=', 'author'))
                ->orderBy('name')
                ->get(['id', 'name', 'first_name', 'last_name', 'email', 'iaam_id'])
                ->map(fn (User $u) => $this->person($u) + ['roles' => $u->getRoleNames()])
                ->values(),
        ]);
    }

    public function userRoles(string $iaamId): JsonResponse
    {
        if (! $this->iaamIds->isValid($iaamId)) {
            return response()->json(['message' => 'Malformed IAAM ID.'], 422);
        }

        $user = User::where('iaam_id', $iaamId)->first();

        return response()->json(['data' => [
            'iaam_id' => $iaamId,
            'has_account' => (bool) $user,
            'roles' => collect($user?->getRoleNames() ?? [])->sort()->values()->all(),
        ]]);
    }

    /**
     * Give a person — known to the Portal by IAAM ID — exactly these roles on
     * this journal, creating or linking their journal account first. A new
     * account gets an email to set its password.
     */
    public function syncUserRoles(Request $request, string $iaamId): JsonResponse
    {
        if (! $this->iaamIds->isValid($iaamId)) {
            return response()->json(['message' => 'Malformed IAAM ID.'], 422);
        }

        $validated = $request->validate([
            'roles' => ['present', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'affiliation' => ['nullable', 'string', 'max:500'],
            'country' => ['nullable', 'string', 'max:255'],
            'send_setup_email' => ['sometimes', 'boolean'],
        ]);

        $user = User::where('iaam_id', $iaamId)->first();
        $byEmail = User::whereRaw('lower(email) = ?', [strtolower($validated['email'])])->first();

        if (! $user && $byEmail && filled($byEmail->iaam_id) && $byEmail->iaam_id !== $iaamId) {
            return response()->json([
                'message' => "This email already belongs to a journal account with a different IAAM ID ({$byEmail->iaam_id}).",
                'code' => 'iaam_id_conflict',
            ], 409);
        }

        $created = false;

        if (! $user && $byEmail) {
            $byEmail->forceFill(['iaam_id' => $iaamId])->save();
            $user = $byEmail;
        }

        if (! $user) {
            if (empty($validated['roles'])) {
                return response()->json(['data' => ['iaam_id' => $iaamId, 'has_account' => false, 'roles' => [], 'created' => false, 'setup_email' => 'skipped']]);
            }

            $user = User::create([
                'iaam_id' => $iaamId,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'first_name' => $validated['first_name'] ?? null,
                'last_name' => $validated['last_name'] ?? null,
                'affiliation' => $validated['affiliation'] ?? null,
                'country' => $validated['country'] ?? null,
                'password' => Str::random(40),
                'join_date' => now(),
            ]);
            $created = true;
        }

        $by = $this->clientLabel($request);
        $oldRoles = $user->getRoleNames();
        $roleIds = Role::whereIn('name', $validated['roles'])->pluck('id')->all();

        DB::transaction(function () use ($user, $roleIds, $by) {
            $user->roles()->wherePivot('is_active', true)->whereNotIn('roles.id', $roleIds)->get()
                ->each(fn (Role $role) => $user->roles()->updateExistingPivot($role->id, [
                    'is_active' => false,
                    'revoked_at' => now(),
                    'revoked_by' => $by,
                ]));

            foreach ($roleIds as $roleId) {
                $active = $user->roles()->where('roles.id', $roleId)->wherePivot('is_active', true)->exists();

                if (! $active) {
                    $user->roles()->syncWithoutDetaching([$roleId => [
                        'is_active' => true,
                        'assigned_at' => now(),
                        'assigned_by' => $by,
                        'revoked_at' => null,
                        'revoked_by' => null,
                    ]]);
                }
            }
        });

        $newRoles = collect($user->fresh()->getRoleNames())->sort()->values()->all();
        $user->forceFill(['is_reviewer' => in_array('reviewer', $newRoles, true)])->save();

        $setupEmail = 'skipped';

        if ($created || ($validated['send_setup_email'] ?? false)) {
            try {
                $setupEmail = Password::sendResetLink(['email' => $user->email]) === Password::RESET_LINK_SENT ? 'sent' : 'failed';
            } catch (\Throwable $e) {
                report($e);
                $setupEmail = 'failed';
            }
        }

        $this->audit($request, 'roles_updated', "Roles for {$user->email} ({$iaamId})".($created ? ' — account created' : ''), null, [
            'roles' => ['old' => $oldRoles, 'new' => $newRoles],
        ]);

        return response()->json(['data' => [
            'iaam_id' => $iaamId,
            'has_account' => true,
            'created' => $created,
            'roles' => $newRoles,
            'setup_email' => $setupEmail,
        ]]);
    }

    private function adminDetail(Manuscript $m): array
    {
        $m->loadMissing(['files', 'reviews', 'sdgs', 'reviewAssignments', 'assignedEditor']);

        return $this->presenter->detail($m) + [
            'iaam_id' => $m->iaam_id,
            'editor' => $this->person($m->assignedEditor),
            'editor_notes' => $m->editor_notes,
            'decision_letter' => $m->decision_notes,
            'similarity_score' => $m->similarity_score,
            'allowed_statuses' => self::STATUS_TRANSITIONS[ManuscriptSubmissionService::normalizeStatus($m->status)] ?? [],
            'can_assign_editor' => in_array(ManuscriptSubmissionService::normalizeStatus($m->status), ['submitted', 'with_editor'], true),
            'reviewers' => $m->reviewAssignments->map(fn ($a) => [
                'name' => $a->reviewer_name,
                'email' => $a->reviewer_email,
                'status' => $a->status,
                'invited_at' => optional($a->invited_at)->toIso8601String(),
                'due_date' => optional($a->due_date)->toIso8601String(),
            ])->values(),
        ];
    }

    private function findManuscript(string $submissionId): Manuscript
    {
        return Manuscript::where('submission_id', $submissionId)->firstOrFail();
    }

    /** A status as stored may use either spelling. */
    private function spellings(string $status): array
    {
        return array_values(array_unique(array_merge(
            [$status, ManuscriptSubmissionService::normalizeStatus($status)],
            array_keys(ManuscriptSubmissionService::STATUS_ALIASES, ManuscriptSubmissionService::normalizeStatus($status), true),
        )));
    }

    private function person(?User $user): ?array
    {
        return $user ? [
            'id' => $user->id,
            'name' => $user->full_name ?: $user->name,
            'email' => $user->email,
            'iaam_id' => $user->iaam_id,
        ] : null;
    }

    private function clientLabel(Request $request): string
    {
        /** @var ServiceClient|null $client */
        $client = $request->attributes->get('service_client');

        return 'service:'.($client?->name ?? 'unknown');
    }

    private function audit(Request $request, string $action, string $description, ?Manuscript $manuscript = null, ?array $changes = null): void
    {
        AuditLog::create([
            'action' => $action,
            'actor_email' => $this->clientLabel($request),
            'actor_type' => 'service_client',
            'manuscript_id' => $manuscript?->id,
            'description' => $description,
            'changes' => $changes,
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);
    }
}
