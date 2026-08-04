<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // IAAM membership tier key, matching access_model settings tiers
            // (regular, fellow, distinguished, industry, institutional).
            $table->string('membership_tier')->nullable()->after('email');
        });

        Schema::create('article_access_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('article_id');
            $table->date('accessed_on');
            $table->timestamps();

            // Re-reading the same article on the same day consumes no quota.
            $table->unique(['user_id', 'article_id', 'accessed_on']);
            $table->index(['user_id', 'accessed_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_access_logs');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('membership_tier');
        });
    }
};
