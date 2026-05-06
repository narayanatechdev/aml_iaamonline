<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminRoleController extends Controller
{
    /**
     * List all roles with permission counts.
     */
    public function index(): JsonResponse
    {
        $this->authorizeAdmin();

        $roles = Role::withCount('activePermissions')
            ->latest()
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'display_name' => $role->display_name,
                    'description' => $role->description,
                    'type' => $role->type,
                    'is_active' => $role->is_active,
                    'permission_count' => $role->active_permissions_count,
                    'created_at' => $role->created_at,
                    'updated_at' => $role->updated_at,
                ];
            });

        return response()->json([
            'data' => $roles,
            'meta' => [
                'total' => $roles->count(),
                'per_page' => $roles->count(),
                'current_page' => 1,
            ],
        ]);
    }

    /**
     * Create a new role.
     *
     * @param  array{
     *   name: string,
     *   display_name?: string,
     *   description?: string,
     *   type?: string
     * } $request
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name', 'regex:/^[a-z0-9\-_]+$/'],
            'display_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:1000'],
            'type' => ['sometimes', 'string', 'max:100'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'] ?? ucfirst(str_replace(['-', '_'], ' ', $validated['name'])),
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? 'custom',
            'is_active' => true,
        ]);

        $this->logAction('notification_sent', "Created role: {$role->name}", [
            'resource_type' => 'role',
            'resource_id' => (string) $role->id,
        ]);

        return response()->json([
            'data' => $role,
            'message' => 'Role created successfully.',
        ], 201);
    }

    /**
     * Get role with permissions array.
     */
    public function show(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $role = Role::with(['activePermissions:id,name,display_name,description,category'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
                'type' => $role->type,
                'is_active' => $role->is_active,
                'permissions' => $role->activePermissions,
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ],
            'message' => 'Success',
        ]);
    }

    /**
     * Update role details.
     *
     * @param  array{
     *   name?: string,
     *   display_name?: string,
     *   description?: string,
     *   type?: string,
     *   is_active?: bool
     * } $request
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role->id), 'regex:/^[a-z0-9\-_]+$/'],
            'display_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:1000', 'nullable'],
            'type' => ['sometimes', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $changes = [];
        foreach ($validated as $key => $value) {
            if ($role->{$key} !== $value) {
                $changes[$key] = ['old' => $role->{$key}, 'new' => $value];
            }
        }

        $role->update($validated);

        $this->logAction('notification_sent', "Updated role: {$role->name}", [
            'resource_type' => 'role',
            'resource_id' => (string) $role->id,
            'changes' => json_encode($changes),
        ]);

        return response()->json([
            'data' => $role->fresh(),
            'message' => 'Role updated successfully.',
        ]);
    }

    /**
     * Delete role (check not in use).
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $role = Role::withCount('users')->findOrFail($id);

        if ($role->users_count > 0) {
            return response()->json([
                'message' => 'Cannot delete role that is assigned to users.',
                'errors' => ['id' => ["Role is assigned to {$role->users_count} user(s)."]],
            ], 422);
        }

        $protectedRoles = ['admin', 'managing-editor', 'editor', 'author'];
        if (in_array($role->name, $protectedRoles, true)) {
            return response()->json([
                'message' => 'Cannot delete system-protected role.',
                'errors' => ['id' => ['This role is protected and cannot be deleted.']],
            ], 422);
        }

        $roleName = $role->name;
        $role->delete();

        $this->logAction('notification_sent', "Deleted role: {$roleName}", [
            'resource_type' => 'role',
            'resource_id' => (string) $id,
        ]);

        return response()->json([
            'data' => null,
            'message' => 'Role deleted successfully.',
        ]);
    }

    /**
     * Assign permissions to role.
     *
     * @param  array{
     *   permissions: int[]|string[]
     * } $request
     */
    public function updatePermissions(Request $request, int $id): JsonResponse
    {
        $this->authorizeAdmin();

        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        $oldPermissions = $role->activePermissions()->pluck('name')->toArray();

        $role->permissions()->detach();

        foreach ($validated['permissions'] as $permissionId) {
            $permission = Permission::find($permissionId);
            if ($permission) {
                $role->givePermission($permission);
            }
        }

        $newPermissions = $role->fresh()->activePermissions()->pluck('name')->toArray();

        $this->logAction('notification_sent', "Updated permissions for role: {$role->name}", [
            'resource_type' => 'role',
            'resource_id' => (string) $role->id,
            'changes' => json_encode([
                'permissions' => ['old' => $oldPermissions, 'new' => $newPermissions],
            ]),
        ]);

        return response()->json([
            'data' => $role->load('activePermissions'),
            'message' => 'Role permissions updated successfully.',
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
