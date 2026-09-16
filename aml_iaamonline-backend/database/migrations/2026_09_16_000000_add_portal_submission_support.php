<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lets the IAAM Portal submit manuscripts for people who have no AML login:
 * the manuscript records the author's IAAM ID and which system it came in
 * through, and service clients get explicit abilities so a key issued for
 * reading can't write.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('manuscripts', function (Blueprint $table) {
            if (! Schema::hasColumn('manuscripts', 'iaam_id')) {
                $table->string('iaam_id', 14)->nullable()->index();
            }

            if (! Schema::hasColumn('manuscripts', 'submitted_via')) {
                $table->string('submitted_via', 20)->default('aml');
            }
        });

        // A paper's author list (corresponding author + co-authors) easily
        // passes 255 characters, which Postgres rejects.
        Schema::table('manuscripts', function (Blueprint $table) {
            $table->text('authors')->change();
        });

        Schema::table('service_clients', function (Blueprint $table) {
            if (! Schema::hasColumn('service_clients', 'abilities')) {
                $table->json('abilities')->nullable();
            }
        });
    }

    public function down(): void
    {
        // authors stays text: shortening it could truncate real data.
        Schema::table('manuscripts', function (Blueprint $table) {
            if (Schema::hasColumn('manuscripts', 'iaam_id')) {
                $table->dropIndex(['iaam_id']);
                $table->dropColumn('iaam_id');
            }

            if (Schema::hasColumn('manuscripts', 'submitted_via')) {
                $table->dropColumn('submitted_via');
            }
        });

        Schema::table('service_clients', function (Blueprint $table) {
            if (Schema::hasColumn('service_clients', 'abilities')) {
                $table->dropColumn('abilities');
            }
        });
    }
};
