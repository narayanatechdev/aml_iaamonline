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
        Schema::create('manuscripts', function (Blueprint $table) {
            $table->id();
            $table->string('submission_id')->unique()->index();
            $table->string('title');
            $table->string('authors');
            $table->string('author_email')->index();
            $table->string('author_affiliation');
            $table->longText('abstract');
            $table->string('keywords');
            $table->enum('category', ['nanotechnology', 'materials-science', 'polymers', 'composites', 'functional-materials', 'sustainable', 'other']);
            $table->enum('status', ['submitted', 'editor-review', 'under-review', 'revision-requested', 'accepted', 'rejected'])->default('submitted')->index();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->integer('file_size')->nullable();
            $table->timestamp('submitted_at')->index();
            $table->timestamp('editor_review_completed_at')->nullable();
            $table->text('editor_notes')->nullable();
            $table->timestamp('peer_review_completed_at')->nullable();
            $table->integer('reviewer_count')->default(0);
            $table->enum('final_decision', ['pending', 'accepted', 'rejected', 'revision-requested'])->default('pending')->index();
            $table->timestamp('decision_date')->nullable();
            $table->text('decision_notes')->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscripts');
    }
};
