<?php

namespace App\Console\Commands;

use App\Models\Author;
use Illuminate\Console\Command;

class EnrichAuthorsCommand extends Command
{
    protected $signature = 'authors:enrich {--file= : Path to authors_enrichment.json}';
    protected $description = 'Enrich author records with data from Excel (email, affiliation, ORCID, country, etc.)';

    public function handle(): int
    {
        $file = $this->option('file') ?: base_path('../authors_enrichment.json');
        if (!file_exists($file)) {
            $this->error("File not found: {$file}");
            return Command::FAILURE;
        }

        $records = json_decode(file_get_contents($file), true);
        $this->info("Loaded " . count($records) . " enrichment records");

        $grouped = [];
        foreach ($records as $record) {
            $key = strtolower(trim(($record['first_name'] ?? '') . ' ' . ($record['last_name'] ?? '')));
            if (!isset($grouped[$key]) || $this->richness($record) > $this->richness($grouped[$key])) {
                $grouped[$key] = $record;
            }
        }

        $this->info("Unique authors to enrich: " . count($grouped));

        $bar = $this->output->createProgressBar(count($grouped));
        $updated = 0;
        $notFound = 0;

        foreach ($grouped as $key => $data) {
            $author = Author::where('first_name', $data['first_name'])
                ->where('last_name', $data['last_name'])
                ->first();

            if (!$author) {
                $fullName = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
                $author = Author::where('name', $fullName)->first();
            }

            if (!$author) {
                $notFound++;
                $bar->advance();
                continue;
            }

            $updates = [];
            foreach (['email', 'orcid', 'affiliation', 'degree', 'position', 'phone', 'mobile', 'country', 'city'] as $field) {
                if (!empty($data[$field]) && empty($author->$field)) {
                    $updates[$field] = $data[$field];
                }
            }

            if (!$author->first_name && $data['first_name']) {
                $updates['first_name'] = $data['first_name'];
            }
            if (!$author->last_name && $data['last_name']) {
                $updates['last_name'] = $data['last_name'];
            }

            if ($updates) {
                $author->update($updates);
                $updated++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Updated: {$updated}, Not found in DB: {$notFound}");

        $this->showStats();

        return Command::SUCCESS;
    }

    private function richness(array $record): int
    {
        $score = 0;
        foreach (['email', 'orcid', 'affiliation', 'degree', 'position', 'country', 'city'] as $field) {
            if (!empty($record[$field])) $score++;
        }
        return $score;
    }

    private function showStats(): void
    {
        $total = Author::count();
        $this->info("--- Author Data Coverage ---");
        foreach (['email', 'orcid', 'affiliation', 'degree', 'position', 'country', 'city'] as $field) {
            $count = Author::whereNotNull($field)->where($field, '!=', '')->count();
            $pct = $total > 0 ? round($count / $total * 100, 1) : 0;
            $this->info("  {$field}: {$count}/{$total} ({$pct}%)");
        }
    }
}
