<?php

use App\Models\Manuscript;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $role = Role::firstOrCreate(['name' => 'admin'], ['display_name' => 'Admin', 'type' => 'admin']);
    $admin = User::factory()->create();
    $admin->assignRole($role);
    $this->actingAs($admin);
});

function manuscriptWith(array $attributes = []): Manuscript
{
    return Manuscript::create(array_merge([
        'submission_id' => 'SUB-'.fake()->unique()->bothify('????????????'),
        'title' => 'A paper',
        'authors' => 'Someone',
        'author_email' => 'someone@example.com',
        'author_affiliation' => 'Somewhere',
        'abstract' => 'Abstract',
        'keywords' => 'k',
        'category' => 'other',
        'status' => 'submitted',
        'submitted_at' => now(),
    ], $attributes));
}

test('the admin manuscripts list tells portal submissions apart from native ones', function () {
    $portal = manuscriptWith(['submitted_via' => 'portal', 'iaam_id' => 'IAAM2650000009']);
    $native = manuscriptWith(['submitted_via' => 'aml']);

    $response = $this->getJson('/api/admin/manuscripts')->assertOk();

    $data = collect($response->json('data'));

    expect($data->firstWhere('id', $portal->id))
        ->toMatchArray(['submitted_via' => 'portal', 'iaam_id' => 'IAAM2650000009'])
        ->and($data->firstWhere('id', $native->id))
        ->toMatchArray(['submitted_via' => 'aml', 'iaam_id' => null]);
});

test('the admin manuscript detail view includes the portal-submission fields', function () {
    $portal = manuscriptWith(['submitted_via' => 'portal', 'iaam_id' => 'IAAM2650000009']);

    $this->getJson("/api/admin/manuscripts/{$portal->id}")
        ->assertOk()
        ->assertJsonPath('data.submitted_via', 'portal')
        ->assertJsonPath('data.iaam_id', 'IAAM2650000009');
});
