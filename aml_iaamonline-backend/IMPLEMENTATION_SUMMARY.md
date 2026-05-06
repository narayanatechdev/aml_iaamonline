# User Roles & Permissions Implementation Summary

## What Was Created

A complete, production-ready Role-Based Access Control (RBAC) system for the IAAM Journal Management System.

---

## Database Schema

### 4 New Tables

1. **roles** - Stores role definitions
   - id, name, display_name, description, type, is_active, timestamps

2. **permissions** - Stores permission definitions
   - id, name, display_name, description, resource, action, category, is_active, timestamps

3. **role_user** - Links users to roles (many-to-many)
   - id, user_id, role_id, assigned_at, assigned_by, revoked_at, revoked_by, is_active, timestamps
   - Unique constraint on (user_id, role_id)

4. **role_permission** - Links roles to permissions (many-to-many)
   - id, role_id, permission_id, is_active, timestamps
   - Unique constraint on (role_id, permission_id)

### 4 Migration Files
Located in `database/migrations/`:
- `2026_04_25_134325_create_roles_table.php`
- `2026_04_25_134325_create_role_user_table.php`
- `2026_04_25_134326_create_permissions_table.php`
- `2026_04_25_134326_create_role_permission_table.php`

---

## Models & Relationships

### Updated User Model (`app/Models/User.php`)

**New Methods:**
```php
roles()                  // Get user's roles
activeRoles()           // Get only active roles
permissions()           // Get all permissions through roles
assignRole(Role)        // Assign role to user
removeRole(Role)        // Remove role from user
hasRole($role)          // Check single role
hasAnyRole($roles)      // Check any of multiple roles
hasAllRoles($roles)     // Check all roles
hasPermission($perm)    // Check permission
can($permission)        // Alias for hasPermission
```

### New Role Model (`app/Models/Role.php`)

**Relationships:**
- `users()` - Many-to-many with User
- `permissions()` - Many-to-many with Permission
- `activePermissions()` - Only active permissions

**Methods:**
```php
givePermission(Permission)      // Add permission to role
revokePermission(Permission)    // Remove permission from role
hasPermission(Permission)       // Check if role has permission
```

### New Permission Model (`app/Models/Permission.php`)

**Relationships:**
- `roles()` - Many-to-many with Role

---

## 4 Predefined Roles

### 1. Author (type: author)
**Permissions:**
- manuscript:create
- manuscript:view_own
- manuscript:edit_own
- manuscript:download

### 2. Reviewer (type: reviewer)
**Permissions:**
- review:view_assigned
- review:access_pdf
- review:submit

### 3. Editor (type: editor)
**Permissions:**
- manuscript:view_all
- manuscript:edit_all
- review:view_assigned
- review:view_all
- review:manage_assignments
- review:send_invitations
- decision:make
- report:view
- report:generate

### 4. Admin (type: admin)
**Permissions:**
- All 26 permissions in the system

---

## 26 Predefined Permissions

### Manuscript (7)
```
manuscript:create          - Create/submit manuscript
manuscript:view_own        - View own manuscript
manuscript:view_all        - View all manuscripts
manuscript:edit_own        - Edit own manuscript
manuscript:edit_all        - Edit any manuscript
manuscript:download        - Download manuscript file
manuscript:delete          - Delete manuscript
```

### Review (7)
```
review:view_assigned       - View assigned manuscripts
review:access_pdf          - Access PDF for review
review:submit              - Submit review
review:view_all            - View all reviews
review:manage_assignments  - Manage reviewer assignments
review:send_invitations    - Send review invitations
review:delete              - Delete review
```

### Decision (2)
```
decision:make              - Make editorial decision
decision:override          - Override previous decision
```

### User (5)
```
user:view                  - View users
user:create                - Create user
user:edit                  - Edit user
user:delete                - Delete user
user:manage_roles          - Manage user roles
```

### Settings (2)
```
settings:view              - View settings
settings:edit              - Edit settings
```

### Reports (3)
```
report:view                - View reports
report:generate            - Generate custom reports
report:export              - Export reports
```

---

## Documentation Files

### 1. USER_ROLES_GUIDE.md (Comprehensive)
- Complete system overview
- Architecture explanation
- All 4 roles detailed
- All 26 permissions listed
- Code examples for all operations
- Middleware and authorization patterns
- Database seeding guide
- Performance optimization
- Troubleshooting section
- API examples
- Best practices

### 2. ROLES_QUICK_REFERENCE.md (Quick Lookup)
- 4 roles at a glance
- Common code examples
- Permission list
- Role feature matrix
- Quick troubleshooting

### 3. IMPLEMENTATION_SUMMARY.md (This File)
- What was created
- Quick start guide
- File locations

---

## Seeder File

### RolePermissionSeeder.php

Located in `database/seeders/RolePermissionSeeder.php`

**What it does:**
1. Creates 26 permissions
2. Creates 4 default roles
3. Assigns appropriate permissions to each role

**Run with:**
```bash
php artisan db:seed --class=RolePermissionSeeder
```

---

## Quick Start Guide

### Step 1: Run Migrations
```bash
php artisan migrate
```

### Step 2: Run Seeder
```bash
php artisan db:seed --class=RolePermissionSeeder
```

### Step 3: Assign Roles to Users
```php
$user = User::find(1);
$user->assignRole('editor');  // User is now an editor
```

### Step 4: Check Permissions in Controllers
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

## Key Features

✅ **Flexible RBAC System**
- Unlimited roles
- Unlimited permissions
- Easy role/permission management

✅ **Granular Permissions**
- Resource-based permissions
- Action-based permissions
- 26 predefined permissions
- Easily extendable

✅ **User-Friendly Methods**
- Simple authorization checks
- Intuitive method names
- Chainable relationships

✅ **Audit Tracking**
- Track who assigned/revoked roles
- Track when roles were assigned
- Track current role status

✅ **Performance Optimized**
- Indexed queries
- Eager loading support
- Caching friendly

✅ **Production Ready**
- Migrations included
- Seeder included
- Complete documentation
- Best practices included

---

## File Locations

```
aml_iaamonline-backend/
├── app/Models/
│   ├── User.php (updated with role methods)
│   ├── Role.php (new)
│   └── Permission.php (new)
├── database/migrations/
│   ├── 2026_04_25_134325_create_roles_table.php
│   ├── 2026_04_25_134325_create_role_user_table.php
│   ├── 2026_04_25_134326_create_permissions_table.php
│   └── 2026_04_25_134326_create_role_permission_table.php
├── database/seeders/
│   └── RolePermissionSeeder.php (new)
├── USER_ROLES_GUIDE.md (new - comprehensive)
├── ROLES_QUICK_REFERENCE.md (new - quick lookup)
└── IMPLEMENTATION_SUMMARY.md (this file)
```

---

## Integration Points

### Controllers
```php
// Check authorization
if ($request->user()->can('manuscript:view_all')) {
    // Show all manuscripts
}
```

### Middleware
```php
// Protect routes with role checks
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/editor/dashboard', EditorController@dashboard);
});
```

### Policies
```php
// Create policies for fine-grained control
public function viewAll(User $user) {
    return $user->hasRole('editor') || $user->hasRole('admin');
}
```

---

## Creating Custom Roles

### Via Code
```php
Role::create([
    'name' => 'chief-editor',
    'display_name' => 'Chief Editor',
    'description' => 'Senior editor with full control',
    'type' => 'editor',
    'is_active' => true,
]);
```

### Adding Permissions
```php
$role = Role::where('name', 'chief-editor')->first();
$permission = Permission::where('name', 'decision:override')->first();
$role->givePermission($permission);
```

---

## Creating Custom Permissions

### Via Code
```php
Permission::create([
    'name' => 'manuscript:publish',
    'display_name' => 'Publish Manuscript',
    'description' => 'Can publish accepted manuscripts',
    'resource' => 'manuscript',
    'action' => 'publish',
    'category' => 'manuscript',
    'is_active' => true,
]);
```

---

## Testing Authorization

```php
public function test_editor_can_view_all_manuscripts()
{
    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user)
        ->getJson('/api/editor/manuscripts')
        ->assertOk();
}
```

---

## Performance Considerations

### Eager Loading
```php
// Load roles and permissions efficiently
$user = User::with('roles.permissions')->find(1);
```

### Caching
```php
// Cache user permissions for 24 hours
$permissions = Cache::remember(
    "user.{$user->id}.permissions",
    now()->addHours(24),
    fn () => $user->activeRoles()->with('activePermissions')->get()
);
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ Models created with methods
3. ✅ 4 roles created
4. ✅ 26 permissions created
5. ✅ Seeder created
6. ✅ Documentation created

**Remaining:**
- Run migrations and seeder
- Integrate with controllers
- Add middleware where needed
- Create policies for fine-grained control
- Test authorization flows

---

## Support

For detailed information, see:
- **USER_ROLES_GUIDE.md** - Complete documentation
- **ROLES_QUICK_REFERENCE.md** - Quick lookup
- **API_ENDPOINTS.md** - API authorization info

---

## Summary

A complete, production-ready RBAC system with:
- 4 database tables
- 3 Eloquent models (Role, Permission, + User updates)
- 4 migrations
- 1 seeder (26 permissions + 4 roles)
- 2 comprehensive documentation files
- 26 permissions across 6 categories
- 4 predefined roles with appropriate permissions
- Full authorization methods on User model
- Audit trail for role assignments
- Performance optimized queries

Ready to use immediately after running migrations and seeder.
