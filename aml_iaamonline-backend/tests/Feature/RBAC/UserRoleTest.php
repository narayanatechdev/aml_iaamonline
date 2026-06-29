<?php

namespace Tests\Feature\RBAC;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_be_assigned_multiple_roles()
    {
        $user = User::factory()->create();
        $role1 = Role::create(['name' => 'editor', 'display_name' => 'Editor', 'type' => 'editor', 'is_active' => true]);
        $role2 = Role::create(['name' => 'admin', 'display_name' => 'Admin', 'type' => 'admin', 'is_active' => true]);

        $user->assignRole($role1);
        $user->assignRole($role2);

        $this->assertTrue($user->hasRole($role1));
        $this->assertTrue($user->hasRole($role2));
        $this->assertEquals(2, $user->activeRoles()->count());
    }

    public function test_a_user_can_remove_a_role()
    {
        $user = User::factory()->create();
        $role1 = Role::create(['name' => 'editor', 'display_name' => 'Editor', 'type' => 'editor', 'is_active' => true]);
        $role2 = Role::create(['name' => 'admin', 'display_name' => 'Admin', 'type' => 'admin', 'is_active' => true]);

        $user->assignRole($role1);
        $user->assignRole($role2);

        $user->removeRole($role1);

        $this->assertFalse($user->hasRole($role1));
        $this->assertTrue($user->hasRole($role2));
    }
}
