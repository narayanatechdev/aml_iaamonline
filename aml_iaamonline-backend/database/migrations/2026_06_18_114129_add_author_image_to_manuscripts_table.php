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
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->string('author_image_url')->nullable()->after('author_affiliation');
            $table->string('author_image_mime_type')->nullable()->after('author_image_url');
            $table->integer('author_image_size')->nullable()->after('author_image_mime_type');
            $table->index(['author_email', 'author_image_url']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropIndex(['author_email', 'author_image_url']);
            $table->dropColumn(['author_image_url', 'author_image_mime_type', 'author_image_size']);
        });
    }
};
