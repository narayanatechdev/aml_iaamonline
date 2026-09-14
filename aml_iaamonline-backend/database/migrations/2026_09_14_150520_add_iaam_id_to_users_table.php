<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The central IAAM identifier (IaamIdService) — "IAAM" + 10 digits:
     * 2-digit cohort year, 7-digit per-year sequence, 1 Luhn check digit.
     * Minted here on AML for now (see IaamIdService docblock); nullable
     * because pre-existing rows are backfilled by a separate command,
     * not this migration.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('iaam_id', 14)->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('iaam_id');
        });
    }
};
