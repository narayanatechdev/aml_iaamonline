<?php

namespace Tests\Feature;

use App\Http\Controllers\Api\AccessSettingsController;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleAccessTest extends TestCase
{
    use RefreshDatabase;

    private function limitedModel(int $daily, int $monthly): void
    {
        $model = AccessSettingsController::defaults();
        $model['tiers'] = [
            ['key' => 'regular', 'label' => 'Regular Member', 'daily_limit' => $daily, 'monthly_limit' => $monthly],
        ];
        Setting::setValue(AccessSettingsController::SETTING_KEY, $model);
    }

    public function test_guest_cannot_call_access_endpoint(): void
    {
        $this->getJson('/api/articles/101/access')->assertStatus(401);
    }

    public function test_member_consumes_daily_allowance_per_distinct_article(): void
    {
        $this->limitedModel(2, 100);
        $user = User::factory()->create(['membership_tier' => 'regular']);

        // Two distinct articles allowed…
        $this->actingAs($user)->getJson('/api/articles/101/access')
            ->assertStatus(200)
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.remaining_today', 1);

        $this->actingAs($user)->getJson('/api/articles/102/access')
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.remaining_today', 0);

        // …a third is blocked…
        $this->actingAs($user)->getJson('/api/articles/103/access')
            ->assertJsonPath('data.allowed', false);

        // …but re-reading one already opened today stays allowed.
        $this->actingAs($user)->getJson('/api/articles/101/access')
            ->assertJsonPath('data.allowed', true);
    }

    public function test_monthly_limit_blocks_even_within_daily_limit(): void
    {
        $this->limitedModel(5, 1);
        $user = User::factory()->create(['membership_tier' => 'regular']);

        $this->actingAs($user)->getJson('/api/articles/101/access')
            ->assertJsonPath('data.allowed', true);

        $this->actingAs($user)->getJson('/api/articles/102/access')
            ->assertJsonPath('data.allowed', false);
    }

    public function test_admin_has_unlimited_access(): void
    {
        $this->limitedModel(1, 1);
        $role = Role::firstOrCreate(['name' => 'admin'], ['display_name' => 'Admin', 'type' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole($role);

        $this->actingAs($admin)->getJson('/api/articles/101/access')
            ->assertStatus(200)
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.unlimited', true);
    }

    public function test_disabled_model_allows_everything(): void
    {
        $model = AccessSettingsController::defaults();
        $model['enabled'] = false;
        Setting::setValue(AccessSettingsController::SETTING_KEY, $model);

        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/articles/101/access')
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.unlimited', true);
    }
}
