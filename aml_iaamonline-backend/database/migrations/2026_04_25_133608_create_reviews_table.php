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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_assignment_id')->constrained('review_assignments')->onDelete('cascade');
            $table->foreignId('manuscript_id')->constrained('manuscripts')->onDelete('cascade');
            $table->string('reviewer_email')->index();
            $table->enum('recommendation', ['accept', 'minor-revisions', 'major-revisions', 'reject'])->index();
            $table->longText('strengths')->nullable();
            $table->longText('weaknesses')->nullable();
            $table->longText('comments')->nullable();
            $table->longText('questions')->nullable();
            $table->integer('quality_score')->nullable();
            $table->integer('novelty_score')->nullable();
            $table->integer('relevance_score')->nullable();
            $table->boolean('is_submitted')->default(false)->index();
            $table->timestamp('submitted_at')->nullable();
            $table->boolean('is_draft')->default(true);
            $table->timestamp('last_saved_at')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
