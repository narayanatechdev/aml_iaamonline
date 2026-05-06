<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function getRoleNames(): array
    {
        return $this->activeRoles()->pluck('name')->toArray();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user')
            ->withPivot('assigned_at', 'assigned_by', 'revoked_at', 'revoked_by', 'is_active')
            ->withTimestamps();
    }

    public function activeRoles()
    {
        return $this->roles()
            ->where('role_user.is_active', true)
            ->where('roles.is_active', true);
    }

    public function permissions()
    {
        return $this->hasManyThrough(
            Permission::class,
            Role::class,
            'id',
            'id',
            'id',
            'id'
        )->through('roles')->where('role_permission.is_active', true);
    }

    public function assignRole(Role $role): void
    {
        if (! $this->hasRole($role)) {
            $this->roles()->attach($role->id, [
                'assigned_at' => now(),
            ]);
        }
    }

    public function removeRole(Role $role): void
    {
        $this->roles()->detach($role->id);
    }

    public function hasRole($role): bool
    {
        if (is_string($role)) {
            return $this->activeRoles()->where('name', $role)->exists();
        }

        return $this->activeRoles()->where('role_id', $role->id)->exists();
    }

    public function hasAnyRole($roles): bool
    {
        return $this->activeRoles()
            ->whereIn('name', (array) $roles)
            ->exists();
    }

    public function hasAllRoles($roles): bool
    {
        $roles = collect($roles)->map(function ($role) {
            return is_string($role) ? $role : $role->name;
        });

        return $this->activeRoles()
            ->whereIn('name', $roles)
            ->count() === count($roles);
    }

    public function hasPermission($permission): bool
    {
        if (is_string($permission)) {
            return $this->activeRoles()
                ->whereHas('permissions', fn ($q) => $q->where('name', $permission)->where('role_permission.is_active', true))
                ->exists();
        }

        return $this->activeRoles()
            ->whereHas('permissions', fn ($q) => $q->where('permission_id', $permission->id)->where('role_permission.is_active', true))
            ->exists();
    }
}
