<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Legacy research-area options the submission forms offered before
     * subjects became admin-managed. Kept so old manuscripts stay valid.
     *
     * @var array<string, string>
     */
    private const LEGACY_AREAS = [
        'nanotechnology' => 'Nanotechnology',
        'materials-science' => 'Materials Science',
        'polymers' => 'Polymers',
        'composites' => 'Composites',
        'functional-materials' => 'Functional Materials',
        'sustainable' => 'Sustainable Materials',
        'other' => 'Other',
    ];

    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->integer('position')->default(0);
            $table->timestamps();
        });

        $this->seedFromExistingData();
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }

    /**
     * Seed subjects already used by articles (most-used first) plus the
     * legacy submission-form areas, deduplicated by slug and name.
     */
    private function seedFromExistingData(): void
    {
        $seenSlugs = [];
        $seenNames = [];
        $rows = [];
        $position = 0;

        $articleSubjects = DB::table('articles')
            ->select('subject', DB::raw('count(*) as total'))
            ->whereNotNull('subject')
            ->where('subject', '!=', '')
            ->groupBy('subject')
            ->orderByDesc('total')
            ->pluck('subject');

        foreach ($articleSubjects as $name) {
            $slug = Str::slug($name);
            if ($slug === '' || isset($seenSlugs[$slug]) || isset($seenNames[$name])) {
                continue;
            }
            $seenSlugs[$slug] = true;
            $seenNames[$name] = true;
            $rows[] = ['name' => $name, 'slug' => $slug, 'is_active' => true, 'position' => $position++, 'created_at' => now(), 'updated_at' => now()];
        }

        foreach (self::LEGACY_AREAS as $slug => $name) {
            if (isset($seenSlugs[$slug]) || isset($seenNames[$name])) {
                continue;
            }
            $seenSlugs[$slug] = true;
            $seenNames[$name] = true;
            $rows[] = ['name' => $name, 'slug' => $slug, 'is_active' => true, 'position' => $position++, 'created_at' => now(), 'updated_at' => now()];
        }

        if ($rows !== []) {
            DB::table('subjects')->insert($rows);
        }
    }
};
