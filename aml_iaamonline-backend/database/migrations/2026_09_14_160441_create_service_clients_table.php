<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Other systems (the IAAM Portal, eventually AMP) that are allowed to
     * call AML's service-to-service fetch API — e.g. /api/service/users/{iaamId}.
     * Separate from Sanctum's personal-access tokens: this authenticates a
     * whole system, not a logged-in person, and is never exposed as "log in as".
     */
    public function up(): void
    {
        Schema::create('service_clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('api_key_hash');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_clients');
    }
};
