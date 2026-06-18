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
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('proposal_id')->unique();
            $table->string('kind'); // Book | Conference Proceedings
            $table->string('title');
            $table->string('editors')->nullable();
            $table->text('scope')->nullable();
            $table->string('units')->nullable();
            $table->string('timeline')->nullable();
            $table->string('audience')->nullable();
            $table->string('status')->default('proposed'); // proposed | under_evaluation | approved | declined
            $table->string('author_email');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->text('decision_notes')->nullable();
            $table->timestamps();

            $table->index(['author_email', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
