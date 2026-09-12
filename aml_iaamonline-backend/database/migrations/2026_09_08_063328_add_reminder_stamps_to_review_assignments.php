<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Timestamps recording which automated reminders have already gone out
     * for a review assignment, so the daily scheduler sends each at most once.
     */
    public function up(): void
    {
        Schema::table('review_assignments', function (Blueprint $table) {
            $table->timestamp('invite_reminder_sent_at')->nullable()->after('due_date');
            $table->timestamp('due_soon_reminder_sent_at')->nullable()->after('invite_reminder_sent_at');
            $table->timestamp('due_reminder_sent_at')->nullable()->after('due_soon_reminder_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('review_assignments', function (Blueprint $table) {
            $table->dropColumn(['invite_reminder_sent_at', 'due_soon_reminder_sent_at', 'due_reminder_sent_at']);
        });
    }
};
