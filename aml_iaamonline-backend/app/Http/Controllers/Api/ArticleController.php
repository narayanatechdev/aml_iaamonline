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
use Illuminate\Support\Facades\Cache;

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

        if ($request->boolean('from_submission')) {
            $query->whereNotNull('manuscript_id');
        }

        $sortColumns = [
            'title' => 'title',
            'year' => 'publish_year',
            'publish_year' => 'publish_year',
            'total_views' => 'views_count',
            'views_count' => 'views_count',
            'total_downloads' => 'pdf_downloads',
            'pdf_downloads' => 'pdf_downloads',
            'total_citations' => 'cited_count',
            'cited_count' => 'cited_count',
            'article_type' => 'document_type',
            'document_type' => 'document_type',
            'publish_date' => 'publish_date',
            'volume' => 'volume',
            'issue' => 'issue',
            'created_at' => 'created_at',
        ];

        $requestedSort = (string) $request->input('sort', 'publish_date');
        $sortBy = $sortColumns[$requestedSort] ?? 'publish_date';
        $sortDir = strtolower((string) $request->input('dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir)->orderBy('id', 'desc');

        $perPage = min(max((int) $request->input('per_page', 20), 1), 100);
        $articles = $query->paginate($perPage);
        $articles->getCollection()->transform(fn (Article $article) => $this->articleIndexResource($article));

        return response()->json($articles);
    }

    /**
     * @return array<string, mixed>
     */
    private function articleIndexResource(Article $article): array
    {
        return array_merge($article->toArray(), [
            'year' => $article->publish_year,
            'article_type' => $article->document_type,
            'total_views' => $article->views_count,
            'total_downloads' => $article->pdf_downloads,
            'total_citations' => $article->cited_count,
            'page_start' => $article->pages_from,
            'page_end' => $article->pages_to,
            'pages' => $article->pages,
        ]);
    }

    /**
     * Lightweight map of live media URLs for all published articles, keyed by
     * legacy id, so frontend pages can overlay admin edits onto their static
     * article snapshot without a rebuild.
     */
    public function mediaMap()
    {
        $media = Cache::remember('articles:media-map', 60, function () {
            return Article::published()
                ->whereNotNull('legacy_id')
                ->get(['legacy_id', 'graphical_abstract_url', 'pdf_url'])
                ->mapWithKeys(fn (Article $article) => [$article->legacy_id => [
                    'graphical_abstract_url' => $article->graphical_abstract_url,
                    'pdf_url' => $article->pdf_url,
                ]])
                ->all();
        });

        return response()->json(['media' => $media]);
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

        $totalWithDoi = Article::published()
            ->whereNotNull('doi')
            ->where('doi', '!=', '')
            ->count();
        $doiSynced = Article::published()
            ->whereNotNull('doi')
            ->where('doi', '!=', '')
            ->whereNotNull('doi_synced_at')
            ->count();

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
            // DOI sync stats
            'total_with_doi' => $totalWithDoi,
            'doi_synced' => $doiSynced,
            'doi_pending' => $totalWithDoi - $doiSynced,
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
