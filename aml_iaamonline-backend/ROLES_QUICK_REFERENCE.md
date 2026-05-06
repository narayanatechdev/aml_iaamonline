# User Roles - Quick Reference

## 4 Predefined Roles

### 👤 Author
- Submit manuscripts
- View own submissions
- Edit own manuscripts (before review)

### 👁️ Reviewer
- View assigned manuscripts
- Access locked PDFs
- Submit reviews

### ✏️ Editor
- View all manuscripts
- Filter by status
- Invite reviewers
- View all reviews
- Make decisions

### 🔐 Admin
- All editor features
- Manage users & roles
- Configure settings
- View audit logs

---

## Quick Code Examples

### Assign Role
```php
$user = User::find(1);
$user->assignRole('editor');  // or pass Role object
```

### Check Role
```php
if ($user->hasRole('editor')) { }
if ($user->hasAnyRole(['editor', 'admin'])) { }
if ($user->hasAllRoles(['editor', 'admin'])) { }
```

### Check Permission
```php
if ($user->can('manuscript:view_all')) { }
if ($user->hasPermission('review:submit')) { }
```

### Remove Role
```php
$user->removeRole('editor');
```

### Create Custom Role
```php
Role::create([
    'name' => 'chief-editor',
    'display_name' => 'Chief Editor',
    'type' => 'editor',
    'is_active' => true,
]);
```

### Add Permission to Role
```php
$role = Role::find(1);
$permission = Permission::where('name', 'manuscript:view_all')->first();
$role->givePermission($permission);
```

---

## Permission Naming Convention

`resource:action`

**Resources:** manuscript, review, decision, user, settings, report
**Actions:** create, view, edit, delete, submit, manage, etc.

Examples:
- `manuscript:create`
- `review:submit`
- `decision:make`
- `user:manage_roles`

---

## In Controllers

```php
public function index(Request $request)
{
    if (!$request->user()->can('manuscript:view_all')) {
        abort(403);
    }
    // ...
}
```

---

## Database Tables

- `roles` - Role definitions
- `permissions` - Permission definitions
- `role_user` - User-Role assignments
- `role_permission` - Role-Permission assignments

---

## Seeding

```bash
php artisan db:seed --class=RolePermissionSeeder
```

This creates:
- 4 default roles (author, reviewer, editor, admin)
- 25+ default permissions
- All role-permission mappings

---

## Key Methods

**User Model:**
- `assignRole()` - Assign role to user
- `removeRole()` - Remove role from user
- `hasRole()` - Check if user has role
- `hasPermission()` - Check if user has permission
- `can()` - Alias for hasPermission()

**Role Model:**
- `givePermission()` - Give permission to role
- `revokePermission()` - Remove permission from role
- `hasPermission()` - Check if role has permission

---

## Troubleshooting

**User can't access feature?**
```php
// Check roles
dd($user->activeRoles()->pluck('name'));

// Check permissions
dd($user->activeRoles()
    ->with('activePermissions')
    ->get()
    ->pluck('activePermissions.*')
    ->pluck('name'));
```

**Role not working?**
```php
// Create missing role
Role::firstOrCreate([
    'name' => 'editor',
    'display_name' => 'Editor',
    'type' => 'editor',
]);
```

---

## Complete Permission List

### Manuscript (7)
- manuscript:create
- manuscript:view_own
- manuscript:view_all
- manuscript:edit_own
- manuscript:edit_all
- manuscript:download
- manuscript:delete

### Review (7)
- review:view_assigned
- review:access_pdf
- review:submit
- review:view_all
- review:manage_assignments
- review:send_invitations
- review:delete

### Decision (2)
- decision:make
- decision:override

### User (5)
- user:view
- user:create
- user:edit
- user:delete
- user:manage_roles

### Settings (2)
- settings:view
- settings:edit

### Reports (3)
- report:view
- report:generate
- report:export

**Total: 26 permissions**

---

## Role Feature Matrix

|Feature|Author|Reviewer|Editor|Admin|
|---|---|---|---|---|
|Submit manuscripts|✅|❌|❌|❌|
|View own submissions|✅|❌|❌|❌|
|View all manuscripts|❌|❌|✅|✅|
|Access PDF for review|❌|✅|✅|✅|
|Submit review|❌|✅|❌|❌|
|View all reviews|❌|❌|✅|✅|
|Make decisions|❌|❌|✅|✅|
|Manage reviewers|❌|❌|✅|✅|
|Manage users|❌|❌|❌|✅|
|View reports|❌|❌|✅|✅|
|Edit settings|❌|❌|❌|✅|

---

## Next Steps

1. Run seeder to populate roles/permissions
2. Assign roles to users
3. Add permission checks in controllers
4. Test authorization in feature tests
5. Create custom roles as needed

See `USER_ROLES_GUIDE.md` for complete documentation.
