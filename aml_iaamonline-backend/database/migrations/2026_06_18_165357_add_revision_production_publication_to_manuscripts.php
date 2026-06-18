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
            $table->unsignedInteger('revision_round')->default(0)->after('status');
            $table->text('revision_response')->nullable()->after('revision_round');
            $table->boolean('prod_copyedit')->default(false)->after('revision_response');
            $table->boolean('prod_typeset')->default(false)->after('prod_copyedit');
            $table->boolean('prod_proof')->default(false)->after('prod_typeset');
            $table->boolean('prod_xml')->default(false)->after('prod_proof');
            $table->string('volume')->nullable()->after('prod_xml');
            $table->string('issue')->nullable()->after('volume');
            $table->string('pages')->nullable()->after('issue');
            $table->string('doi')->nullable()->after('pages');
            $table->timestamp('published_at')->nullable()->after('doi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn([
                'revision_round', 'revision_response',
                'prod_copyedit', 'prod_typeset', 'prod_proof', 'prod_xml',
                'volume', 'issue', 'pages', 'doi', 'published_at',
            ]);
        });
    }
};
