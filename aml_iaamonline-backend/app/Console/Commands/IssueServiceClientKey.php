<?php

namespace App\Console\Commands;

use App\Models\ServiceClient;
use Illuminate\Console\Command;

/**
 * Mints a new service-to-service API key for the fetch API (ServiceApiAuth).
 * Prints the plaintext key exactly once — only its hash is stored, so save
 * it somewhere safe immediately (e.g. the calling system's own .env).
 */
class IssueServiceClientKey extends Command
{
    protected $signature = 'service-clients:issue {name : Who this key is for, e.g. "IAAM Portal"}';

    protected $description = 'Issue a new service-to-service API key for the AML fetch API.';

    public function handle(): int
    {
        [$client, $plainKey] = ServiceClient::issue($this->argument('name'));

        $this->newLine();
        $this->info("Service client #{$client->id} \"{$client->name}\" created.");
        $this->warn('API key (shown once — store it now, it cannot be recovered):');
        $this->line("  {$plainKey}");
        $this->newLine();
        $this->line('Use it as: Authorization: Bearer '.$plainKey);

        return self::SUCCESS;
    }
}
