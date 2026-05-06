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
        Schema::create('review_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token')->unique()->index();
            $table->string('token_hash')->unique()->index();
            $table->foreignId('review_assignment_id')->constrained('review_assignments')->onDelete('cascade');
            $table->string('reviewer_email')->index();
            $table->boolean('is_revoked')->default(false)->index();
            $table->timestamp('expires_at')->index();
            $table->timestamp('used_at')->nullable();
            $table->integer('access_count')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->text('ip_addresses')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_tokens');
    }
};
