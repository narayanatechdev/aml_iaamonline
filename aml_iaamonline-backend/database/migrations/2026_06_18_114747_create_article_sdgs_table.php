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
        Schema::create('article_sdgs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('sustainable_development_goal_id')->constrained('sustainable_development_goals')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['article_id', 'sustainable_development_goal_id']);
            $table->index('sustainable_development_goal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_sdgs');
    }
};
