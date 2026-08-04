<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageManagementTest extends TestCase
{
    use RefreshDatabase;

    private function makePublisher(): User
    {
        $role = Role::firstOrCreate(['name' => 'publisher'], ['display_name' => 'Publisher', 'type' => 'admin']);

        foreach (['homepage:view' => 'view', 'homepage:manage' => 'manage'] as $name => $action) {
            $permission = Permission::firstOrCreate(
                ['name' => $name],
                ['display_name' => $name, 'resource' => 'homepage', 'action' => $action, 'category' => 'content', 'is_active' => true],
            );
            $role->permissions()->syncWithoutDetaching([$permission->id => ['is_active' => true]]);
        }

        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    public function test_public_index_lists_only_published_menu_pages(): void
    {
        Page::create(['title' => 'About the Journal', 'slug' => 'about-the-journal', 'placement' => 'header', 'position' => 1, 'is_published' => true]);
        Page::create(['title' => 'Draft Page', 'slug' => 'draft-page', 'placement' => 'header', 'position' => 2, 'is_published' => false]);
        Page::create(['title' => 'Unlisted', 'slug' => 'unlisted', 'placement' => 'none', 'position' => 3, 'is_published' => true]);
        Page::create(['title' => 'Contact', 'slug' => 'contact-info', 'placement' => 'footer', 'position' => 1, 'is_published' => true]);

        $this->getJson('/api/pages')
            ->assertStatus(200)
            ->assertJsonCount(2, 'data');

        $this->getJson('/api/pages?placement=footer')
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'contact-info');
    }

    public function test_public_show_hides_drafts(): void
    {
        Page::create(['title' => 'Hidden', 'slug' => 'hidden', 'placement' => 'none', 'is_published' => false]);

        $this->getJson('/api/pages/hidden')->assertStatus(404);
    }

    public function test_publisher_can_create_update_and_delete_pages(): void
    {
        $user = $this->makePublisher();

        $created = $this->actingAs($user)->postJson('/api/admin/pages', [
            'title' => 'Reviewer Information',
            'content' => '<p>How reviewing works.</p>',
            'placement' => 'header',
            'is_published' => true,
        ]);

        $created->assertStatus(201)->assertJsonPath('data.slug', 'reviewer-information');
        $id = $created->json('data.id');

        $this->actingAs($user)->patchJson("/api/admin/pages/{$id}", [
            'placement' => 'footer',
            'title' => 'Reviewer Guide',
        ])->assertStatus(200)
            ->assertJsonPath('data.placement', 'footer')
            ->assertJsonPath('data.title', 'Reviewer Guide');

        $this->getJson('/api/pages/reviewer-information')
            ->assertStatus(200)
            ->assertJsonPath('data.title', 'Reviewer Guide');

        $this->actingAs($user)->deleteJson("/api/admin/pages/{$id}")->assertStatus(200);
        $this->getJson('/api/pages/reviewer-information')->assertStatus(404);
    }

    public function test_page_management_requires_permission(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/admin/pages', ['title' => 'Nope'])->assertStatus(403);
    }

    public function test_duplicate_slugs_rejected(): void
    {
        $user = $this->makePublisher();
        Page::create(['title' => 'One', 'slug' => 'same-slug', 'placement' => 'none']);

        $this->actingAs($user)->postJson('/api/admin/pages', ['title' => 'Same Slug'])
            ->assertStatus(422);
    }
}
