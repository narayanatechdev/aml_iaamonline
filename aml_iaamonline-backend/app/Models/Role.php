<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'type',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'role_user')
            ->withPivot('assigned_at', 'assigned_by', 'revoked_at', 'revoked_by', 'is_active')
            ->withTimestamps();
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function activePermissions()
    {
        return $this->permissions()
            ->where('role_permission.is_active', true)
            ->where('permissions.is_active', true);
    }

    public function givePermission(Permission $permission)
    {
        if (! $this->hasPermission($permission)) {
            $this->permissions()->attach($permission->id);
        }
    }

    public function revokePermission(Permission $permission)
    {
        $this->permissions()->detach($permission->id);
    }

    public function hasPermission(Permission $permission): bool
    {
        return $this->activePermissions()->where('permission_id', $permission->id)->exists();
    }
}
