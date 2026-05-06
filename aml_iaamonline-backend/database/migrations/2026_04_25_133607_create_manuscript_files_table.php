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
        Schema::create('manuscript_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manuscript_id')->constrained('manuscripts')->onDelete('cascade');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->integer('file_size');
            $table->string('mime_type');
            $table->text('file_hash')->nullable();
            $table->enum('file_type_category', ['manuscript', 'supplementary', 'revision', 'response'])->default('manuscript');
            $table->boolean('is_watermarked')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->timestamp('uploaded_at');
            $table->timestamps();
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manuscript_files');
    }
};
