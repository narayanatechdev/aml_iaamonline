<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Setup Roles and Permissions first
        $this->call(RolePermissionSeeder::class);

        $adminRole = Role::where('name', 'admin')->first();
        $editorRole = Role::where('name', 'editor')->first();

        // Create Super Admin
        $admin = User::factory()->create([
            'name' => 'IAAM Admin',
            'email' => 'admin@iaam.org',
            'password' => Hash::make('IAAMAdmin2026!'),
        ]);
        $admin->roles()->attach($adminRole->id, ['is_active' => true, 'assigned_at' => now()]);

        // Create Editor
        $editor = User::factory()->create([
            'name' => 'Editor User',
            'email' => 'editor@iaam.org',
            'password' => Hash::make('Editor2026!'),
        ]);
        $editor->roles()->attach($editorRole->id, ['is_active' => true, 'assigned_at' => now()]);
    }
}
