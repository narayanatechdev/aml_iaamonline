<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * One-off backfill: splits the free-text users.affiliation blob (imported as
 * "1 - Institute A. 2 - Institute B.") into structured user_affiliations
 * rows. The first entry becomes primary. Idempotent: users who already have
 * affiliation rows are left alone; users.affiliation stays untouched as a
 * legacy fallback.
 */
class SplitUserAffiliationsSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereNotNull('affiliation')
            ->where('affiliation', '!=', '')
            ->whereDoesntHave('affiliations')
            ->get(['id', 'affiliation']);

        $this->command->info("Users with unsplit affiliation text: {$users->count()}");

        $now = now();
        $rows = [];
        $multi = 0;

        foreach ($users as $user) {
            $parts = $this->split($user->affiliation);
            if (count($parts) > 1) {
                $multi++;
            }
            foreach ($parts as $i => $name) {
                $rows[] = [
                    'user_id' => $user->id,
                    'name' => $name,
                    'email' => null,
                    'is_primary' => $i === 0,
                    'position' => $i + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('user_affiliations')->insert($chunk);
        }

        $this->command->info('Inserted '.count($rows)." affiliation rows ({$multi} users had multiple affiliations).");
    }

    /**
     * Split "1 - Institute A. 2 - Institute B." into its entries. The dash
     * needs surrounding whitespace so postal codes like 35400-000 survive.
     *
     * @return list<string>
     */
    private function split(string $text): array
    {
        $parts = preg_split('/(?:^|\s)\d{1,2}\s*[-–—]\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);

        $cleaned = [];
        foreach ($parts ?: [] as $part) {
            $part = trim(preg_replace('/\s+/', ' ', $part) ?? '');
            $part = rtrim($part, '.');
            if ($part !== '') {
                $cleaned[] = $part;
            }
        }

        return $cleaned !== [] ? $cleaned : [trim($text)];
    }
}
