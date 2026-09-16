<?php

namespace App\Console\Commands;

use App\Models\ServiceClient;
use Illuminate\Console\Command;

class ListServiceClients extends Command
{
    protected $signature = 'service-clients:list';

    protected $description = 'List service clients, whether their key is active, and what they may do.';

    public function handle(): int
    {
        $this->table(
            ['ID', 'Name', 'Active', 'Abilities', 'Last used'],
            ServiceClient::orderBy('id')->get()->map(fn (ServiceClient $c) => [
                $c->id,
                $c->name,
                $c->is_active ? 'yes' : 'no',
                implode(', ', array_merge(['read'], $c->abilities ?? [])),
                $c->last_used_at?->toDateTimeString() ?? 'never',
            ]),
        );

        return self::SUCCESS;
    }
}
