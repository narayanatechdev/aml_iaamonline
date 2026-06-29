<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\DoiMetadataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    /**
     * Update integration identifiers for an article.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'doi_link' => 'nullable|url',
            'google_scholar_id' => 'nullable|string|max:255',
        ]);

        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->firstOrFail();

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Integration identifiers updated successfully.',
            'article' => $article->only(['legacy_id', 'doi_link', 'google_scholar_id']),
        ]);
    }

    /**
     * Fetch official DOI metadata from CrossRef and update the article.
     * Returns a clear status: 'synced' (new update), 'already_current' (no changes), or 'not_found'.
     */
    public function updateDoi(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'doi' => 'required|string',
        ]);

        $result = DoiMetadataService::fetch($validated['doi']);

        if (! $result['data']) {
            return response()->json([
                'success' => false,
                'status' => 'not_found',
                'message' => $result['error'] ?? 'DOI not found in CrossRef. It may not be registered yet.',
                'doi' => $validated['doi'],
            ], 404);
        }

        $metadata = $result['data'];
        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->firstOrFail();

        // Build incoming values for comparison
        $incomingTitle = $metadata['title'][0] ?? null;
        $incomingYear = $metadata['published']['date-parts'][0][0]
            ?? $metadata['published-print']['date-parts'][0][0]
            ?? $metadata['published-online']['date-parts'][0][0]
            ?? null;
        $incomingVolume = $metadata['volume'] ?? null;
        $incomingIssue = $metadata['issue'] ?? null;

        // Check if data is already current
        $isAlreadyCurrent =
            $article->title === $incomingTitle
            && strval($article->publish_year) === strval($incomingYear)
            && strval($article->volume) === strval($incomingVolume)
            && strval($article->issue) === strval($incomingIssue);

        if ($isAlreadyCurrent && $article->doi_synced_at !== null) {
            return response()->json([
                'success' => true,
                'status' => 'already_current',
                'message' => 'DOI metadata is already up-to-date.',
                'doi' => $validated['doi'],
                'doi_synced_at' => $article->doi_synced_at?->toIso8601String(),
                'article' => $article->fresh(),
            ]);
        }

        // Perform the sync
        $article->update([
            'title' => $incomingTitle ?? $article->title,
            'doi' => $metadata['DOI'] ?? $validated['doi'],
            'doi_link' => 'https://doi.org/'.($metadata['DOI'] ?? $validated['doi']),
            'publish_year' => $incomingYear ?? $article->publish_year,
            'volume' => $incomingVolume ?? $article->volume,
            'issue' => $incomingIssue ?? $article->issue,
            'doi_synced_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'status' => 'synced',
            'message' => 'DOI metadata synced successfully.',
            'doi' => $validated['doi'],
            'doi_synced_at' => $article->fresh()->doi_synced_at?->toIso8601String(),
            'article' => $article->fresh(),
        ]);
    }

    /**
     * Get the current DOI sync status for an article.
     */
    public function doiStatus(string $id): JsonResponse
    {
        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->firstOrFail();

        return response()->json([
            'success' => true,
            'doi' => $article->doi,
            'doi_link' => $article->doi_link,
            'doi_synced_at' => $article->doi_synced_at?->toIso8601String(),
            'title' => $article->title,
            'publish_year' => $article->publish_year,
        ]);
    }
}