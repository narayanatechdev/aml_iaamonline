<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->unique()->index();
            $table->string('manuscript_id')->nullable()->index();
            $table->string('title');
            $table->string('document_type')->default('Research Article')->index();
            $table->string('subject')->default('Materials Science')->index();
            $table->longText('abstract')->nullable();
            $table->text('keywords')->nullable();
            $table->string('doi')->unique()->index();
            $table->string('volume')->index();
            $table->string('issue')->index();
            $table->integer('pages_from')->nullable();
            $table->integer('pages_to')->nullable();
            $table->string('language', 10)->default('EN');
            $table->enum('status', ['draft', 'published', 'retracted', 'archived'])->default('published')->index();

            // URLs & files
            $table->string('pdf_url')->nullable();
            $table->string('original_pdf_url')->nullable();
            $table->string('graphical_abstract_url')->nullable();
            $table->string('article_link')->nullable();
            $table->string('file_name')->nullable();

            // Metrics
            $table->integer('views_count')->default(0);
            $table->integer('pdf_downloads')->default(0);
            $table->integer('cited_count')->default(0);

            // Corresponding author (denormalized for quick access)
            $table->string('corresponding_author')->nullable();

            // Dates
            $table->date('receive_date')->nullable();
            $table->date('revise_date')->nullable();
            $table->date('accept_date')->nullable();
            $table->date('publish_date')->nullable()->index();
            $table->integer('publish_year')->nullable()->index();
            $table->string('publish_month')->nullable();

            $table->timestamps();

            $table->index(['volume', 'issue']);
            $table->index(['publish_year', 'volume', 'issue']);
        });

        // Update article_authors to reference articles table
        Schema::table('article_authors', function (Blueprint $table) {
            $table->unsignedBigInteger('article_id_fk')->nullable()->after('article_id');
            $table->index('article_id_fk');
        });
    }

    public function down(): void
    {
        Schema::table('article_authors', function (Blueprint $table) {
            $table->dropIndex(['article_id_fk']);
            $table->dropColumn('article_id_fk');
        });

        Schema::dropIfExists('articles');
    }
};
