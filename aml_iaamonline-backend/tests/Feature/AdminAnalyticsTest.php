<?php

namespace Tests\Feature;

use App\Models\Affiliation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $role = \App\Models\Role::firstOrCreate(['name' => 'admin'], ['display_name' => 'Admin', 'type' => 'admin']);
        $admin = User::factory()->create();
        $admin->assignRole($role);
        $this->actingAs($admin);
    }

    public function test_can_get_country_stats(): void
    {
        Affiliation::create(['name' => 'Univ A', 'country' => 'USA', 'author_count' => 10]);
        Affiliation::create(['name' => 'Univ B', 'country' => 'USA', 'author_count' => 5]);
        Affiliation::create(['name' => 'Univ C', 'country' => 'Canada', 'author_count' => 8]);

        $response = $this->getJson('/api/admin/analytics/countries');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.country', 'USA')
            ->assertJsonPath('data.0.author_count', 15)
            ->assertJsonPath('data.1.country', 'Canada')
            ->assertJsonPath('data.1.author_count', 8);
    }
}
