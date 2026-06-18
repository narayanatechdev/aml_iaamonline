<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleAuthor;
use App\Models\Author;
use App\Models\Manuscript;
use App\Models\User;
use App\Services\CitationFormatterService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::published();

        if ($search = $request->input('q')) {
            $query->search($search);
        }

        if ($volume = $request->input('volume')) {
            $query->where('volume', $volume);
            if ($issue = $request->input('issue')) {
                $query->where('issue', $issue);
            }
        }

        if ($year = $request->input('year')) {
            $query->byYear((int) $year);
        }

        if ($subject = $request->input('subject')) {
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where('subject', $like, "%{$subject}%");
        }

        if ($type = $request->input('type')) {
            $query->where('document_type', $type);
        }

        // Admin scope: only articles that came through this submission system
        // (linked to a manuscript), excluding the imported legacy archive.
        if ($request->boolean('from_submission')) {
            $query->whereNotNull('manuscript_id');
        }

        $sortBy = $request->input('sort', 'publish_date');
        $sortDir = $request->input('dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = min((int) $request->input('per_page', 20), 100);

        return response()->json($query->paginate($perPage));
    }

    public function show(string $id)
    {
        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->first();

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $article->load(['authors']);

        return response()->json($article);
    }

    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|min:2']);

        $results = Article::published()
            ->search($request->input('q'))
            ->orderBy('views_count', 'desc')
            ->limit(20)
            ->get(['id', 'legacy_id', 'title', 'doi', 'volume', 'issue', 'publish_year', 'views_count', 'document_type']);

        return response()->json(['results' => $results, 'count' => $results->count()]);
    }

    public function stats()
    {
        $total = Article::published()->count();
        $totalViews = Article::published()->sum('views_count');
        $totalDownloads = Article::published()->sum('pdf_downloads');
        $totalCitations = Article::published()->sum('cited_count');

        $byYear = Article::published()
            ->selectRaw('publish_year, count(*) as count')
            ->groupBy('publish_year')
            ->orderBy('publish_year', 'desc')
            ->pluck('count', 'publish_year');

        $bySubject = Article::published()
            ->selectRaw('subject, count(*) as count')
            ->groupBy('subject')
            ->orderBy('count', 'desc')
            ->pluck('count', 'subject');

        $byType = Article::published()
            ->selectRaw('document_type, count(*) as count')
            ->groupBy('document_type')
            ->orderBy('count', 'desc')
            ->pluck('count', 'document_type');

        return response()->json([
            'total' => $total,
            'total_views' => $totalViews,
            'total_downloads' => $totalDownloads,
            'total_citations' => $totalCitations,
            'total_authors' => Author::count(),
            'total_users' => User::count(),
            'total_manuscripts' => Manuscript::count(),
            'by_year' => $byYear,
            'by_subject' => $bySubject,
            'by_type' => $byType,
        ]);
    }

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
                    'name' => $articleAuthor->author->full_name,
                    'first_name' => $articleAuthor->author->first_name,
                    'last_name' => $articleAuthor->author->last_name,
                    'email' => $articleAuthor->author->email,
                    'orcid' => $articleAuthor->author->orcid,
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
            ->map(function ($authors) {
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

    public function citation(string $id, Request $request)
    {
        $validated = $request->validate([
            'format' => 'required|in:apa,mla,bibtex,ris,endonote',
        ]);

        $article = Article::published()->where('legacy_id', $id)->firstOrFail();

        try {
            $citation = CitationFormatterService::format($article, $validated['format']);

            return response()->json([
                'success' => true,
                'format' => $validated['format'],
                'citation' => $citation,
                'article_id' => $article->legacy_id,
                'article_title' => $article->title,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to generate citation: '.$e->getMessage(),
            ], 400);
        }
    }

    public function citationFormats()
    {
        return response()->json([
            'success' => true,
            'formats' => CitationFormatterService::getSupportedFormats(),
        ]);
    }
}
