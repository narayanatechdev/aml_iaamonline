<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * List users with pagination, filters (role, status, search by name/email).
     *
     * @param  array{
     *   role?: string,
     *   status?: string,
     *   search?: string,
     *   per_page?: int
     * } $request
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $isPostgres = config('database.default') === 'pgsql';
        $likeOp     = $isPostgres ? 'ilike' : 'like';

        $query = User::select([
                'id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at',
                'title', 'first_name', 'last_name', 'degree', 'position',
                'orcid', 'affiliation', 'country', 'city',
                'is_reviewer', 'join_date',
            ])
            ->with(['activeRoles:id,name,display_name'])
            ->with(['authorProfile:id,user_id,article_count,orcid']);

        if ($request->filled('role')) {
            $query->whereHas('activeRoles', function ($q) use ($request) {
                $q->where('name', $request->input('role'));
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search, $likeOp) {
                $q->where('name',        $likeOp, "%{$search}%")
                  ->orWhere('email',       $likeOp, "%{$search}%")
                  ->orWhere('affiliation', $likeOp, "%{$search}%")
                  ->orWhere('country',     $likeOp, "%{$search}%")
                  ->orWhere('orcid',       $likeOp, "%{$search}%");
            });
        }

        $perPage = min($request->integer('per_page', 20), 100);
        $users   = $query->latest()->paginate($perPage);

        $items = collect($users->items())->map(function (User $u) {
            $roles = $u->activeRoles->pluck('name')->toArray();
            return [
                'id'           => $u->id,
                'name'         => $u->name,
                'first_name'   => $u->first_name,
                'last_name'    => $u->last_name,
                'title'        => $u->title,
                'email'        => $u->email,
                'orcid'        => $u->orcid ?? $u->authorProfile?->orcid,
                'affiliation'  => $u->affiliation,
                'country'      => $u->country,
                'city'         => $u->city,
                'degree'       => $u->degree,
                'position'     => $u->position,
                'is_reviewer'  => (bool) $u->is_reviewer,
                'join_date'    => $u->join_date,
                'created_at'   => $u->created_at,
                'article_count'=> $u->authorProfile?->article_count ?? 0,
                'author_id'    => $u->authorProfile?->id,
                'roles'        => $roles,
                'is_admin'     => in_array('admin', $roles),
                'verified'     => ! is_null($u->email_verified_at),
            ];
        });

        return response()->json([
            'data' => $items,
            'meta' => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Create a new user with email unique validation and password hashing.
     *
     * @param  array{
     *   name: string,
     *   email: string,
     *   password: string,
     *   role?: string
     * } $request
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['sometimes', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (isset($validated['role'])) {
            $role = Role::where('name', $validated['role'])->first();
            if ($role) {
                $user->assignRole($role);
            }
        }

        $this->logAction('notification_sent', "Created user: {$user->email}", [
            'resource_type' => 'user',
            'resource_id' => (string) $user->id,
        ]);

        return response()->json([
            'data' => $user->load('activeRoles'),
            'message' => 'User created successfully.',
        ], 201);
    }

    /**
     * Get user details with roles.
     */
    public function show(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user = User::select([
                'id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at',
                'title', 'first_name', 'last_name', 'degree', 'position', 'specialty',
                'field_of_study', 'orcid', 'phone', 'mobile', 'fax',
                'affiliation', 'country', 'city', 'postal_code',
                'home_page', 'alt_email', 'username',
                'is_reviewer', 'receive_news', 'join_date', 'comments',
            ])
            ->with(['activeRoles:id,name,display_name,description', 'authorProfile:id,user_id,article_count,orcid'])
            ->findOrFail($id);

        $roles = $user->activeRoles->pluck('name')->toArray();

        return response()->json([
            'data' => array_merge($user->toArray(), [
                'roles'         => $roles,
                'is_admin'      => in_array('admin', $roles),
                'verified'      => ! is_null($user->email_verified_at),
                'article_count' => $user->authorProfile?->article_count ?? 0,
                'author_id'     => $user->authorProfile?->id,
                'status'        => 'active',
            ]),
            'message' => 'Success',
        ]);
    }

    /**
     * Update user name/email/status.
     *
     * @param  array{
     *   name?: string,
     *   email?: string
     * } $request
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $changes = [];
        foreach ($validated as $key => $value) {
            if ($user->{$key} !== $value) {
                $changes[$key] = ['old' => $user->{$key}, 'new' => $value];
            }
        }

        $user->update($validated);

        $this->logAction('notification_sent', "Updated user: {$user->email}", [
            'resource_type' => 'user',
            'resource_id' => (string) $user->id,
            'changes' => json_encode($changes),
        ]);

        return response()->json([
            'data' => $user->fresh(['activeRoles']),
            'message' => 'User updated successfully.',
        ]);
    }

    /**
     * Soft delete user.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
                'errors' => ['id' => ['Cannot delete self.']],
            ], 422);
        }

        $email = $user->email;
        $user->delete();

        $this->logAction('notification_sent', "Deleted user: {$email}", [
            'resource_type' => 'user',
            'resource_id' => (string) $id,
        ]);

        return response()->json([
            'data' => null,
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Assign/remove roles for user.
     *
     * @param  array{
     *   roles: string[]
     * } $request
     */
    public function updateRoles(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['exists:roles,name'],
        ]);

        $oldRoles = $user->getRoleNames();

        $user->roles()->detach();

        foreach ($validated['roles'] as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->assignRole($role);
            }
        }

        $this->logAction('notification_sent', "Updated roles for user: {$user->email}", [
            'resource_type' => 'user',
            'resource_id' => (string) $user->id,
            'changes' => json_encode([
                'roles' => ['old' => $oldRoles, 'new' => $validated['roles']],
            ]),
        ]);

        return response()->json([
            'data' => $user->fresh(['activeRoles']),
            'message' => 'User roles updated successfully.',
        ]);
    }

    /**
     * Generate and send password reset link.
     */
    public function resetPassword(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user = User::findOrFail($id);

        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status === Password::RESET_LINK_SENT) {
            $this->logAction('notification_sent', "Password reset sent to: {$user->email}", [
                'resource_type' => 'user',
                'resource_id' => (string) $user->id,
            ]);

            return response()->json([
                'data' => null,
                'message' => 'Password reset link sent successfully.',
            ]);
        }

        return response()->json([
            'message' => 'Failed to send password reset link.',
            'errors' => ['email' => [__($status)]],
        ], 422);
    }

    /**
     * Get all articles authored by this user (via their linked author record).
     * Join: users → authors (user_id) → article_authors (author_id) → articles (legacy_id)
     */
    public function articles(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $user   = User::findOrFail($id);
        $author = \App\Models\Author::where('user_id', $id)->first();

        if (! $author) {
            return response()->json([
                'data'    => [],
                'meta'    => ['total' => 0, 'author_linked' => false],
                'message' => 'This user has no linked author profile.',
            ]);
        }

        $articles = \App\Models\Article::select([
                'articles.id', 'articles.legacy_id', 'articles.title',
                'articles.document_type', 'articles.subject',
                'articles.doi', 'articles.volume', 'articles.issue',
                'articles.pages_from', 'articles.pages_to',
                'articles.publish_year', 'articles.publish_date',
                'articles.views_count', 'articles.pdf_downloads',
                'articles.pdf_url', 'articles.graphical_abstract_url',
                'article_authors.is_corresponding', 'article_authors.position as author_position',
            ])
            ->join('article_authors', 'articles.legacy_id', '=', 'article_authors.article_id')
            ->where('article_authors.author_id', $author->id)
            ->orderByDesc('articles.publish_year')
            ->orderByDesc('articles.publish_date')
            ->get();

        return response()->json([
            'data' => $articles,
            'meta' => [
                'total'         => $articles->count(),
                'author_id'     => $author->id,
                'author_linked' => true,
                'author_name'   => $author->name,
            ],
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
