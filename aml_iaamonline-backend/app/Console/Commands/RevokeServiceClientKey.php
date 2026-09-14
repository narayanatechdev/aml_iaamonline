<?php

namespace App\Console\Commands;

use App\Models\ServiceClient;
use Illuminate\Console\Command;

/** Deactivates a service client's key — e.g. after it's appeared somewhere it shouldn't (chat, logs, a commit). */
class RevokeServiceClientKey extends Command
{
    protected $signature = 'service-clients:revoke {id : The service client ID (see service-clients:list)}';

    protected $description = 'Revoke a service client\'s API key (sets is_active = false; requests with it get 401 from then on).';

    public function handle(): int
    {
        $client = ServiceClient::find($this->argument('id'));

        if (! $client) {
            $this->error('No service client with that ID.');

            return self::FAILURE;
        }

        if (! $client->is_active) {
            $this->warn("\"{$client->name}\" (#{$client->id}) is already inactive.");

            return self::SUCCESS;
        }

        $client->update(['is_active' => false]);
        $this->info("Revoked \"{$client->name}\" (#{$client->id}). Its key no longer authenticates.");

        return self::SUCCESS;
    }
}
