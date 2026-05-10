<?php

namespace App\Console\Commands;

use App\Models\Author;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class EnhanceAuthorsCommand extends Command
{
    protected $signature = 'authors:enhance {--link-users : Also link authors to user accounts}';
    protected $description = 'Split author names into first_name/last_name and optionally link to user accounts';

    public function handle(): int
    {
        $this->splitNames();

        if ($this->option('link-users')) {
            $this->linkToUsers();
        }

        return Command::SUCCESS;
    }

    private function splitNames(): void
    {
        $authors = Author::whereNull('first_name')->orWhereNull('last_name')->get();
        $this->info("Splitting names for {$authors->count()} authors...");

        $bar = $this->output->createProgressBar($authors->count());
        $updated = 0;

        foreach ($authors as $author) {
            $name = trim($author->name ?? '');
            if (!$name) {
                $bar->advance();
                continue;
            }

            $parts = preg_split('/\s+/', $name);
            if (count($parts) >= 2) {
                $lastName = array_pop($parts);
                $firstName = implode(' ', $parts);
            } else {
                $firstName = $name;
                $lastName = '';
            }

            $author->update([
                'first_name' => $firstName,
                'last_name' => $lastName,
            ]);
            $updated++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Updated {$updated} author names");
    }

    private function linkToUsers(): void
    {
        $this->info('Linking authors to user accounts...');

        // Match by email first
        $emailMatches = 0;
        $authors = Author::whereNotNull('email')
            ->where('email', '!=', '')
            ->whereNull('user_id')
            ->get();

        foreach ($authors as $author) {
            $user = User::where('email', $author->email)->first();
            if ($user) {
                $author->update(['user_id' => $user->id]);
                $emailMatches++;
            }
        }

        $this->info("  Email matches: {$emailMatches}");

        // Match by name (first_name + last_name) for remaining
        $nameMatches = 0;
        $unlinked = Author::whereNull('user_id')
            ->whereNotNull('first_name')
            ->whereNotNull('last_name')
            ->where('last_name', '!=', '')
            ->get();

        foreach ($unlinked as $author) {
            $user = User::where('first_name', $author->first_name)
                ->where('last_name', $author->last_name)
                ->first();

            if (!$user) {
                $user = User::whereRaw(
                    "LOWER(TRIM(name)) = ?",
                    [strtolower(trim($author->name))]
                )->first();
            }

            if ($user) {
                $author->update(['user_id' => $user->id]);
                $nameMatches++;
            }
        }

        $this->info("  Name matches: {$nameMatches}");
        $this->info("  Total linked: " . ($emailMatches + $nameMatches));

        $remaining = Author::whereNull('user_id')->count();
        $this->info("  Remaining unlinked: {$remaining}");
    }
}
