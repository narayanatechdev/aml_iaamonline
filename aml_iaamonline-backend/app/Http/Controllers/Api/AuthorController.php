<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Manuscript;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $query = \DB::table('authors')
            ->leftJoin('article_authors', 'authors.id', '=', 'article_authors.author_id')
            ->leftJoin('affiliations', 'article_authors.affiliation_id', '=', 'affiliations.id')
            ->select([
                'authors.id',
                'authors.name',
                'authors.email',
                'authors.orcid',
                'authors.article_count',
                \DB::raw('COALESCE(affiliations.name, authors.affiliation) as affiliation'),
                'affiliations.country',
                'affiliations.city',
                'affiliations.department',
            ])
            ->groupBy('authors.id', 'authors.name', 'authors.email', 'authors.orcid', 'authors.article_count', 'affiliations.name', 'authors.affiliation', 'affiliations.country', 'affiliations.city', 'affiliations.department');

        // Apply filters
        if ($request->filled('search')) {
            $query->where('authors.name', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('affiliation')) {
            $query->where(function ($q) use ($request) {
                $q->where('affiliations.name', $request->affiliation)
                    ->orWhere('authors.affiliation', $request->affiliation);
            });
        }

        if ($request->filled('country')) {
            $query->where('affiliations.country', $request->country);
        }

        if ($request->filled('city')) {
            $query->where('affiliations.city', $request->city);
        }

        // Admin scope: only authors linked to a platform user account,
        // excluding bibliographic-only records from the imported archive.
        if ($request->boolean('linked')) {
            $query->whereNotNull('authors.user_id');
        }

        // Get authors with pagination
        $perPage = $request->get('per_page', 100);
        $page = $request->get('page', 1);
        $offset = ($page - 1) * $perPage;

        $total = $query->count();
        $authors = $query->orderBy('authors.name')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        return response()->json([
            'data' => $authors,
            'meta' => [
                'current_page' => $page,
                'total' => $total,
                'per_page' => $perPage,
                'last_page' => ceil($total / $perPage),
                'affiliations' => \DB::table('affiliations')
                    ->select('name', 'country', 'city')
                    ->where('name', '!=', 'Research Institution')
                    ->distinct()
                    ->orderBy('name')
                    ->get(),
                'countries' => \DB::table('affiliations')
                    ->whereNotNull('country')
                    ->where('country', '!=', '')
                    ->distinct()
                    ->pluck('country')
                    ->sort()
                    ->values(),
                'cities' => \DB::table('affiliations')
                    ->whereNotNull('city')
                    ->where('city', '!=', '')
                    ->distinct()
                    ->pluck('city')
                    ->sort()
                    ->values(),
            ],
        ]);
    }

    public function show(Author $author)
    {
        // The author's published articles (public bibliographic data)
        $articles = $author->articles()
            ->select([
                'articles.id',
                'articles.title',
                'articles.document_type',
                'articles.subject',
                'articles.doi',
                'articles.volume',
                'articles.issue',
                'articles.pages_from',
                'articles.pages_to',
                'articles.publish_year',
                'articles.views_count',
                'articles.pdf_downloads',
                'articles.cited_count',
            ])
            ->orderByDesc('articles.publish_year')
            ->get();

        $payload = [
            'author' => $author,
            'articles' => $articles,
            'metrics' => [
                'article_count' => $articles->count(),
                'total_views' => (int) $articles->sum('views_count'),
                'total_downloads' => (int) $articles->sum('pdf_downloads'),
                'total_citations' => (int) $articles->sum('cited_count'),
            ],
        ];

        // Submission tracking is staff-only — include only for an authenticated
        // admin or editor (token sent via Sanctum).
        $viewer = Auth::guard('sanctum')->user();
        if ($author->email && $viewer && $viewer->hasAnyRole(['admin', 'editor', 'managing-editor'])) {
            $payload['submissions'] = Manuscript::where('author_email', $author->email)
                ->latest('submitted_at')
                ->get(['id', 'submission_id', 'title', 'category', 'status', 'submitted_at']);
        }

        return response()->json($payload);
    }
}
