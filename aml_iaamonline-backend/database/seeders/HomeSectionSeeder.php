<?php

namespace Database\Seeders;

use App\Models\HomeSection;
use Illuminate\Database\Seeder;

class HomeSectionSeeder extends Seeder
{
    /**
     * Seed the default homepage layout, mirroring the previously hard-coded
     * section order so the dynamic homepage renders identically out of the box.
     */
    public function run(): void
    {
        $blocks = [
            ['block_type' => 'featured_hero', 'name' => 'Featured Article (Hero)', 'content' => []],
            ['block_type' => 'featured_articles', 'name' => 'Featured Articles', 'content' => ['heading' => 'Featured Articles']],
            ['block_type' => 'on_the_cover', 'name' => 'On the Cover', 'content' => []],
            ['block_type' => 'challenge_divisions', 'name' => 'Challenge Divisions', 'content' => []],
            ['block_type' => 'announcements', 'name' => 'Announcements', 'content' => ['heading' => 'Announcements']],
            ['block_type' => 'iaam_fellowship', 'name' => 'IAAM Fellowship', 'content' => []],
            ['block_type' => 'article_categories', 'name' => 'Article Categories', 'content' => []],
            ['block_type' => 'journal_info_header', 'name' => 'Journal Info Header', 'content' => []],
            ['block_type' => 'hero_section', 'name' => 'Hero Section', 'content' => []],
            ['block_type' => 'content_layout', 'name' => 'Content Layout', 'content' => []],
            ['block_type' => 'cta_section', 'name' => 'Call To Action', 'content' => []],
        ];

        foreach ($blocks as $position => $block) {
            HomeSection::firstOrCreate(
                ['block_type' => $block['block_type'], 'position' => $position],
                [
                    'name' => $block['name'],
                    'is_visible' => true,
                    'content' => $block['content'],
                ]
            );
        }
    }
}
