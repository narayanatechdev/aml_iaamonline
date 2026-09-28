<?php

use App\Models\Article;
use App\Models\ArticleAuthor;
use App\Models\Author;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
 * The landing page always asks for authors by the id in its URL, which is the
 * legacy_id. AML's article_authors rows point at that legacy_id; AMP's point at
 * the primary key instead. The endpoint has to satisfy both, or one journal
 * silently shows no authors at all.
 */

function articleWithAuthor(string $legacyId, string $pivotKey): Article
{
    $article = Article::create([
        'legacy_id' => $legacyId,
        'title' => 'Application of active electric field in defect detection',
        'doi' => '10.5185/amp.2024.7149.1012',
        'status' => 'published',
        'volume' => '9',
        'issue' => '1',
        'publish_year' => 2024,
    ]);

    $author = Author::create([
        'name' => 'Jiegang Peng',
        'first_name' => 'Jiegang',
        'last_name' => 'Peng',
    ]);

    ArticleAuthor::create([
        'article_id' => $pivotKey === 'legacy' ? $article->legacy_id : $article->id,
        'author_id' => $author->id,
        'position' => 1,
        'is_corresponding' => true,
    ]);

    return $article;
}

it('finds authors when the pivot points at the legacy id, as AML stores them', function () {
    $article = articleWithAuthor('24308', 'legacy');

    $this->getJson("/api/articles/{$article->legacy_id}/authors")
        ->assertOk()
        ->assertJsonPath('total_authors', 1)
        ->assertJsonPath('authors.0.name', 'Jiegang Peng');
});

it('finds authors when the pivot points at the primary key, as AMP stores them', function () {
    // The regression: every AMP landing page showed no authors at all.
    $article = articleWithAuthor('24308', 'primary');

    $this->getJson("/api/articles/{$article->legacy_id}/authors")
        ->assertOk()
        ->assertJsonPath('total_authors', 1)
        ->assertJsonPath('authors.0.name', 'Jiegang Peng');
});

it('still answers when asked by the primary key', function () {
    $article = articleWithAuthor('24308', 'primary');

    $this->getJson("/api/articles/{$article->id}/authors")
        ->assertOk()
        ->assertJsonPath('total_authors', 1);
});

it('reports a missing article rather than an empty author list', function () {
    // It used to answer 200 with no authors for any id at all, including "abc",
    // which is why the AMP fault went unnoticed for so long.
    $this->getJson('/api/articles/abc/authors')
        ->assertNotFound()
        ->assertJsonPath('total_authors', 0);
});
