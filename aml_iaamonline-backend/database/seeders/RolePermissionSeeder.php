<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create all permissions
        $this->createPermissions();

        // Create roles
        $authorRole = $this->createRole('author', 'Author', 'author', 'Users who submit manuscripts');
        $reviewerRole = $this->createRole('reviewer', 'Reviewer', 'reviewer', 'Experts who review manuscripts');
        $editorRole = $this->createRole('editor', 'Editor', 'editor', 'Journal editors managing the review process');
        $publisherRole = $this->createRole('publisher', 'Publisher', 'publisher', 'Manages public-facing website content such as the homepage');
        $adminRole = $this->createRole('admin', 'Administrator', 'admin', 'System administrators');

        // Assign permissions to roles
        $this->assignAuthorPermissions($authorRole);
        $this->assignReviewerPermissions($reviewerRole);
        $this->assignEditorPermissions($editorRole);
        $this->assignPublisherPermissions($publisherRole);
        $this->assignAdminPermissions($adminRole);
    }

    private function createRole(string $name, string $displayName, string $type, string $description): Role
    {
        return Role::firstOrCreate(
            ['name' => $name],
            [
                'display_name' => $displayName,
                'description' => $description,
                'type' => $type,
                'is_active' => true,
            ]
        );
    }

    private function createPermissions(): void
    {
        $permissions = [
            // Manuscript permissions
            ['name' => 'manuscript:create', 'display_name' => 'Create Manuscript', 'resource' => 'manuscript', 'action' => 'create', 'category' => 'manuscript'],
            ['name' => 'manuscript:view_own', 'display_name' => 'View Own Manuscript', 'resource' => 'manuscript', 'action' => 'view_own', 'category' => 'manuscript'],
            ['name' => 'manuscript:view_all', 'display_name' => 'View All Manuscripts', 'resource' => 'manuscript', 'action' => 'view_all', 'category' => 'manuscript'],
            ['name' => 'manuscript:edit_own', 'display_name' => 'Edit Own Manuscript', 'resource' => 'manuscript', 'action' => 'edit_own', 'category' => 'manuscript'],
            ['name' => 'manuscript:edit_all', 'display_name' => 'Edit Any Manuscript', 'resource' => 'manuscript', 'action' => 'edit_all', 'category' => 'manuscript'],
            ['name' => 'manuscript:download', 'display_name' => 'Download Manuscript', 'resource' => 'manuscript', 'action' => 'download', 'category' => 'manuscript'],
            ['name' => 'manuscript:delete', 'display_name' => 'Delete Manuscript', 'resource' => 'manuscript', 'action' => 'delete', 'category' => 'manuscript'],

            // Review permissions
            ['name' => 'review:view_assigned', 'display_name' => 'View Assigned Manuscripts', 'resource' => 'review', 'action' => 'view_assigned', 'category' => 'review'],
            ['name' => 'review:access_pdf', 'display_name' => 'Access PDF for Review', 'resource' => 'review', 'action' => 'access_pdf', 'category' => 'review'],
            ['name' => 'review:submit', 'display_name' => 'Submit Review', 'resource' => 'review', 'action' => 'submit', 'category' => 'review'],
            ['name' => 'review:view_all', 'display_name' => 'View All Reviews', 'resource' => 'review', 'action' => 'view_all', 'category' => 'review'],
            ['name' => 'review:manage_assignments', 'display_name' => 'Manage Reviewer Assignments', 'resource' => 'review', 'action' => 'manage_assignments', 'category' => 'review'],
            ['name' => 'review:send_invitations', 'display_name' => 'Send Review Invitations', 'resource' => 'review', 'action' => 'send_invitations', 'category' => 'review'],
            ['name' => 'review:delete', 'display_name' => 'Delete Review', 'resource' => 'review', 'action' => 'delete', 'category' => 'review'],

            // Editorial decision permissions
            ['name' => 'decision:make', 'display_name' => 'Make Editorial Decision', 'resource' => 'decision', 'action' => 'make', 'category' => 'manuscript'],
            ['name' => 'decision:override', 'display_name' => 'Override Decision', 'resource' => 'decision', 'action' => 'override', 'category' => 'manuscript'],

            // User management permissions
            ['name' => 'user:view', 'display_name' => 'View Users', 'resource' => 'user', 'action' => 'view', 'category' => 'user'],
            ['name' => 'user:create', 'display_name' => 'Create User', 'resource' => 'user', 'action' => 'create', 'category' => 'user'],
            ['name' => 'user:edit', 'display_name' => 'Edit User', 'resource' => 'user', 'action' => 'edit', 'category' => 'user'],
            ['name' => 'user:delete', 'display_name' => 'Delete User', 'resource' => 'user', 'action' => 'delete', 'category' => 'user'],
            ['name' => 'user:manage_roles', 'display_name' => 'Manage User Roles', 'resource' => 'user', 'action' => 'manage_roles', 'category' => 'user'],

            // Settings permissions
            ['name' => 'settings:view', 'display_name' => 'View Settings', 'resource' => 'settings', 'action' => 'view', 'category' => 'settings'],
            ['name' => 'settings:edit', 'display_name' => 'Edit Settings', 'resource' => 'settings', 'action' => 'edit', 'category' => 'settings'],

            // Report permissions
            ['name' => 'report:view', 'display_name' => 'View Reports', 'resource' => 'report', 'action' => 'view', 'category' => 'reports'],
            ['name' => 'report:generate', 'display_name' => 'Generate Reports', 'resource' => 'report', 'action' => 'generate', 'category' => 'reports'],
            ['name' => 'report:export', 'display_name' => 'Export Reports', 'resource' => 'report', 'action' => 'export', 'category' => 'reports'],

            // Homepage / content management permissions
            ['name' => 'homepage:view', 'display_name' => 'View Homepage Content', 'resource' => 'homepage', 'action' => 'view', 'category' => 'content'],
            ['name' => 'homepage:manage', 'display_name' => 'Manage Homepage Content', 'resource' => 'homepage', 'action' => 'manage', 'category' => 'content'],

            // Published article editing permissions
            ['name' => 'article:view', 'display_name' => 'View Article Records', 'resource' => 'article', 'action' => 'view', 'category' => 'content'],
            ['name' => 'article:edit', 'display_name' => 'Edit Article Records', 'resource' => 'article', 'action' => 'edit', 'category' => 'content'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                array_merge($permission, [
                    'description' => $permission['display_name'] ?? '',
                    'is_active' => true,
                ])
            );
        }
    }

    private function assignAuthorPermissions(Role $role): void
    {
        $permissions = [
            'manuscript:create',
            'manuscript:view_own',
            'manuscript:edit_own',
            'manuscript:download',
        ];

        $this->attachPermissions($role, $permissions);
    }

    private function assignReviewerPermissions(Role $role): void
    {
        $permissions = [
            'review:view_assigned',
            'review:access_pdf',
            'review:submit',
        ];

        $this->attachPermissions($role, $permissions);
    }

    private function assignEditorPermissions(Role $role): void
    {
        $permissions = [
            'manuscript:view_all',
            'manuscript:edit_all',
            'review:view_assigned',
            'review:view_all',
            'review:manage_assignments',
            'review:send_invitations',
            'decision:make',
            'report:view',
            'report:generate',
            'article:view',
            'article:edit',
        ];

        $this->attachPermissions($role, $permissions);
    }

    private function assignPublisherPermissions(Role $role): void
    {
        $permissions = [
            'homepage:view',
            'homepage:manage',
        ];

        $this->attachPermissions($role, $permissions);
    }

    private function assignAdminPermissions(Role $role): void
    {
        // Admins get all permissions
        $permissions = Permission::where('is_active', true)
            ->pluck('id')
            ->toArray();

        $role->permissions()->sync($permissions);
    }

    private function attachPermissions(Role $role, array $permissionNames): void
    {
        $permissions = Permission::whereIn('name', $permissionNames)
            ->where('is_active', true)
            ->pluck('id')
            ->toArray();

        $role->permissions()->sync($permissions);
    }
}
