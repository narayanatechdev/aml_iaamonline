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
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->longText('acknowledgements')->nullable()->after('keywords');
            $table->longText('funding_information')->nullable()->after('acknowledgements');
            $table->longText('conflict_of_interest')->nullable()->after('funding_information');
            $table->json('author_contributions')->nullable()->after('conflict_of_interest');
            $table->longText('data_availability')->nullable()->after('author_contributions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn(['acknowledgements', 'funding_information', 'conflict_of_interest', 'author_contributions', 'data_availability']);
        });
    }
};
