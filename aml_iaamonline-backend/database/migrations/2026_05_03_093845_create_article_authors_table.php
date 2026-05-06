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
        Schema::create('article_authors', function (Blueprint $table) {
            $table->id();
            $table->string('article_id')->index();
            $table->foreignId('author_id')->constrained('authors')->cascadeOnDelete();
            $table->integer('position')->default(1);
            $table->boolean('is_corresponding')->default(false);
            $table->timestamps();
            
            $table->unique(['article_id', 'author_id']);
            $table->index(['article_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_authors');
    }
};
