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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->enum('action', ['submission_created', 'manuscript_viewed', 'review_token_generated', 'verification_code_sent', 'verification_code_verified', 'review_accessed', 'review_submitted', 'review_token_revoked', 'decision_made', 'notification_sent', 'file_downloaded', 'file_uploaded'])->index();
            $table->string('actor_type')->nullable();
            $table->string('actor_email')->nullable()->index();
            $table->string('actor_ip')->nullable();
            $table->foreignId('manuscript_id')->nullable()->constrained('manuscripts')->onDelete('cascade');
            $table->foreignId('review_assignment_id')->nullable()->constrained('review_assignments')->onDelete('cascade');
            $table->string('resource_type')->nullable();
            $table->string('resource_id')->nullable();
            $table->longText('changes')->nullable();
            $table->longText('description')->nullable();
            $table->string('status')->nullable();
            $table->text('metadata')->nullable();
            $table->timestamps();
            $table->index('created_at');
            $table->index(['action', 'created_at']);
            $table->index(['manuscript_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
