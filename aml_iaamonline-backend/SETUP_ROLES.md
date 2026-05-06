# Setup User Roles - Quick Start

## Step-by-Step Setup

### 1. Run Database Migrations
```bash
cd /Users/narayana/Herd/aml_iaamonline/aml_iaamonline-backend

# Run all migrations (including new role tables)
php artisan migrate

# Or specifically for PostgreSQL if configured
php artisan migrate --database=pgsql
```

### 2. Seed Default Roles & Permissions
```bash
php artisan db:seed --class=RolePermissionSeeder
```

This creates:
- ✅ 4 default roles (Author, Reviewer, Editor, Admin)
- ✅ 26 permissions across 6 categories
- ✅ Role-permission mappings

### 3. Verify Setup
```bash
php artisan tinker

# Check roles were created
>>> Role::all();

# Check permissions were created
>>> Permission::all();

# Check total counts
>>> Role::count();           // Should be 4
>>> Permission::count();     // Should be 26
```

---

## Using Roles

### Assign Role to User
```php
// In tinker or code
$user = User::find(1);
$user->assignRole('editor');

// Verify
$user->roles->pluck('name');  // ['editor']
```

### Check User Permissions
```php
$user = User::find(1);

// Check single permission
$user->can('manuscript:view_all');  // true if user is editor/admin

// Check multiple
$user->hasAnyRole(['editor', 'admin']);  // true

// Get all permissions
$user->activeRoles()
    ->with('permissions')
    ->get()
    ->pluck('permissions')
    ->flatten()
    ->pluck('name');
```

---

## Roles Overview

| Role | Type | Primary Use |
|------|------|-------------|
| Author | author | Submit manuscripts |
| Reviewer | reviewer | Review assigned manuscripts |
| Editor | editor | Manage review process |
| Admin | admin | System administration |

---

## Common Tasks

### Add User as Editor
```php
$user = User::find(1);
$user->assignRole('editor');
```

### Add User as Reviewer
```php
$user = User::find(2);
$user->assignRole('reviewer');
```

### Remove User Role
```php
$user->removeRole('editor');
```

### Check Authorization in Controller
```php
// In your API controller
public function showAllManuscripts(Request $request)
{
    if (!$request->user()->can('manuscript:view_all')) {
        abort(403, 'Unauthorized');
    }

    return Manuscript::all();
}
```

---

## Database Tables Created

```
roles                   - 4 default roles
permissions             - 26 default permissions
role_user               - Links users to roles
role_permission         - Links roles to permissions
```

---

## Documentation

Read full documentation in:
1. **USER_ROLES_GUIDE.md** - Complete reference
2. **ROLES_QUICK_REFERENCE.md** - Quick lookup
3. **IMPLEMENTATION_SUMMARY.md** - What was created

---

## Files Modified/Created

### New Files
- `app/Models/Role.php`
- `app/Models/Permission.php`
- `database/migrations/2026_04_25_134325_create_roles_table.php`
- `database/migrations/2026_04_25_134325_create_role_user_table.php`
- `database/migrations/2026_04_25_134326_create_permissions_table.php`
- `database/migrations/2026_04_25_134326_create_role_permission_table.php`
- `database/seeders/RolePermissionSeeder.php`

### Updated Files
- `app/Models/User.php` - Added role methods

### Documentation
- `USER_ROLES_GUIDE.md`
- `ROLES_QUICK_REFERENCE.md`
- `IMPLEMENTATION_SUMMARY.md`
- `SETUP_ROLES.md` (this file)

---

## Troubleshooting

### Roles not showing up?
```php
// Make sure seeder was run
php artisan db:seed --class=RolePermissionSeeder

// Check database
php artisan tinker
>>> Role::all();
```

### User still unauthorized?
```php
// Verify user has role
$user = User::find(1);
$user->roles->pluck('name');  // Should show assigned roles

// Verify role has permissions
$role = $user->roles->first();
$role->permissions->pluck('name');  // Should list permissions
```

### Want to create custom role?
```php
// Create role
$role = Role::create([
    'name' => 'chief-editor',
    'display_name' => 'Chief Editor',
    'type' => 'editor',
    'is_active' => true,
]);

// Add permissions
$permissions = Permission::whereIn('name', [
    'manuscript:view_all',
    'decision:override',
])->get();

$permissions->each(fn($p) => $role->givePermission($p));
```

---

## Ready to Use!

After running migrations and seeder, the system is ready to:
1. ✅ Assign roles to users
2. ✅ Check user permissions
3. ✅ Authorize API endpoints
4. ✅ Manage access control
5. ✅ Create custom roles

See **USER_ROLES_GUIDE.md** for advanced usage.
