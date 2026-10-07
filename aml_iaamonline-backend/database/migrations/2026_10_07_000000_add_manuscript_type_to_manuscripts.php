<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The submission form has always asked for a manuscript type (research
 * article, review, letter…) but there was nowhere to keep it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            if (! Schema::hasColumn('manuscripts', 'manuscript_type')) {
                $table->string('manuscript_type', 100)->nullable()->after('category');
            }
        });
    }

    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            if (Schema::hasColumn('manuscripts', 'manuscript_type')) {
                $table->dropColumn('manuscript_type');
            }
        });
    }
};
