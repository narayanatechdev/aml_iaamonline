<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = base_path('../aml_iaamonline-frontend/lib/articles_data.json');

        if (!file_exists($jsonPath)) {
            $this->command->error("articles_data.json not found at: {$jsonPath}");
            return;
        }

        $articles = json_decode(file_get_contents($jsonPath), true);
        $this->command->info("Found " . count($articles) . " articles to import");

        $bar = $this->command->getOutput()->createProgressBar(count($articles));
        $imported = 0;
        $skipped = 0;

        DB::beginTransaction();

        try {
            foreach ($articles as $data) {
                $doi = $data['doi'] ?? null;
                if (!$doi) {
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                if (Article::where('doi', $doi)->exists()) {
                    $skipped++;
                    $bar->advance();
                    continue;
                }

                $pages = $data['pages'] ?? '';
                $pagesFrom = null;
                $pagesTo = null;
                if (str_contains($pages, '-')) {
                    $parts = explode('-', $pages);
                    $pagesFrom = is_numeric(trim($parts[0])) ? (int) trim($parts[0]) : null;
                    $pagesTo = is_numeric(trim($parts[1] ?? '')) ? (int) trim($parts[1]) : null;
                } elseif (is_numeric($pages)) {
                    $pagesFrom = (int) $pages;
                }

                $published = $data['published'] ?? null;
                $publishDate = null;
                if ($published) {
                    try {
                        $publishDate = \Carbon\Carbon::parse($published)->format('Y-m-d');
                    } catch (\Exception $e) {
                        $publishDate = null;
                    }
                }

                $keywords = $data['keywords'] ?? [];
                $keywordsStr = is_array($keywords) ? implode(', ', $keywords) : $keywords;

                Article::create([
                    'legacy_id' => (string) $data['id'],
                    'manuscript_id' => $data['manuscript_id'] ?? null,
                    'title' => $data['title'] ?? 'Untitled',
                    'document_type' => $data['type'] ?? 'Research Article',
                    'subject' => $data['subject'] ?? 'Materials Science',
                    'abstract' => $data['abstract'] ?? null,
                    'keywords' => $keywordsStr ?: null,
                    'doi' => $doi,
                    'volume' => (string) ($data['volume'] ?? ''),
                    'issue' => (string) ($data['issue'] ?? ''),
                    'pages_from' => $pagesFrom,
                    'pages_to' => $pagesTo,
                    'language' => $data['language'] ?? 'EN',
                    'status' => 'published',
                    'pdf_url' => $data['pdf_url'] ?? null,
                    'original_pdf_url' => $data['original_pdf_url'] ?? null,
                    'graphical_abstract_url' => $data['graphical_abstract_url'] ?? null,
                    'file_name' => $data['file_name'] ?? null,
                    'views_count' => $data['views'] ?? 0,
                    'pdf_downloads' => $data['pdf_downloads'] ?? 0,
                    'cited_count' => $data['cited'] ?? 0,
                    'corresponding_author' => $data['corresponding_author'] ?? null,
                    'receive_date' => $data['receive_date'] ?? null,
                    'revise_date' => $data['revise_date'] ?? null,
                    'accept_date' => $data['accept_date'] ?? null,
                    'publish_date' => $publishDate,
                    'publish_year' => $data['year'] ?? null,
                    'publish_month' => null,
                ]);

                $imported++;
                $bar->advance();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Import failed: " . $e->getMessage());
            return;
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info("Imported: {$imported}, Skipped: {$skipped}");
    }
}
