<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeSectionController extends Controller
{
    /**
     * Block types the builder understands. The frontend registry mirrors this list.
     *
     * @var list<string>
     */
    private const BLOCK_TYPES = [
        'featured_hero',
        'featured_articles',
        'on_the_cover',
        'challenge_divisions',
        'announcements',
        'iaam_fellowship',
        'article_categories',
        'journal_info_header',
        'hero_section',
        'content_layout',
        'cta_section',
        'rich_text',
        'image_banner',
    ];

    /**
     * Public endpoint: visible blocks in display order, for rendering the homepage.
     */
    public function index(): JsonResponse
    {
        $sections = HomeSection::visibleOrdered()->get()->map(fn (HomeSection $s) => [
            'id' => $s->id,
            'block_type' => $s->block_type,
            'content' => $s->content ?? [],
        ]);

        return response()->json(['data' => $sections]);
    }

    /**
     * Admin endpoint: every block (visible or not) in order, for the builder.
     */
    public function adminIndex(): JsonResponse
    {
        $this->authorizeView();

        $sections = HomeSection::orderBy('position')->get()->map(fn (HomeSection $s) => $this->present($s));

        return response()->json([
            'data' => $sections,
            'meta' => ['block_types' => self::BLOCK_TYPES],
        ]);
    }

    /**
     * Create a new block, appended to the end of the layout.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'block_type' => ['required', 'string', 'in:'.implode(',', self::BLOCK_TYPES)],
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_visible' => ['sometimes', 'boolean'],
            'content' => ['sometimes', 'array'],
        ]);

        $section = HomeSection::create([
            'block_type' => $validated['block_type'],
            'name' => $validated['name'] ?? null,
            'is_visible' => $validated['is_visible'] ?? true,
            'content' => $validated['content'] ?? [],
            'position' => (int) HomeSection::max('position') + 1,
        ]);

        return response()->json(['data' => $this->present($section)], 201);
    }

    /**
     * Update a block's content, label, or visibility.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeManage();

        $section = HomeSection::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_visible' => ['sometimes', 'boolean'],
            'content' => ['sometimes', 'array'],
        ]);

        $section->fill($validated)->save();

        return response()->json(['data' => $this->present($section)]);
    }

    /**
     * Delete a block.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorizeManage();

        HomeSection::findOrFail($id)->delete();

        return response()->json(['message' => 'Section deleted.']);
    }

    /**
     * Persist a new block ordering.
     */
    public function reorder(Request $request): JsonResponse
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'order' => ['required', 'array', 'min:1'],
            'order.*' => ['integer', 'exists:home_sections,id'],
        ]);

        foreach ($validated['order'] as $position => $id) {
            HomeSection::where('id', $id)->update(['position' => $position]);
        }

        $sections = HomeSection::orderBy('position')->get()->map(fn (HomeSection $s) => $this->present($s));

        return response()->json(['data' => $sections]);
    }

    /**
     * Duplicate a block, inserting the copy directly after the original.
     */
    public function duplicate(int $id): JsonResponse
    {
        $this->authorizeManage();

        $original = HomeSection::findOrFail($id);

        // Push everything after the original down by one to make room.
        HomeSection::where('position', '>', $original->position)->increment('position');

        $copy = HomeSection::create([
            'block_type' => $original->block_type,
            'name' => $original->name ? $original->name.' (copy)' : null,
            'is_visible' => $original->is_visible,
            'content' => $original->content,
            'position' => $original->position + 1,
        ]);

        return response()->json(['data' => $this->present($copy)], 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(HomeSection $section): array
    {
        return [
            'id' => $section->id,
            'block_type' => $section->block_type,
            'name' => $section->name,
            'position' => $section->position,
            'is_visible' => $section->is_visible,
            'content' => $section->content ?? [],
            'updated_at' => $section->updated_at,
        ];
    }

    private function authorizeView(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasPermission('homepage:view')) {
            abort(403, 'Unauthorized. Homepage view permission required.');
        }
    }

    private function authorizeManage(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasPermission('homepage:manage')) {
            abort(403, 'Unauthorized. Homepage manage permission required.');
        }
    }
}
