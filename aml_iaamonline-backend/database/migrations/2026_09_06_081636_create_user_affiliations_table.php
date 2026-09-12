<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Structured user affiliations: a user can hold several (Affiliation 1,
     * Affiliation 2, …), each with its own contact email, and exactly one
     * marked primary. Replaces the free-text users.affiliation blob, which
     * remains as a legacy fallback for display.
     */
    public function up(): void
    {
        Schema::create('user_affiliations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('name');
            $table->string('email')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('position')->default(1);
            $table->timestamps();

            $table->index(['user_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_affiliations');
    }
};
