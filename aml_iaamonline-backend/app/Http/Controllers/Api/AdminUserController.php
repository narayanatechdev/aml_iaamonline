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

        $query = User::select(['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'])
            ->with(['activeRoles:id,name,display_name']);

        if ($request->filled('role')) {
            $query->whereHas('activeRoles', function ($q) use ($request) {
                $q->where('name', $request->input('role'));
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $perPage = min($request->integer('per_page', 10), 100);
        $users = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
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

        $user = User::select(['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at'])
            ->with(['activeRoles:id,name,display_name,description'])
            ->findOrFail($id);

        return response()->json([
            'data' => $user,
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
