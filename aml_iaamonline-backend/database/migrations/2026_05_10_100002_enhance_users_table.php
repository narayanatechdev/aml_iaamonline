<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('title', 20)->nullable()->after('name');
            $table->string('first_name')->nullable()->after('title');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('degree')->nullable()->after('last_name');
            $table->string('position')->nullable()->after('degree');
            $table->string('specialty')->nullable()->after('position');
            $table->string('field_of_study')->nullable()->after('specialty');
            $table->string('orcid')->nullable()->after('field_of_study');
            $table->string('phone')->nullable()->after('orcid');
            $table->string('mobile')->nullable()->after('phone');
            $table->string('fax')->nullable()->after('mobile');
            $table->string('country')->nullable()->after('fax')->index();
            $table->string('city')->nullable()->after('country');
            $table->text('affiliation')->nullable()->after('city');
            $table->string('postal_code')->nullable()->after('affiliation');
            $table->string('home_page')->nullable()->after('postal_code');
            $table->string('alt_email')->nullable()->after('home_page');
            $table->string('username')->nullable()->after('alt_email');
            $table->boolean('is_reviewer')->default(false)->after('username');
            $table->boolean('receive_news')->default(true)->after('is_reviewer');
            $table->date('join_date')->nullable()->after('receive_news');
            $table->text('comments')->nullable()->after('join_date');

            $table->index(['first_name', 'last_name']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['first_name', 'last_name']);
            $table->dropIndex(['country']);
            $table->dropColumn([
                'title', 'first_name', 'last_name', 'degree', 'position',
                'specialty', 'field_of_study', 'orcid', 'phone', 'mobile',
                'fax', 'country', 'city', 'affiliation', 'postal_code',
                'home_page', 'alt_email', 'username', 'is_reviewer',
                'receive_news', 'join_date', 'comments',
            ]);
        });
    }
};
