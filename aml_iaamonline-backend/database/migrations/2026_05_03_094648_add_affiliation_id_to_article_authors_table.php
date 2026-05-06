<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('article_authors', function (Blueprint $table) {
            $table->foreignId('affiliation_id')->nullable()->after('author_id')->constrained('affiliations')->nullOnDelete();
            $table->text('affiliation_text')->nullable()->after('affiliation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_authors', function (Blueprint $table) {
            $table->dropForeign(['affiliation_id']);
            $table->dropColumn(['affiliation_id', 'affiliation_text']);
        });
    }
};
