<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ImportUsersSeeder extends Seeder
{
    public function run(): void
    {
        $csvPath = $this->command->ask(
            'Path to users CSV/JSON file?',
            base_path('../users_import.json')
        );

        if (! file_exists($csvPath)) {
            $this->command->error("File not found: {$csvPath}");

            return;
        }

        $users = json_decode(file_get_contents($csvPath), true);
        if (! $users) {
            $this->command->error('Could not parse JSON file');

            return;
        }

        $this->command->info('Found '.count($users).' users to import');
        $bar = $this->command->getOutput()->createProgressBar(count($users));

        $imported = 0;
        $enriched = 0;
        $skipped = 0;

        $enrichable = [
            'title', 'first_name', 'last_name', 'degree', 'position', 'specialty',
            'field_of_study', 'orcid', 'phone', 'mobile', 'country', 'city',
            'affiliation', 'postal_code', 'home_page', 'alt_email', 'username',
            'join_date', 'comments',
        ];

        DB::beginTransaction();

        try {
            foreach ($users as $data) {
                $email = $data['email'] ?? null;
                if (! $email) {
                    $skipped++;
                    $bar->advance();

                    continue;
                }

                $existing = User::whereRaw('lower(email) = ?', [strtolower($email)])->first();
                if ($existing) {
                    // Fill blank fields only — never overwrite data a user
                    // (or an admin) has already set.
                    $updates = [];
                    foreach ($enrichable as $field) {
                        $incoming = $data[$field] ?? null;
                        if (filled($incoming) && blank($existing->{$field})) {
                            $updates[$field] = $incoming;
                        }
                    }
                    if (blank($existing->name) && (filled($data['first_name'] ?? null) || filled($data['last_name'] ?? null))) {
                        $updates['name'] = trim(($data['first_name'] ?? '').' '.($data['last_name'] ?? ''));
                    }
                    if ($updates !== []) {
                        $existing->update($updates);
                        $enriched++;
                    } else {
                        $skipped++;
                    }
                    $bar->advance();

                    continue;
                }

                $user = User::create([
                    'name' => trim(($data['first_name'] ?? '').' '.($data['last_name'] ?? '')),
                    'email' => $email,
                    'password' => Hash::make('ChangeMeOnFirstLogin!'),
                    'title' => $data['title'] ?? null,
                    'first_name' => $data['first_name'] ?? null,
                    'last_name' => $data['last_name'] ?? null,
                    'degree' => $data['degree'] ?? null,
                    'position' => $data['position'] ?? null,
                    'specialty' => $data['specialty'] ?? null,
                    'field_of_study' => $data['field_of_study'] ?? null,
                    'orcid' => $data['orcid'] ?? null,
                    'phone' => $data['phone'] ?? null,
                    'mobile' => $data['mobile'] ?? null,
                    'country' => $data['country'] ?? null,
                    'city' => $data['city'] ?? null,
                    'affiliation' => $data['affiliation'] ?? null,
                    'postal_code' => $data['postal_code'] ?? null,
                    'home_page' => $data['home_page'] ?? null,
                    'alt_email' => $data['alt_email'] ?? null,
                    'username' => $data['username'] ?? null,
                    'is_reviewer' => ($data['is_reviewer'] ?? 'No') === 'Yes',
                    'receive_news' => ($data['receive_news'] ?? 'Yes') === 'Yes',
                    'join_date' => $data['join_date'] ?? null,
                    'comments' => $data['comments'] ?? null,
                ]);

                // Assign author role by default
                $authorRole = Role::where('name', 'author')->first();
                if ($authorRole) {
                    $user->assignRole($authorRole);
                }

                // Assign reviewer role if applicable
                if ($user->is_reviewer) {
                    $reviewerRole = Role::where('name', 'reviewer')->first();
                    if ($reviewerRole) {
                        $user->assignRole($reviewerRole);
                    }
                }

                $imported++;
                $bar->advance();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Import failed: '.$e->getMessage());

            return;
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info("Imported: {$imported}, Enriched: {$enriched}, Skipped: {$skipped}");
    }
}
