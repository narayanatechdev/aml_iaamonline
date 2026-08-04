<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Admin-managed site pages (About the Journal, policies, etc.) that can be
 * linked from the header navigation or the footer — per the Editor-in-Chief's
 * request to edit journal pages and choose header/footer placement from the
 * content dashboard.
 */
class PageController extends Controller
{
    /** Public: published pages for a menu placement (header or footer). */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'placement' => ['sometimes', Rule::in(['header', 'footer'])],
        ]);

        $query = Page::published()->orderBy('position')->orderBy('title');

        if (isset($validated['placement'])) {
            $query->placement($validated['placement']);
        } else {
            $query->whereIn('placement', ['header', 'footer']);
        }

        $pages = $query->get(['id', 'title', 'slug', 'placement', 'position']);

        return response()->json(['data' => $pages]);
    }

    /** Public: a single published page by slug. */
    public function show(string $slug): JsonResponse
    {
        $page = Page::published()->where('slug', $slug)->first();

        if (! $page) {
            return response()->json(['message' => 'Page not found.'], 404);
        }

        return response()->json(['data' => $page]);
    }

    /** Admin: all pages including drafts. */
    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorizeView($request);

        $pages = Page::orderBy('placement')->orderBy('position')->orderBy('title')->get();

        return response()->json(['data' => $pages]);
    }

    /** Admin: single page (draft or published) for editing. */
    public function adminShow(Request $request, int $id): JsonResponse
    {
        $this->authorizeView($request);

        return response()->json(['data' => Page::findOrFail($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage($request);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'nullable', 'string'],
            'placement' => ['sometimes', Rule::in(Page::PLACEMENTS)],
            'position' => ['sometimes', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        $slug = Str::slug($validated['slug'] ?? $validated['title']);

        if ($slug === '' || Page::where('slug', $slug)->exists()) {
            return response()->json(['message' => 'A page with an equivalent slug already exists.'], 422);
        }

        $page = Page::create([
            'title' => trim($validated['title']),
            'slug' => $slug,
            'content' => $validated['content'] ?? '',
            'placement' => $validated['placement'] ?? 'none',
            'position' => $validated['position'] ?? ((int) Page::max('position') + 1),
            'is_published' => $validated['is_published'] ?? false,
        ]);

        return response()->json(['data' => $page], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeManage($request);

        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'nullable', 'string'],
            'placement' => ['sometimes', Rule::in(Page::PLACEMENTS)],
            'position' => ['sometimes', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('slug', $validated)) {
            $slug = Str::slug($validated['slug']);
            if ($slug === '' || Page::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
                return response()->json(['message' => 'A page with an equivalent slug already exists.'], 422);
            }
            $validated['slug'] = $slug;
        }

        if (array_key_exists('title', $validated)) {
            $validated['title'] = trim($validated['title']);
        }

        $page->update($validated);

        return response()->json(['data' => $page->fresh()]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->authorizeManage($request);

        Page::findOrFail($id)->delete();

        return response()->json(['message' => 'Page deleted.']);
    }

    private function authorizeView(Request $request): void
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('homepage:view'), 403, 'Not authorized.');
    }

    private function authorizeManage(Request $request): void
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('homepage:manage'), 403, 'Not authorized.');
    }
}
