<?php

use App\Models\Manuscript;
use App\Models\SustainableDevelopmentGoal;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use Illuminate\Foundation\Testing\RefreshDatabase;

beforeEach(function () {
    $this->artisan('migrate:fresh');
    Storage::fake('local');
    Storage::fake('public');
    
    // Seed some SDGs
    SustainableDevelopmentGoal::create(['sdg_number' => 1, 'name' => 'No Poverty', 'description' => 'Test SDG']);
    SustainableDevelopmentGoal::create(['sdg_number' => 2, 'name' => 'Zero Hunger', 'description' => 'Test SDG']);
});

function validSubmissionPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Test Manuscript Title',
        'authors' => 'John Doe, Jane Smith',
        'author_email' => 'author@example.com',
        'author_affiliation' => 'University of Testing',
        'abstract' => str_repeat('This is a sufficiently long abstract to pass validation. ', 10),
        'keywords' => 'test, manuscript',
        'category' => 'nanotechnology',
        'pdf' => UploadedFile::fake()->create('manuscript.pdf', 100, 'application/pdf'),
        'image' => UploadedFile::fake()->image('cover.png', 1600, 900)->size(1024),
        'graphical_abstract' => UploadedFile::fake()->image('graphical-abstract.png', 1200, 800)->size(1024),
        'cover_letter' => str_repeat('Please consider this manuscript for publication. ', 4),
    ], $overrides);
}

it('allows submitting a manuscript with up to 5 SDGs', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'sdgs' => json_encode([1, 2]),
    ]));

    $response->assertStatus(201);
    
    $manuscript = Manuscript::latest()->first();
    expect($manuscript->sdgs)->toHaveCount(2);
    expect($manuscript->sdgs->pluck('sdg_number'))->toContain(1, 2);
});

it('rejects submission if more than 5 SDGs are selected', function () {
    // Seed 6 SDGs
    foreach (range(1, 6) as $i) {
        SustainableDevelopmentGoal::create(['sdg_number' => $i + 10, 'name' => 'SDG ' . $i, 'description' => 'Test']);
    }

    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'title' => 'Test Manuscript Title 2',
        'authors' => 'John Doe',
        'author_email' => 'author2@example.com',
        'sdgs' => json_encode([11, 12, 13, 14, 15, 16]),
    ]));

    $response->assertStatus(422);
});

it('requires a cover image for manuscript submission', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'image' => null,
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

it('rejects cover images larger than 10 MB', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'image' => UploadedFile::fake()->image('large-cover.png', 1600, 900)->size(10241),
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});

it('requires cover images to use a 16:9 ratio', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'image' => UploadedFile::fake()->image('square-cover.png', 1000, 1000)->size(1024),
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['image']);
});


it('requires a graphical abstract for manuscript submission', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'graphical_abstract' => null,
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['graphical_abstract']);
});


it('rejects graphical abstracts larger than 5 MB', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'graphical_abstract' => UploadedFile::fake()->image('large-graphical-abstract.png', 1200, 800)->size(5121),
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['graphical_abstract']);
});


it('requires a cover letter for manuscript submission', function () {
    $response = $this->postJson(route('submit'), validSubmissionPayload([
        'cover_letter' => null,
    ]));

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['cover_letter']);
});


it('returns a JSON not found response when tracking fails', function () {
    $response = $this->postJson(route('track'), [
        'submission_id' => 'SUB-NOTFOUND',
        'email' => 'missing@example.com',
    ]);

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Submission not found. Please verify your Submission ID and email address.',
        ]);
});
