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
        // Relax the action enum to a plain string so new audit actions
        // (e.g. reviewer_invited) don't violate a CHECK constraint.
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('action')->change();
        });
    }

    public function down(): void
    {
        // Non-reversible enum rebuild; leave as a string.
    }
};
