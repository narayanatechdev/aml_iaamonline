<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\IaamIdService;
use Illuminate\Console\Command;

/**
 * One-off: assigns an IAAM ID (see IaamIdService) to every existing user
 * that doesn't already have one, using their real join_date (falling back
 * to created_at) as the cohort year — so legacy accounts read as legacy,
 * not as if they all signed up today. Processed oldest-first so the
 * per-year sequence lands in true chronological order.
 */
class BackfillIaamIds extends Command
{
    protected $signature = 'users:backfill-iaam-ids';

    protected $description = 'Assign IAAM IDs to existing users that do not have one yet, using their real join date.';

    public function handle(IaamIdService $service): int
    {
        $users = User::whereNull('iaam_id')
            ->get(['id', 'join_date', 'created_at'])
            ->sortBy(fn (User $u) => $u->join_date ?? $u->created_at);

        $this->info("Users without an IAAM ID: {$users->count()}");
        $bar = $this->output->createProgressBar($users->count());

        foreach ($users as $user) {
            $cohortDate = $user->join_date ?? $user->created_at;
            $user->forceFill(['iaam_id' => $service->generate($cohortDate)])->save();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done.');

        return self::SUCCESS;
    }
}
