<?php

use App\Models\Article;
use App\Models\ArticleAuthor;
use App\Models\Author;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function authorsFile(array $payload): string
{
    $path = tempnam(sys_get_temp_dir(), 'authors').'.json';
    file_put_contents($path, json_encode($payload));

    return $path;
}

function amPaper(string $legacyId = '24308'): Article
{
    return Article::create([
        'legacy_id' => $legacyId,
        'title' => 'Application of active electric field in defect detection',
        'doi' => '10.5185/amp.2024.7149.1012',
        'status' => 'published',
        'volume' => '9',
        'issue' => '1',
        'publish_year' => 2024,
    ]);
}

function fourAuthors(string $legacyId = '24308'): array
{
    return [[
        'article' => $legacyId,
        'authors' => [
            ['name' => 'Wenjie Yang', 'first_name' => 'Wenjie', 'last_name' => 'Yang', 'affiliation' => 'UESTC, Chengdu'],
            ['name' => 'Jiegang Peng', 'first_name' => 'Jiegang', 'last_name' => 'Peng', 'email' => 'pjg2000cn@hotmail.com', 'corresponding' => true, 'affiliation' => 'UESTC, Chengdu'],
            ['name' => 'Lin Xu', 'first_name' => 'Lin', 'last_name' => 'Xu', 'affiliation' => 'Wuhan Second Ship Design'],
            ['name' => 'Jiaqi Wang', 'first_name' => 'Jiaqi', 'last_name' => 'Wang', 'affiliation' => 'UESTC, Chengdu'],
        ],
    ]];
}

it('restores the missing co-authors alongside the one already on record', function () {
    $article = amPaper();
    $peng = Author::create(['name' => 'Jiegang Peng', 'first_name' => 'Jiegang', 'last_name' => 'Peng', 'email' => 'pjg2000cn@hotmail.com']);
    ArticleAuthor::create([
        'article_id' => $article->id,
        'author_id' => $peng->id,
        'position' => 1,
        'is_corresponding' => true,
        'affiliation_text' => 'Active Electric',
    ]);

    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors())])
        ->assertSuccessful();

    $rows = ArticleAuthor::where('article_id', $article->id)->with('author')->orderBy('position')->get();

    expect($rows)->toHaveCount(4)
        ->and($rows->pluck('author.name')->all())
        ->toBe(['Wenjie Yang', 'Jiegang Peng', 'Lin Xu', 'Jiaqi Wang']);
});

it('reuses the author already on record rather than duplicating them', function () {
    $article = amPaper();
    $peng = Author::create(['name' => 'Jiegang Peng', 'email' => 'pjg2000cn@hotmail.com']);
    ArticleAuthor::create(['article_id' => $article->id, 'author_id' => $peng->id, 'position' => 1, 'is_corresponding' => true]);

    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors())]);

    expect(Author::where('email', 'pjg2000cn@hotmail.com')->count())->toBe(1)
        ->and(ArticleAuthor::where('article_id', $article->id)->where('author_id', $peng->id)->count())->toBe(1);
});

it('replaces the affiliation fragment left by the bad import', function () {
    $article = amPaper();
    $peng = Author::create(['name' => 'Jiegang Peng', 'email' => 'pjg2000cn@hotmail.com']);
    ArticleAuthor::create([
        'article_id' => $article->id,
        'author_id' => $peng->id,
        'position' => 1,
        'affiliation_text' => 'Active Electric',
    ]);

    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors())]);

    expect(ArticleAuthor::where('article_id', $article->id)->where('author_id', $peng->id)->first()->affiliation_text)
        ->toBe('UESTC, Chengdu');
});

it('files authors under the legacy id when that is what the database uses', function () {
    // AML's convention: existing rows point at the legacy_id, so new ones must too.
    $article = amPaper();
    $existing = Author::create(['name' => 'Someone Else']);
    ArticleAuthor::create(['article_id' => $article->legacy_id, 'author_id' => $existing->id, 'position' => 1]);

    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors())]);

    expect(ArticleAuthor::where('article_id', $article->legacy_id)->count())->toBe(5)
        ->and(ArticleAuthor::where('article_id', $article->id)->count())->toBe(0);
});

it('keeps the surname the file states rather than splitting on the last word', function () {
    $article = amPaper();
    ArticleAuthor::create([
        'article_id' => $article->id,
        'author_id' => Author::create(['name' => 'Placeholder'])->id,
        'position' => 1,
    ]);

    $this->artisan('articles:import-authors', ['file' => authorsFile([[
        'article' => '24308',
        'authors' => [
            ['name' => 'Suresh Babu A', 'first_name' => 'Suresh Babu', 'last_name' => 'A'],
            ['name' => 'Tamara van Roo', 'first_name' => 'Tamara', 'last_name' => 'van Roo'],
        ],
    ]])]);

    expect(Author::where('name', 'Suresh Babu A')->first()->last_name)->toBe('A')
        ->and(Author::where('name', 'Tamara van Roo')->first()->last_name)->toBe('van Roo');
});

it('changes nothing on a second run', function () {
    $article = amPaper();
    ArticleAuthor::create([
        'article_id' => $article->id,
        'author_id' => Author::create(['name' => 'Jiegang Peng', 'email' => 'pjg2000cn@hotmail.com'])->id,
        'position' => 1,
    ]);
    $file = authorsFile(fourAuthors());

    $this->artisan('articles:import-authors', ['file' => $file]);
    $after = ArticleAuthor::where('article_id', $article->id)->orderBy('position')->get()->toArray();

    $this->artisan('articles:import-authors', ['file' => $file]);

    expect(ArticleAuthor::where('article_id', $article->id)->count())->toBe(4)
        ->and(Author::count())->toBe(4)
        ->and(ArticleAuthor::where('article_id', $article->id)->orderBy('position')->get()->toArray())
        ->toEqual($after);
});

it('writes nothing on a dry run', function () {
    $article = amPaper();
    ArticleAuthor::create([
        'article_id' => $article->id,
        'author_id' => Author::create(['name' => 'Jiegang Peng'])->id,
        'position' => 1,
    ]);

    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors()), '--dry-run' => true])
        ->assertSuccessful();

    expect(ArticleAuthor::where('article_id', $article->id)->count())->toBe(1);
});

it('skips an article it cannot find instead of inventing one', function () {
    $this->artisan('articles:import-authors', ['file' => authorsFile(fourAuthors('99999'))])
        ->assertSuccessful();

    expect(ArticleAuthor::count())->toBe(0)
        ->and(Author::count())->toBe(0);
});
