<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('degree')->nullable()->after('orcid');
            $table->string('position')->nullable()->after('degree');
            $table->string('phone')->nullable()->after('position');
            $table->string('mobile')->nullable()->after('phone');
            $table->string('country')->nullable()->after('mobile')->index();
            $table->string('city')->nullable()->after('country');

            $table->index(['first_name', 'last_name']);
            $table->index('last_name');
        });
    }

    public function down(): void
    {
        Schema::table('authors', function (Blueprint $table) {
            $table->dropIndex(['first_name', 'last_name']);
            $table->dropIndex(['last_name']);
            $table->dropIndex(['country']);
            $table->dropColumn([
                'first_name', 'last_name', 'degree', 'position',
                'phone', 'mobile', 'country', 'city',
            ]);
        });
    }
};
