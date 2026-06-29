<?php

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns all published archive articles with dashboard field aliases and sorting', function () {
    Article::create([
        'legacy_id' => 'legacy-article',
        'manuscript_id' => null,
        'title' => 'Legacy Archive Article',
        'document_type' => 'Review',
        'subject' => 'Materials Science',
        'doi' => '10.5185/test.legacy',
        'volume' => '17',
        'issue' => '1',
        'pages_from' => 1,
        'pages_to' => 12,
        'status' => 'published',
        'views_count' => 25,
        'pdf_downloads' => 8,
        'cited_count' => 3,
        'publish_year' => 2026,
        'publish_date' => '2026-01-01',
    ]);

    Article::create([
        'legacy_id' => 'submission-article',
        'manuscript_id' => 'SUB-000001',
        'title' => 'Submission Linked Article',
        'document_type' => 'Research Article',
        'subject' => 'Nanomaterials',
        'doi' => '10.5185/test.submission',
        'volume' => '17',
        'issue' => '2',
        'pages_from' => 13,
        'pages_to' => 24,
        'status' => 'published',
        'views_count' => 50,
        'pdf_downloads' => 18,
        'cited_count' => 6,
        'publish_year' => 2025,
        'publish_date' => '2025-02-01',
    ]);

    $response = $this->getJson('/api/articles?sort=total_views&dir=desc&per_page=10');

    $response
        ->assertOk()
        ->assertJsonPath('total', 2)
        ->assertJsonPath('data.0.title', 'Submission Linked Article')
        ->assertJsonPath('data.0.total_views', 50)
        ->assertJsonPath('data.0.total_downloads', 18)
        ->assertJsonPath('data.0.total_citations', 6)
        ->assertJsonPath('data.0.article_type', 'Research Article')
        ->assertJsonPath('data.0.year', 2025)
        ->assertJsonPath('data.0.page_start', 13)
        ->assertJsonPath('data.0.page_end', 24)
        ->assertJsonPath('data.1.title', 'Legacy Archive Article')
        ->assertJsonPath('data.1.manuscript_id', null);
});

it('sorts by dashboard year alias using article publish year', function () {
    Article::create([
        'legacy_id' => 'older-article',
        'title' => 'Older Article',
        'document_type' => 'Review',
        'doi' => '10.5185/test.older',
        'volume' => '15',
        'issue' => '1',
        'status' => 'published',
        'publish_year' => 2024,
        'publish_date' => '2024-01-01',
    ]);

    Article::create([
        'legacy_id' => 'newer-article',
        'title' => 'Newer Article',
        'document_type' => 'Letter',
        'doi' => '10.5185/test.newer',
        'volume' => '17',
        'issue' => '1',
        'status' => 'published',
        'publish_year' => 2026,
        'publish_date' => '2026-01-01',
    ]);

    $response = $this->getJson('/api/articles?sort=year&dir=desc&per_page=10');

    $response
        ->assertOk()
        ->assertJsonPath('total', 2)
        ->assertJsonPath('data.0.title', 'Newer Article')
        ->assertJsonPath('data.0.year', 2026)
        ->assertJsonPath('data.1.title', 'Older Article');
});
