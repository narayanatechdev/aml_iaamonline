<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Manuscript;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    /**
     * Public endpoint: active subjects for submission forms and browse pages.
     */
    public function index(): JsonResponse
    {
        $articleCounts = Article::published()
            ->select('subject', DB::raw('count(*) as total'))
            ->groupBy('subject')
            ->pluck('total', 'subject');

        $subjects = Subject::activeOrdered()->get()->map(fn (Subject $s) => [
            'id' => $s->id,
            'name' => $s->name,
            'slug' => $s->slug,
            'articles_count' => (int) ($articleCounts[$s->name] ?? 0),
        ]);

        return response()->json(['data' => $subjects]);
    }

    /**
     * Admin endpoint: every subject (active or not) with usage counts.
     */
    public function adminIndex(): JsonResponse
    {
        $this->authorizeView();

        $articleCounts = Article::query()
            ->select('subject', DB::raw('count(*) as total'))
            ->groupBy('subject')
            ->pluck('total', 'subject');

        $manuscriptCounts = Manuscript::query()
            ->select('category', DB::raw('count(*) as total'))
            ->groupBy('category')
            ->pluck('total', 'category');

        $subjects = Subject::orderBy('position')->orderBy('name')->get()
            ->map(fn (Subject $s) => $this->present($s, $articleCounts, $manuscriptCounts));

        return response()->json(['data' => $subjects]);
    }

    /**
     * Create a new subject, appended to the end of the list.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:subjects,name'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $name = trim($validated['name']);
        $slug = Str::slug($name);

        if ($slug === '' || Subject::where('slug', $slug)->exists()) {
            return response()->json([
                'message' => 'A subject with an equivalent name already exists.',
            ], 422);
        }

        $subject = Subject::create([
            'name' => $name,
            'slug' => $slug,
            'is_active' => $validated['is_active'] ?? true,
            'position' => (int) Subject::max('position') + 1,
        ]);

        return response()->json(['data' => $this->present($subject)], 201);
    }

    /**
     * Rename, activate/deactivate, or reposition a subject. Renames are
     * propagated to articles so the browse pages and dashboard graphs
     * keep grouping correctly.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $this->authorizeManage();

        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('subjects', 'name')->ignore($subject->id)],
            'is_active' => ['sometimes', 'boolean'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (array_key_exists('name', $validated)) {
            $newName = trim($validated['name']);
            if ($newName !== '' && $newName !== $subject->name) {
                Article::where('subject', $subject->name)->update(['subject' => $newName]);
                $subject->name = $newName;
            }
        }

        if (array_key_exists('is_active', $validated)) {
            $subject->is_active = $validated['is_active'];
        }

        if (array_key_exists('position', $validated)) {
            $subject->position = $validated['position'];
        }

        $subject->save();

        return response()->json(['data' => $this->present($subject)]);
    }

    /**
     * Delete a subject that is not referenced by any article or manuscript.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorizeManage();

        $subject = Subject::findOrFail($id);

        $articleCount = Article::where('subject', $subject->name)->count();
        $manuscriptCount = Manuscript::where('category', $subject->slug)->count();

        if ($articleCount > 0 || $manuscriptCount > 0) {
            return response()->json([
                'message' => "Cannot delete: {$articleCount} article(s) and {$manuscriptCount} manuscript(s) use this subject. Deactivate it instead.",
            ], 422);
        }

        $subject->delete();

        return response()->json(['message' => 'Subject deleted.']);
    }

    /**
     * @param  \Illuminate\Support\Collection<string, int>|null  $articleCounts
     * @param  \Illuminate\Support\Collection<string, int>|null  $manuscriptCounts
     * @return array<string, mixed>
     */
    private function present(Subject $subject, $articleCounts = null, $manuscriptCounts = null): array
    {
        return [
            'id' => $subject->id,
            'name' => $subject->name,
            'slug' => $subject->slug,
            'is_active' => $subject->is_active,
            'position' => $subject->position,
            'articles_count' => $articleCounts !== null
                ? (int) ($articleCounts[$subject->name] ?? 0)
                : Article::where('subject', $subject->name)->count(),
            'manuscripts_count' => $manuscriptCounts !== null
                ? (int) ($manuscriptCounts[$subject->slug] ?? 0)
                : Manuscript::where('category', $subject->slug)->count(),
        ];
    }

    private function authorizeView(): void
    {
        $user = request()->user();

        if (! $user || ! $user->hasPermission('settings:view')) {
            abort(403, 'Unauthorized. Settings view permission required.');
        }
    }

    private function authorizeManage(): void
    {
        $user = request()->user();

        if (! $user || ! $user->hasPermission('settings:edit')) {
            abort(403, 'Unauthorized. Settings edit permission required.');
        }
    }
}
