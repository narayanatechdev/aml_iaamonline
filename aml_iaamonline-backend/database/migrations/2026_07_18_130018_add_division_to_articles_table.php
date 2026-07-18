<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Challenge division an article is mapped to (matches a division name in
     * the homepage CMS challenge_divisions block).
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('division')->nullable()->after('subject')->index();
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['division']);
            $table->dropColumn('division');
        });
    }
};
