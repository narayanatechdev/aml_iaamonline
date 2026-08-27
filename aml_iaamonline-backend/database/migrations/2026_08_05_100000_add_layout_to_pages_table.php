<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // 'prose' = free HTML content; any other value names a designed
            // frontend layout whose content field holds structured JSON
            // edited as a form in the dashboard (e.g. 'about', 'about-journal').
            $table->string('layout', 50)->default('prose')->after('content');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('layout');
        });
    }
};
