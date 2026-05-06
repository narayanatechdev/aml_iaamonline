# User Roles & Permissions System

## Overview

The IAAM Journal Management System includes a comprehensive role-based access control (RBAC) system that manages user permissions across the application. This guide explains how to use, manage, and extend the roles and permissions system.

---

## System Architecture

### Database Schema

The role and permission system consists of 4 main tables:

1. **roles** - Defines available roles in the system
2. **permissions** - Defines granular permissions for resources
3. **role_user** - Junction table linking users to roles
4. **role_permission** - Junction table linking roles to permissions

### Models

```
User
  ├── roles() - Many-to-many relationship with Role
  ├── activeRoles() - Only active roles
  ├── permissions() - All permissions through roles
  ├── assignRole(Role)
  ├── removeRole(Role)
  ├── hasRole(string|Role)
  ├── hasAnyRole(array)
  ├── hasAllRoles(array)
  ├── hasPermission(string|Permission)
  └── can(string)

Role
  ├── users() - Many-to-many relationship with User
  ├── permissions() - Many-to-many relationship with Permission
  ├── activePermissions() - Only active permissions
  ├── givePermission(Permission)
  ├── revokePermission(Permission)
  └── hasPermission(Permission)

Permission
  └── roles() - Many-to-many relationship with Role
```

---

## Predefined Roles

### 1. Author
**Type:** `author`
**Description:** Users submitting manuscripts

**Permissions:**
- Submit manuscripts
- View own submission status
- Update own submission (before review)
- Download own rejection/acceptance letters

**Usage:**
```php
$user = User::find(1);
$user->assignRole('author');
// or
$authorRole = Role::where('name', 'author')->first();
$user->assignRole($authorRole);
```

---

### 2. Reviewer
**Type:** `reviewer`
**Description:** Experts invited to review manuscripts

**Permissions:**
- View assigned manuscripts
- Access manuscript PDFs
- Submit reviews
- Save draft reviews
- View reviewer guidelines

**Usage:**
```php
$user->assignRole('reviewer');
```

---

### 3. Editor
**Type:** `editor`
**Description:** Journal editors managing the review process

**Permissions:**
- View all manuscripts
- Filter manuscripts by status
- Invite reviewers
- View all reviews
- Make editorial decisions
- Send reviewer reminders
- Generate reports
- View statistics/dashboard
- Manage reviewer assignments
- Send decision letters

**Usage:**
```php
$editor = User::find(2);
$editor->assignRole('editor');
```

---

### 4. Admin
**Type:** `admin`
**Description:** System administrators

**Permissions:**
- All editor permissions
- Create/edit/delete roles
- Create/edit/delete permissions
- Assign roles to users
- Manage user accounts
- View audit logs
- Configure system settings
- View system statistics

**Usage:**
```php
$admin = User::find(3);
$admin->assignRole('admin');
```

---

## Permission Structure

### Predefined Permissions

Permissions follow the pattern: `resource:action`

#### Manuscript Permissions
- `manuscript:create` - Create/submit manuscript
- `manuscript:view` - View own manuscripts
- `manuscript:view_all` - View all manuscripts
- `manuscript:edit` - Edit manuscript details
- `manuscript:download` - Download manuscript files
- `manuscript:delete` - Delete manuscript

#### Review Permissions
- `review:view_assigned` - View assigned manuscripts for review
- `review:access_pdf` - Access PDF for review
- `review:submit` - Submit review
- `review:view_all` - View all reviews
- `review:delete` - Delete review
- `review:manage_assignments` - Manage reviewer assignments

#### User Permissions
- `user:view` - View users
- `user:create` - Create users
- `user:edit` - Edit users
- `user:delete` - Delete users
- `user:manage_roles` - Assign/revoke roles

#### Settings Permissions
- `settings:view` - View system settings
- `settings:edit` - Edit system settings

#### Report Permissions
- `report:view` - View reports
- `report:generate` - Generate custom reports
- `report:export` - Export reports

---

## Usage Examples

### Checking User Roles

```php
$user = User::find(1);

// Check single role
if ($user->hasRole('editor')) {
    // User is an editor
}

// Check any role
if ($user->hasAnyRole(['editor', 'admin'])) {
    // User is either editor or admin
}

// Check all roles
if ($user->hasAllRoles(['editor', 'admin'])) {
    // User has both editor AND admin roles
}
```

### Checking Permissions

```php
$user = User::find(1);

// Check permission by name
if ($user->hasPermission('manuscript:view_all')) {
    // Show all manuscripts
}

// Using can() method (alias for hasPermission)
if ($user->can('review:submit')) {
    // Show review submission form
}

// Check by Permission object
$permission = Permission::where('name', 'manuscript:view_all')->first();
if ($user->hasPermission($permission)) {
    // User has permission
}
```

### Managing User Roles

```php
$user = User::find(1);
$editorRole = Role::where('name', 'editor')->first();

// Assign role
$user->assignRole($editorRole);
// or
$user->assignRole('editor');

// Remove role
$user->removeRole($editorRole);
// or
$user->removeRole('editor');

// Get all user's active roles
$roles = $user->activeRoles()->get();
```

### Managing Role Permissions

```php
$role = Role::where('name', 'editor')->first();
$permission = Permission::where('name', 'manuscript:view_all')->first();

// Give permission to role
$role->givePermission($permission);

// Revoke permission from role
$role->revokePermission($permission);

// Check if role has permission
if ($role->hasPermission($permission)) {
    // Role has permission
}

// Get all permissions for role
$permissions = $role->activePermissions()->get();
```

---

## Creating Custom Roles

### Step 1: Create Role in Database (via seeder or migration)

```php
// In a seeder or directly
Role::create([
    'name' => 'chief-editor',
    'display_name' => 'Chief Editor',
    'description' => 'Senior editor with full control',
    'type' => 'editor',
    'is_active' => true,
]);
```

### Step 2: Assign Permissions to Role

```php
$chiefEditorRole = Role::where('name', 'chief-editor')->first();

// Get permissions to assign
$permissions = Permission::whereIn('name', [
    'manuscript:view_all',
    'review:view_all',
    'review:manage_assignments',
    'user:manage_roles',
])->get();

// Assign permissions
$permissions->each(function ($permission) use ($chiefEditorRole) {
    $chiefEditorRole->givePermission($permission);
});
```

### Step 3: Assign Role to Users

```php
$user = User::find(5);
$user->assignRole('chief-editor');
```

---

## Creating Custom Permissions

### Step 1: Create Permission in Database

```php
Permission::create([
    'name' => 'decision:override',
    'display_name' => 'Override Editorial Decision',
    'description' => 'Can override previous editorial decisions',
    'resource' => 'decision',
    'action' => 'override',
    'category' => 'manuscript',
    'is_active' => true,
]);
```

### Step 2: Add to Role

```php
$role = Role::where('name', 'chief-editor')->first();
$permission = Permission::where('name', 'decision:override')->first();

$role->givePermission($permission);
```

---

## Middleware & Authorization

### Checking Authorization in Controllers

```php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class EditorController extends Controller
{
    public function index(Request $request)
    {
        // Check single role
        if (!$request->user()->hasRole('editor')) {
            abort(403, 'Unauthorized');
        }

        // or check permission
        if (!$request->user()->can('manuscript:view_all')) {
            abort(403, 'Unauthorized');
        }

        // Proceed with logic
    }
}
```

### Using Laravel Policies

```php
// Create policy
php artisan make:policy ManuscriptPolicy --model=Manuscript

// In policy
public function viewAll(User $user)
{
    return $user->hasRole('editor') || $user->hasRole('admin');
}

// In controller
$this->authorize('viewAll', Manuscript::class);
```

---

## Database Seeding

Create a seeder to initialize default roles and permissions:

```php
// database/seeders/RolePermissionSeeder.php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            // Manuscript permissions
            ['name' => 'manuscript:create', 'display_name' => 'Create Manuscript', ...],
            ['name' => 'manuscript:view', 'display_name' => 'View Own Manuscript', ...],
            ['name' => 'manuscript:view_all', 'display_name' => 'View All Manuscripts', ...],
            // ... more permissions
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate($permission);
        }

        // Create roles
        $authorRole = Role::create([
            'name' => 'author',
            'display_name' => 'Author',
            'type' => 'author',
        ]);

        $reviewerRole = Role::create([
            'name' => 'reviewer',
            'display_name' => 'Reviewer',
            'type' => 'reviewer',
        ]);

        $editorRole = Role::create([
            'name' => 'editor',
            'display_name' => 'Editor',
            'type' => 'editor',
        ]);

        $adminRole = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'type' => 'admin',
        ]);

        // Assign permissions to roles
        // Authors can:
        $authorRole->givePermission(
            Permission::where('name', 'manuscript:create')->first()
        );

        // Editors can: (view all, manage assignments, etc.)
        // Admins can: (everything)
    }
}
```

Run the seeder:
```bash
php artisan db:seed --class=RolePermissionSeeder
```

---

## Active vs Inactive Roles/Permissions

Both roles and permissions can be toggled active/inactive for soft management:

```php
// Deactivate a role
$role = Role::find(1);
$role->update(['is_active' => false]);

// Only active roles are returned
$activeRoles = $user->activeRoles()->get();

// Check active permissions
$permissions = $role->activePermissions()->get();
```

---

## Audit Trail

Role assignments are tracked with metadata:

```php
// Access pivot data
$user = User::find(1);
$roles = $user->roles()->get();

foreach ($roles as $role) {
    echo $role->pivot->assigned_at; // When assigned
    echo $role->pivot->assigned_by; // Who assigned
    echo $role->pivot->revoked_at;  // When revoked
    echo $role->pivot->revoked_by;  // Who revoked
    echo $role->pivot->is_active;   // Currently active
}
```

---

## Best Practices

1. **Use Role-Based Access Control**: Check roles in middleware/controllers
2. **Fine-Grained Permissions**: Create specific permissions for each action
3. **Least Privilege**: Assign minimum necessary roles/permissions
4. **Audit Logging**: Always track who assigned/revoked roles
5. **Regular Review**: Periodically review user roles and permissions
6. **Documentation**: Document custom roles and permissions
7. **Testing**: Test authorization in feature tests
8. **Cache Permissions**: Consider caching permissions for performance

---

## Troubleshooting

### User Not Seeing Expected Features

```php
// Debug user roles
$user = User::find(1);
dd($user->activeRoles()->pluck('name'));

// Debug user permissions
dd($user->activeRoles()
    ->with('activePermissions')
    ->get()
    ->pluck('activePermissions')
    ->flatten()
    ->pluck('name'));
```

### Role Not Found

```php
// Create missing role
Role::firstOrCreate([
    'name' => 'editor',
    'display_name' => 'Editor',
    'type' => 'editor',
    'is_active' => true,
]);
```

---

## API Examples

### Assign Role via API

```http
POST /api/admin/users/{user_id}/roles
Content-Type: application/json

{
  "role_id": 2,
  "assigned_by": "admin@example.com"
}
```

### Check User Permissions

```http
GET /api/users/{user_id}/permissions
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": {
    "roles": ["editor"],
    "permissions": [
      "manuscript:view_all",
      "review:view_all",
      "review:manage_assignments"
    ]
  }
}
```

---

## Performance Optimization

### Eager Loading

```php
// Load roles and permissions together
$user = User::with('roles.permissions')->find(1);

// Avoid N+1 queries
$users = User::with('roles').get();
```

### Caching

```php
// Cache user permissions
$permissions = Cache::remember(
    "user.{$user->id}.permissions",
    now()->addHours(24),
    fn () => $user->activeRoles()
        ->with('activePermissions')
        ->get()
        ->pluck('activePermissions')
        ->flatten()
        ->pluck('name')
        ->toArray()
);
```

---

## Summary

The role and permission system provides:
- ✅ Flexible role management
- ✅ Granular permissions control
- ✅ Built-in authorization checks
- ✅ Audit tracking
- ✅ Easy role/permission assignment
- ✅ Scalable architecture

Use this system to control access across the IAAM Journal Management System effectively.
