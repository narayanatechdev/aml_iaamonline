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

it('allows submitting a manuscript with up to 5 SDGs', function () {
    $pdf = UploadedFile::fake()->create('manuscript.pdf', 100, 'application/pdf');

    $response = $this->postJson(route('submit'), [
        'title' => 'Test Manuscript Title',
        'authors' => 'John Doe, Jane Smith',
        'author_email' => 'author@example.com',
        'author_affiliation' => 'University of Testing',
        'abstract' => str_repeat('This is a sufficiently long abstract to pass validation. ', 10),
        'keywords' => 'test, manuscript',
        'category' => 'nanotechnology',
        'pdf' => $pdf,
        'sdgs' => json_encode([1, 2]),
    ]);

    $response->assertStatus(201);
    
    $manuscript = Manuscript::latest()->first();
    expect($manuscript->sdgs)->toHaveCount(2);
    expect($manuscript->sdgs->pluck('sdg_number'))->toContain(1, 2);
});

it('rejects submission if more than 5 SDGs are selected', function () {
    $pdf = UploadedFile::fake()->create('manuscript.pdf', 100, 'application/pdf');

    // Seed 6 SDGs
    foreach (range(1, 6) as $i) {
        SustainableDevelopmentGoal::create(['sdg_number' => $i + 10, 'name' => 'SDG ' . $i, 'description' => 'Test']);
    }

    $response = $this->postJson(route('submit'), [
        'title' => 'Test Manuscript Title 2',
        'authors' => 'John Doe',
        'author_email' => 'author2@example.com',
        'author_affiliation' => 'University of Testing',
        'abstract' => str_repeat('This is a sufficiently long abstract to pass validation. ', 10),
        'keywords' => 'test, manuscript',
        'category' => 'nanotechnology',
        'pdf' => $pdf,
        'sdgs' => json_encode([11, 12, 13, 14, 15, 16]),
    ]);

    $response->assertStatus(422);
});
