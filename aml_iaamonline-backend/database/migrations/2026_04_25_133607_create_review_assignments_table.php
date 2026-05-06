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
        Schema::create('review_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained('manuscripts')->onDelete('cascade');
            $table->string('reviewer_email')->index();
            $table->string('reviewer_name')->nullable();
            $table->enum('status', ['invited', 'accepted', 'declined', 'completed'])->default('invited')->index();
            $table->timestamp('invited_at');
            $table->timestamp('response_date')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('reminder_count')->default(0);
            $table->timestamp('last_reminder_sent_at')->nullable();
            $table->timestamps();
            $table->unique(['manuscript_id', 'reviewer_email']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_assignments');
    }
};
