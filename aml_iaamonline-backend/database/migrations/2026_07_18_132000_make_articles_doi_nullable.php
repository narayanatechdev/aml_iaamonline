<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Articles created in the admin without a DOI must not collide on the
     * doi unique constraint, so allow NULL (unique ignores NULLs) instead
     * of empty strings.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('doi')->nullable()->change();
        });

        DB::table('articles')->where('doi', '')->update(['doi' => null]);
    }

    public function down(): void
    {
        DB::table('articles')->whereNull('doi')->update(['doi' => '']);

        Schema::table('articles', function (Blueprint $table) {
            $table->string('doi')->nullable(false)->change();
        });
    }
};
