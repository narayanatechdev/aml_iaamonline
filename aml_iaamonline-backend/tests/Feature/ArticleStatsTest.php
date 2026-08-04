<?php

namespace Tests\Feature;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleStatsTest extends TestCase
{
    use RefreshDatabase;

    private function makeArticle(): Article
    {
        return Article::create([
            'legacy_id' => '25038',
            'title' => 'Test Article',
            'doi' => '10.5185/amlett.2026.011779',
            'volume' => '17',
            'issue' => '1',
        ]);
    }

    public function test_view_counter_increments_by_legacy_id(): void
    {
        $article = $this->makeArticle();

        $this->postJson('/api/articles/25038/view')
            ->assertStatus(200)
            ->assertJsonPath('data.views_count', 1);

        $this->postJson('/api/articles/25038/view');

        $this->assertSame(2, $article->fresh()->views_count);
    }

    public function test_download_counter_increments(): void
    {
        $article = $this->makeArticle();

        $this->postJson('/api/articles/25038/download')
            ->assertStatus(200)
            ->assertJsonPath('data.pdf_downloads', 1);

        $this->assertSame(1, $article->fresh()->pdf_downloads);
    }

    public function test_unknown_article_returns_404(): void
    {
        $this->postJson('/api/articles/99999/view')->assertStatus(404);
    }
}
