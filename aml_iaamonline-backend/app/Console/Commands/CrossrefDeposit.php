<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Services\Crossref\CrossrefDepositService;
use App\Services\Crossref\CrossrefXmlBuilder;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use RuntimeException;

class CrossrefDeposit extends Command
{
    protected $signature = 'crossref:deposit
        {--doi=* : Deposit only these DOIs}
        {--volume= : Deposit a whole volume}
        {--issue= : Narrow to one issue, with --volume}
        {--year= : Deposit a publication year}
        {--unregistered : Only articles Crossref does not already know}
        {--limit=0 : Cap how many articles are included}
        {--dry-run : Print the XML and send nothing}
        {--force : Skip the production confirmation, for an authorised unattended run}
        {--out= : Write the XML to this path}';

    protected $description = 'Register or update article DOIs at Crossref (schema 5.5.0)';

    public function handle(CrossrefDepositService $deposits): int
    {
        $articles = $this->articles();

        if ($articles->isEmpty()) {
            $this->warn('No articles matched. Nothing to deposit.');

            return self::SUCCESS;
        }

        $this->line("Articles selected: {$articles->count()}");

        $missingAuthors = $articles->filter(fn (Article $a) => $a->authors->isEmpty());
        if ($missingAuthors->isNotEmpty()) {
            $this->warn("{$missingAuthors->count()} have no authors and will deposit without contributors.");
        }

        $builder = CrossrefXmlBuilder::forCurrentJournal();
        $batchId = $builder->generateBatchId();
        $xml = $builder->build($articles, $batchId);

        if ($path = $this->option('out')) {
            file_put_contents($path, $xml);
            $this->info("XML written to {$path}");
        }

        if ($this->option('dry-run')) {
            $this->info("DRY RUN — batch {$batchId}, ".strlen($xml).' bytes. Nothing sent.');
            if (! $path) {
                $this->line($xml);
            }

            return self::SUCCESS;
        }

        if (! $deposits->isConfigured()) {
            $this->error('Crossref credentials are not configured. Set CROSSREF_USERNAME and CROSSREF_PASSWORD.');

            return self::FAILURE;
        }

        // Registering a DOI is irreversible and globally visible, so a
        // production deposit is never allowed to happen unattended.
        $this->line('Endpoint: '.$deposits->endpoint());
        if ($deposits->isProduction() && ! $this->option('force') && ! $this->confirm('This deposits to PRODUCTION Crossref and cannot be undone. Continue?', false)) {
            $this->warn('Aborted.');

            return self::SUCCESS;
        }

        try {
            $result = $deposits->deposit($xml, $batchId);
        } catch (RuntimeException $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        $this->line("Batch id: {$result['batch_id']}");
        $this->line("HTTP {$result['status']}");
        $this->line($result['body']);

        if (! $result['ok']) {
            $this->error('Crossref did not accept the deposit.');

            return self::FAILURE;
        }

        $this->info('Queued. Crossref processes deposits asynchronously — check the result mail or the submission queue.');

        return self::SUCCESS;
    }

    /** @return Collection<int, Article> */
    private function articles()
    {
        $query = Article::query()
            ->with(['authors'])
            ->whereNotNull('doi')
            ->where('doi', '!=', '')
            ->where('status', 'published');

        if ($dois = array_filter((array) $this->option('doi'))) {
            $query->whereIn('doi', $dois);
        }

        if ($volume = $this->option('volume')) {
            $query->where('volume', $volume);
        }

        if ($issue = $this->option('issue')) {
            $query->where('issue', $issue);
        }

        if ($year = $this->option('year')) {
            $query->where('publish_year', $year);
        }

        if ($this->option('unregistered')) {
            $query->where(fn (Builder $q) => $q->whereNull('doi_synced_at'));
        }

        $query->orderBy('volume')->orderBy('issue')->orderBy('pages_from');

        if ($limit = (int) $this->option('limit')) {
            $query->limit($limit);
        }

        return $query->get();
    }
}
