<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticleAuthor;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function getAuthorsWithAffiliations(string $articleId)
    {
        $authors = ArticleAuthor::where('article_id', $articleId)
            ->with(['author', 'affiliation'])
            ->orderBy('position')
            ->get();

        return response()->json([
            'article_id' => $articleId,
            'authors' => $authors->map(function ($articleAuthor) {
                return [
                    'id' => $articleAuthor->author->id,
                    'name' => $articleAuthor->author->name,
                    'email' => $articleAuthor->author->email,
                    'position' => $articleAuthor->position,
                    'is_corresponding' => $articleAuthor->is_corresponding,
                    'affiliation' => $articleAuthor->affiliation ? [
                        'id' => $articleAuthor->affiliation->id,
                        'name' => $articleAuthor->affiliation->name,
                        'country' => $articleAuthor->affiliation->country,
                        'city' => $articleAuthor->affiliation->city,
                        'department' => $articleAuthor->affiliation->department,
                        'full_address' => $articleAuthor->affiliation->full_address,
                    ] : null,
                    'affiliation_text' => $articleAuthor->affiliation_text,
                ];
            })->toArray(),
            'total_authors' => $authors->count(),
        ]);
    }

    public function getAffiliations(string $articleId)
    {
        $articleAuthors = ArticleAuthor::where('article_id', $articleId)
            ->with('affiliation')
            ->whereNotNull('affiliation_id')
            ->get();

        $affiliations = $articleAuthors->groupBy('affiliation_id')
            ->map(function ($authors, $affiliationId) {
                $affiliation = $authors->first()->affiliation;
                return [
                    'id' => $affiliation->id,
                    'name' => $affiliation->name,
                    'country' => $affiliation->country,
                    'city' => $affiliation->city,
                    'department' => $affiliation->department,
                    'full_address' => $affiliation->full_address,
                    'author_count' => $authors->count(),
                ];
            })
            ->values();

        return response()->json([
            'article_id' => $articleId,
            'affiliations' => $affiliations->toArray(),
            'total_affiliations' => $affiliations->count(),
        ]);
    }
}
