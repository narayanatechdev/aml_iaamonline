<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The original enums don't include values the RolePermissionSeeder now
     * uses (role type 'publisher', permission category 'content'), so seeding
     * a fresh database fails. Relax both to plain strings; values are
     * governed by the seeder.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_type_check');
            DB::statement('ALTER TABLE permissions DROP CONSTRAINT IF EXISTS permissions_category_check');
        }

        Schema::table('roles', function (Blueprint $table) {
            $table->string('type')->change();
        });

        Schema::table('permissions', function (Blueprint $table) {
            $table->string('category')->change();
        });
    }

    public function down(): void
    {
        // Non-reversible enum rebuild; leave as strings.
    }
};
