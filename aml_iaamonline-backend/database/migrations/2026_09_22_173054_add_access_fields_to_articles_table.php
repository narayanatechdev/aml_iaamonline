<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->boolean('is_open_access')->default(false)->after('status');
            $table->string('apc_status', 20)->default('none')->after('is_open_access');
            $table->boolean('is_invited')->default(false)->after('apc_status');

            $table->index('is_open_access');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropIndex(['is_open_access']);
            $table->dropColumn(['is_open_access', 'apc_status', 'is_invited']);
        });
    }
};
