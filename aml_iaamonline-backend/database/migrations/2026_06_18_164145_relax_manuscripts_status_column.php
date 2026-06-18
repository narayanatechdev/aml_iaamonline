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
        // The original CHECK enum used hyphenated values and was missing several
        // statuses the application uses (with_editor, decision, published, …).
        // Relax to a plain string; statuses are validated in application logic.
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->string('status')->default('submitted')->change();
        });
    }

    public function down(): void
    {
        // Non-reversible enum rebuild; leave as a string.
    }
};
