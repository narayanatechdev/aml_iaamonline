<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Services\DoiMetadataService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncArticlesDoi extends Command
{
    protected $signature = 'doi:sync {--dry-run : Show what would be synced without making changes}';

    protected $description = 'Batch sync DOI metadata from CrossRef for all articles with DOIs';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('DRY RUN - No changes will be made.');
        }

        $articles = Article::whereNotNull('doi')
            ->where('doi', '!=', '')
            ->get(['id', 'legacy_id', 'title', 'doi', 'doi_synced_at', 'publish_year', 'volume', 'issue']);

        $total = $articles->count();
        $this->info("Found {$total} articles with DOIs.");

        if ($total === 0) {
            $this->warn('No articles with DOIs found. Exiting.');
            return self::SUCCESS;
        }

        $synced = 0;
        $alreadyCurrent = 0;
        $notFound = 0;
        $failed = 0;
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        foreach ($articles as $article) {
            $bar->advance();

            if ($dryRun) {
                $this->line("  [DRY] Would sync: {$article->doi}");
                continue;
            }

            try {
                $result = DoiMetadataService::fetch($article->doi);

                if (! $result['data']) {
                    $notFound++;
                    continue;
                }

                $metadata = $result['data'];
                $incomingTitle = $metadata['title'][0] ?? null;
                $incomingYear = $metadata['published']['date-parts'][0][0]
                    ?? $metadata['published-print']['date-parts'][0][0]
                    ?? $metadata['published-online']['date-parts'][0][0]
                    ?? null;
                $incomingVolume = $metadata['volume'] ?? null;
                $incomingIssue = $metadata['issue'] ?? null;

                $isAlreadyCurrent =
                    $article->title === $incomingTitle
                    && strval($article->publish_year) === strval($incomingYear)
                    && strval($article->volume) === strval($incomingVolume)
                    && strval($article->issue) === strval($incomingIssue);

                if ($isAlreadyCurrent && $article->doi_synced_at !== null) {
                    $alreadyCurrent++;
                    continue;
                }

                $article->update([
                    'title' => $incomingTitle ?? $article->title,
                    'doi' => $metadata['DOI'] ?? $article->doi,
                    'doi_link' => 'https://doi.org/'.($metadata['DOI'] ?? $article->doi),
                    'publish_year' => $incomingYear ?? $article->publish_year,
                    'volume' => $incomingVolume ?? $article->volume,
                    'issue' => $incomingIssue ?? $article->issue,
                    'doi_synced_at' => now(),
                ]);

                $synced++;
            } catch (\Throwable $e) {
                $failed++;
                $this->newLine();
                $this->error("  Failed for {$article->doi}: {$e->getMessage()}");
            }
        }

        $bar->finish();
        $this->newLine(2);

        if ($dryRun) {
            $this->info('Dry run complete.');
            return self::SUCCESS;
        }

        $this->info('=== DOI Sync Complete ===');
        $this->info("Total articles : {$total}");
        $this->info("Newly synced   : {$synced}");
        $this->info("Already current: {$alreadyCurrent}");
        $this->info("Not registered : {$notFound}");
        $this->info("Failed        : {$failed}");

        return self::SUCCESS;
    }
}