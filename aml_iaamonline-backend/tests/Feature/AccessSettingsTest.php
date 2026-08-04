<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\AccessSettingsController;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function makeUserWithPermissions(array $permissionNames): User
    {
        $role = Role::firstOrCreate(['name' => 'admin'], ['display_name' => 'Admin', 'type' => 'admin']);

        foreach ($permissionNames as $name) {
            [$resource, $action] = explode(':', $name);
            $permission = Permission::firstOrCreate(
                ['name' => $name],
                ['display_name' => $name, 'resource' => $resource, 'action' => $action, 'category' => $resource, 'is_active' => true],
            );
            $role->permissions()->syncWithoutDetaching([$permission->id => ['is_active' => true]]);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    public function test_public_access_model_returns_defaults(): void
    {
        $response = $this->getJson('/api/access-model');

        $response->assertStatus(200)
            ->assertJsonPath('data.enabled', true)
            ->assertJsonPath('data.tiers.0.key', 'regular')
            ->assertJsonPath('data.tiers.0.daily_limit', 5);
    }

    public function test_admin_update_requires_permission(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patchJson('/api/admin/settings/access', [
            'enabled' => true,
            'preview' => 'abstract',
            'tiers' => [
                ['key' => 'regular', 'label' => 'Regular Member', 'daily_limit' => 7, 'monthly_limit' => 120],
            ],
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_tier_limits(): void
    {
        $user = $this->makeUserWithPermissions(['settings:view', 'settings:edit']);

        $payload = [
            'enabled' => true,
            'preview' => 'abstract',
            'tiers' => [
                ['key' => 'regular', 'label' => 'Regular Member', 'daily_limit' => 7, 'monthly_limit' => 120],
                ['key' => 'fellow', 'label' => 'Fellow Member', 'daily_limit' => 12, 'monthly_limit' => 240],
            ],
        ];

        $this->actingAs($user)->patchJson('/api/admin/settings/access', $payload)
            ->assertStatus(200)
            ->assertJsonPath('data.tiers.0.daily_limit', 7);

        $this->assertSame(7, Setting::getValue(AccessSettingsController::SETTING_KEY)['tiers'][0]['daily_limit']);

        // The public endpoint now serves the saved values.
        $this->getJson('/api/access-model')
            ->assertStatus(200)
            ->assertJsonPath('data.tiers.1.daily_limit', 12);
    }

    public function test_duplicate_tier_keys_are_rejected(): void
    {
        $user = $this->makeUserWithPermissions(['settings:view', 'settings:edit']);

        $this->actingAs($user)->patchJson('/api/admin/settings/access', [
            'enabled' => true,
            'preview' => 'abstract',
            'tiers' => [
                ['key' => 'regular', 'label' => 'A', 'daily_limit' => 1, 'monthly_limit' => 10],
                ['key' => 'regular', 'label' => 'B', 'daily_limit' => 2, 'monthly_limit' => 20],
            ],
        ])->assertStatus(422);
    }
}
