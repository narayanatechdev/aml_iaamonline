<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When a manuscript entered production.
 *
 * The production checklist recorded what had been done but never when the
 * phase began, so an author's timeline jumped from the decision straight to
 * publication. Nullable and not backfilled: papers that went through
 * production before this have no honest date to give, and inventing one from
 * the decision date would put a milestone on the timeline that never happened.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            if (! Schema::hasColumn('manuscripts', 'production_started_at')) {
                $table->timestamp('production_started_at')->nullable()->after('prod_xml');
            }
        });
    }

    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn('production_started_at');
        });
    }
};
