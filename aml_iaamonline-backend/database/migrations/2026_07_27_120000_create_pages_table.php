<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            // Where the page is linked from: header nav, footer, or unlisted.
            $table->string('placement')->default('none');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['placement', 'is_published', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
