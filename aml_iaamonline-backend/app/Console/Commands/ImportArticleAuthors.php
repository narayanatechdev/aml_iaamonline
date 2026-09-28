<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\ArticleAuthor;
use App\Models\Author;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/*
 * Restores an article's author list from a JSON file, for records whose authors
 * were lost or truncated on import. The published PDF is the source: it names
 * every author, their order, who corresponds, and each affiliation.
 *
 * Existing rows are matched and updated rather than replaced, so a second run
 * over the same file changes nothing.
 */
class ImportArticleAuthors extends Command
{
    protected $signature = 'articles:import-authors
        {file : JSON file of articles and their authors}
        {--dry-run : Report what would change and write nothing}';

    protected $description = 'Restore article authors from a JSON file taken from the published PDFs';

    public function handle(): int
    {
        $path = $this->argument('file');

        if (! is_file($path)) {
            $this->error("No such file: {$path}");

            return self::FAILURE;
        }

        $payload = json_decode((string) file_get_contents($path), true);

        if (! is_array($payload)) {
            $this->error('That file is not valid JSON.');

            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');
        $changed = 0;

        foreach ($payload as $entry) {
            $reference = (string) ($entry['article'] ?? '');
            $article = Article::where('legacy_id', $reference)->orWhere('id', $reference)->first();

            if (! $article) {
                $this->warn("Skipped {$reference}: no such article.");

                continue;
            }

            $this->line("<info>{$reference}</info> {$article->title}");

            try {
                $key = $this->pivotKeyFor($article);
            } catch (RuntimeException $e) {
                $this->warn('  Skipped: '.$e->getMessage());

                continue;
            }

            $applied = $dryRun
                ? $this->describe($article, $key, $entry['authors'] ?? [])
                : DB::transaction(fn () => $this->apply($article, $key, $entry['authors'] ?? []));

            $changed += $applied;
        }

        $this->newLine();
        $this->line($dryRun
            ? "Dry run: {$changed} author rows would change."
            : "Done: {$changed} author rows written.");

        return self::SUCCESS;
    }

    /**
     * Which key this database files article_authors under.
     *
     * AML stores the legacy_id in article_authors.article_id, AMP the primary
     * key. Writing the wrong one would file the authors where nothing reads
     * them, so follow the rows this article already has, and failing that the
     * convention the rest of the table uses.
     */
    private function pivotKeyFor(Article $article): string
    {
        $candidates = array_values(array_filter(
            [(string) $article->id, (string) $article->legacy_id],
            fn ($key) => $key !== ''
        ));

        foreach ($candidates as $candidate) {
            if (ArticleAuthor::where('article_id', $candidate)->exists()) {
                return $candidate;
            }
        }

        $legacyIds = Article::query()->whereNotNull('legacy_id')->pluck('legacy_id');
        $filedUnderLegacy = ArticleAuthor::whereIn('article_id', $legacyIds)->exists();

        if ($filedUnderLegacy && filled($article->legacy_id)) {
            return (string) $article->legacy_id;
        }

        if (ArticleAuthor::query()->exists()) {
            return (string) $article->id;
        }

        throw new RuntimeException('cannot tell which key this database files authors under.');
    }

    /** @param  array<int, array<string, mixed>>  $authors */
    private function describe(Article $article, string $key, array $authors): int
    {
        $existing = ArticleAuthor::where('article_id', $key)->with('author')->orderBy('position')->get();

        $this->line('  now:  '.($existing->isEmpty()
            ? '(none)'
            : $existing->map(fn ($row) => $row->author?->full_name ?? '?')->implode(', ')));
        $this->line('  from PDF: '.collect($authors)->pluck('name')->implode(', '));

        return count($authors);
    }

    /** @param  array<int, array<string, mixed>>  $authors */
    private function apply(Article $article, string $key, array $authors): int
    {
        $written = 0;

        foreach (array_values($authors) as $index => $entry) {
            $name = trim((string) ($entry['name'] ?? ''));

            if ($name === '') {
                continue;
            }

            $author = $this->author($name, $entry);

            ArticleAuthor::updateOrCreate(
                ['article_id' => $key, 'author_id' => $author->id],
                [
                    'position' => $index + 1,
                    'is_corresponding' => (bool) ($entry['corresponding'] ?? false),
                    'affiliation_text' => trim((string) ($entry['affiliation'] ?? '')) ?: null,
                ]
            );

            $written++;
        }

        $this->line("  wrote {$written} authors");

        return $written;
    }

    /** @param  array<string, mixed>  $entry */
    private function author(string $name, array $entry): Author
    {
        $email = trim((string) ($entry['email'] ?? ''));

        $author = filled($email)
            ? Author::where('email', $email)->first()
            : null;

        $author ??= Author::where('name', $name)->first();

        $names = $this->splitName($name, $entry);

        if ($author) {
            /* Only fill gaps: a name already curated by an editor stays put. */
            $author->fill(array_filter([
                'email' => filled($email) && blank($author->email) ? $email : null,
                'first_name' => blank($author->first_name) ? $names['first'] : null,
                'last_name' => blank($author->last_name) ? $names['last'] : null,
            ]))->save();

            return $author;
        }

        return Author::create([
            'name' => $name,
            'first_name' => $names['first'],
            'last_name' => $names['last'],
            'email' => filled($email) ? $email : null,
        ]);
    }

    /**
     * @param  array<string, mixed>  $entry
     * @return array{first: string, last: string}
     */
    private function splitName(string $name, array $entry): array
    {
        /*
         * Given and family names are worth stating outright in the file: no
         * splitting rule covers both "Suresh Babu A", where the family initial
         * trails, and "Tamara van Roo", where the particle belongs to it.
         */
        if (filled($entry['first_name'] ?? null) || filled($entry['last_name'] ?? null)) {
            return [
                'first' => trim((string) ($entry['first_name'] ?? '')),
                'last' => trim((string) ($entry['last_name'] ?? '')),
            ];
        }

        $parts = preg_split('/\s+/', $name) ?: [];

        if (count($parts) < 2) {
            return ['first' => '', 'last' => $name];
        }

        $last = (string) array_pop($parts);

        return ['first' => implode(' ', $parts), 'last' => $last];
    }
}
