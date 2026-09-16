<?php

namespace App\Console\Commands;

use App\Models\ServiceClient;
use Illuminate\Console\Command;

/** Grants (or with --remove, withdraws) an extra ability on a service client's key. */
class GrantServiceClientAbility extends Command
{
    protected $signature = 'service-clients:grant
        {id : The service client ID (see service-clients:list)}
        {ability : e.g. manuscripts.write}
        {--remove : Withdraw the ability instead of granting it}';

    protected $description = 'Grant or withdraw an ability (e.g. manuscripts.write) on a service client key.';

    public function handle(): int
    {
        $ability = $this->argument('ability');

        if (! in_array($ability, ServiceClient::ABILITIES, true)) {
            $this->error("Unknown ability \"{$ability}\". Known: ".implode(', ', ServiceClient::ABILITIES));

            return self::FAILURE;
        }

        $client = ServiceClient::find($this->argument('id'));

        if (! $client) {
            $this->error('No service client with that ID.');

            return self::FAILURE;
        }

        $abilities = collect($client->abilities ?? []);

        $abilities = $this->option('remove')
            ? $abilities->reject(fn ($a) => $a === $ability)
            : $abilities->push($ability)->unique();

        $client->update(['abilities' => $abilities->values()->all()]);

        $verb = $this->option('remove') ? 'Withdrew' : 'Granted';
        $this->info("{$verb} {$ability} for \"{$client->name}\" (#{$client->id}).");

        return self::SUCCESS;
    }
}
