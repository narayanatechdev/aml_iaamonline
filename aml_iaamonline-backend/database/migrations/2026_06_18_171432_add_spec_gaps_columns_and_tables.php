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
            $table->unsignedTinyInteger('trl')->nullable()->after('category');     // 1–9
            $table->string('division')->nullable()->after('trl');                  // challenge division
            $table->decimal('similarity_score', 5, 2)->nullable()->after('division'); // iThenticate %
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->text('confidential_comments')->nullable()->after('comments');  // editor-only
        });

        Schema::create('notifications_feed', function (Blueprint $table) {
            $table->id();
            $table->string('user_email')->index();
            $table->string('type');
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('link')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('consortium_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sso_domain')->nullable();
            $table->text('ip_ranges')->nullable(); // comma-separated CIDR
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->dropColumn(['trl', 'division', 'similarity_score']);
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('confidential_comments');
        });
        Schema::dropIfExists('notifications_feed');
        Schema::dropIfExists('consortium_members');
    }
};
