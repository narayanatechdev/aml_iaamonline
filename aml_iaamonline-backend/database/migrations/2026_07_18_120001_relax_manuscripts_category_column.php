<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // The original CHECK enum only allowed the seven hardcoded research
        // areas. Subjects are now admin-managed, so relax to a plain string;
        // values are validated against the subjects table in application logic.
        DB::statement('ALTER TABLE manuscripts DROP CONSTRAINT IF EXISTS manuscripts_category_check');

        Schema::table('manuscripts', function (Blueprint $table) {
            $table->string('category')->change();
        });
    }

    public function down(): void
    {
        // Non-reversible enum rebuild; leave as a string.
    }
};
