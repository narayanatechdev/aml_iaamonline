<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * One row per cohort year, holding the next sequence number to assign
     * for an IAAM ID minted in that year (IaamIdService::generate()).
     * Incremented atomically under a row lock so concurrent registrations
     * never collide.
     */
    public function up(): void
    {
        Schema::create('iaam_id_sequences', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->primary();
            $table->unsignedBigInteger('next_sequence')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('iaam_id_sequences');
    }
};
