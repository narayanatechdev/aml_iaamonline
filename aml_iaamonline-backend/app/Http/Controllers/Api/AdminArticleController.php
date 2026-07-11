<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminArticleController extends Controller
{
    /**
     * Show a single article (with authors) for editing.
     */
    public function show(string $id): JsonResponse
    {
        $this->authorizeView();

        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->first();

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->load('authors');

        return response()->json(['data' => $article]);
    }

    /**
     * Update an article's full record (scalar fields).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->authorizeEdit();

        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->first();

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:1000'],
            'document_type' => ['sometimes', 'nullable', 'string', 'max:100'],
            'subject' => ['sometimes', 'nullable', 'string', 'max:255'],
            'abstract' => ['sometimes', 'nullable', 'string'],
            'keywords' => ['sometimes', 'nullable', 'string'],
            'doi' => ['sometimes', 'nullable', 'string', 'max:255'],
            'doi_link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'google_scholar_id' => ['sometimes', 'nullable', 'string', 'max:255'],
            'volume' => ['sometimes', 'nullable', 'string', 'max:50'],
            'issue' => ['sometimes', 'nullable', 'string', 'max:50'],
            'pages_from' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'pages_to' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'language' => ['sometimes', 'nullable', 'string', 'max:10'],
            'status' => ['sometimes', 'string', 'in:published,draft,in_production,retracted'],
            'pdf_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'original_pdf_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'graphical_abstract_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'article_link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'corresponding_author' => ['sometimes', 'nullable', 'string', 'max:255'],
            'receive_date' => ['sometimes', 'nullable', 'date'],
            'revise_date' => ['sometimes', 'nullable', 'date'],
            'accept_date' => ['sometimes', 'nullable', 'date'],
            'publish_date' => ['sometimes', 'nullable', 'date'],
            'publish_year' => ['sometimes', 'nullable', 'integer', 'min:1900', 'max:2200'],
            'publish_month' => ['sometimes', 'nullable', 'string', 'max:20'],
            'acknowledgements' => ['sometimes', 'nullable', 'string'],
            'funding_information' => ['sometimes', 'nullable', 'string'],
            'conflict_of_interest' => ['sometimes', 'nullable', 'string'],
            'data_availability' => ['sometimes', 'nullable', 'string'],
            'views_count' => ['sometimes', 'integer', 'min:0'],
            'pdf_downloads' => ['sometimes', 'integer', 'min:0'],
            'cited_count' => ['sometimes', 'integer', 'min:0'],
        ]);

        $article->fill($validated)->save();
        $article->load('authors');

        return response()->json(['data' => $article, 'message' => 'Article updated.']);
    }

    /**
     * Upload a graphical-abstract image, store it, and set it on the article.
     */
    public function uploadGraphicalAbstract(Request $request, string $id): JsonResponse
    {
        $this->authorizeEdit();

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->first();

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $path = $request->file('image')->store('article-graphical-abstracts', 'public');
        $url = Storage::disk('public')->url($path);

        $article->update(['graphical_abstract_url' => $url]);

        return response()->json([
            'data' => ['graphical_abstract_url' => $url],
            'message' => 'Graphical abstract uploaded.',
        ]);
    }

    private function authorizeView(): void
    {
        $user = auth()->user();

        if (! $user || ! ($user->hasPermission('article:view') || $user->hasPermission('article:edit'))) {
            abort(403, 'Unauthorized. Article view permission required.');
        }
    }

    private function authorizeEdit(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasPermission('article:edit')) {
            abort(403, 'Unauthorized. Article edit permission required.');
        }
    }
}
