<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * An author on an article can hold several affiliations (rendered as
     * superscripts "1, 2" on the article page). The ordered id list lives
     * here; the legacy single affiliation_id remains as a fallback for rows
     * created before this column existed.
     */
    public function up(): void
    {
        Schema::table('article_authors', function (Blueprint $table) {
            $table->json('affiliation_ids')->nullable()->after('affiliation_id');
        });
    }

    public function down(): void
    {
        Schema::table('article_authors', function (Blueprint $table) {
            $table->dropColumn('affiliation_ids');
        });
    }
};
