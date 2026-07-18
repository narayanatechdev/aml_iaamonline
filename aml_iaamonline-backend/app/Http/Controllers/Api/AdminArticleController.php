<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
     * Create a new article record (uploaded manually by an admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeEdit();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:1000'],
            'document_type' => ['sometimes', 'nullable', 'string', 'max:100'],
            'subject' => ['sometimes', 'nullable', 'string', 'max:255'],
            'division' => ['sometimes', 'nullable', 'string', 'max:255'],
            'abstract' => ['sometimes', 'nullable', 'string'],
            'keywords' => ['sometimes', 'nullable', 'string'],
            'doi' => ['sometimes', 'nullable', 'string', 'max:255'],
            'doi_link' => ['sometimes', 'nullable', 'string', 'max:500'],
            'volume' => ['sometimes', 'nullable', 'string', 'max:50'],
            'issue' => ['sometimes', 'nullable', 'string', 'max:50'],
            'pages_from' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'pages_to' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'string', 'in:published,draft,in_production,retracted'],
            'pdf_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'corresponding_author' => ['sometimes', 'nullable', 'string', 'max:255'],
            'publish_date' => ['sometimes', 'nullable', 'date'],
            'publish_year' => ['sometimes', 'nullable', 'integer', 'min:1900', 'max:2200'],
            'publish_month' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        // volume and issue are NOT NULL in the schema but optional here.
        $article = Article::create(array_merge($validated, [
            'status' => $validated['status'] ?? 'published',
            'legacy_id' => $this->nextLegacyId(),
            'volume' => $validated['volume'] ?? '',
            'issue' => $validated['issue'] ?? '',
        ]));
        Cache::forget('articles:media-map');

        return response()->json(['data' => $article, 'message' => 'Article created.'], 201);
    }

    /**
     * Bulk-create articles from an uploaded CSV or XML file.
     *
     * CSV: first row is a header; XML: <articles><article><title>… elements.
     * Recognised fields (case-insensitive): title (required), document_type/type,
     * subject, division, abstract, keywords, doi, volume, issue, pages_from,
     * pages_to, publish_year/year, publish_month, publish_date, pdf_url,
     * corresponding_author. Rows without a division fall back to the request's
     * default_division, if given. Valid rows are created even when other rows
     * fail; failures are reported per row.
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $this->authorizeEdit();

        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xml', 'max:10240'],
            'default_division' => ['sometimes', 'nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $defaultDivision = trim((string) $request->input('default_division', ''));

        $rows = strtolower((string) $file->getClientOriginalExtension()) === 'xml'
            ? $this->rowsFromXml($file->getContent())
            : $this->rowsFromCsv($file->getRealPath());

        if ($rows === null) {
            return response()->json(['error' => 'The file could not be parsed.'], 422);
        }

        if (count($rows) === 0) {
            return response()->json(['error' => 'No article rows found in the file.'], 422);
        }

        if (count($rows) > 1000) {
            return response()->json(['error' => 'Too many rows — the limit is 1000 per upload.'], 422);
        }

        $nextLegacy = (int) $this->nextLegacyId();
        $created = 0;
        $errors = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 1;

            if (($row['title'] ?? '') === '') {
                $errors[] = "Row {$rowNumber}: missing title.";

                continue;
            }

            if (($row['division'] ?? '') === '' && $defaultDivision !== '') {
                $row['division'] = $defaultDivision;
            }

            if (isset($row['publish_year']) && ! ctype_digit($row['publish_year'])) {
                $errors[] = "Row {$rowNumber}: publish_year is not a number.";

                continue;
            }

            try {
                Article::create(array_merge($row, [
                    'status' => 'published',
                    'legacy_id' => (string) $nextLegacy,
                    'volume' => $row['volume'] ?? '',
                    'issue' => $row['issue'] ?? '',
                ]));
                $nextLegacy++;
                $created++;
            } catch (\Throwable $e) {
                $errors[] = "Row {$rowNumber}: ".(str_contains($e->getMessage(), 'articles_doi_unique')
                    ? 'an article with this DOI already exists.'
                    : Str::limit($e->getMessage(), 200));
            }
        }

        if ($created > 0) {
            Cache::forget('articles:media-map');
        }

        return response()->json([
            'data' => [
                'total_rows' => count($rows),
                'created' => $created,
                'failed' => count($errors),
                'errors' => array_slice($errors, 0, 25),
            ],
            'message' => "{$created} article(s) created.",
        ]);
    }

    /** Field names accepted from bulk files, with aliases. */
    private const BULK_FIELDS = [
        'title' => 'title',
        'document_type' => 'document_type',
        'type' => 'document_type',
        'subject' => 'subject',
        'division' => 'division',
        'abstract' => 'abstract',
        'keywords' => 'keywords',
        'doi' => 'doi',
        'volume' => 'volume',
        'issue' => 'issue',
        'pages_from' => 'pages_from',
        'pages_to' => 'pages_to',
        'publish_year' => 'publish_year',
        'year' => 'publish_year',
        'publish_month' => 'publish_month',
        'publish_date' => 'publish_date',
        'pdf_url' => 'pdf_url',
        'corresponding_author' => 'corresponding_author',
    ];

    /**
     * @return list<array<string, string>>|null
     */
    private function rowsFromCsv(string $path): ?array
    {
        $handle = fopen($path, 'r');

        if ($handle === false) {
            return null;
        }

        $header = fgetcsv($handle, null, ',', '"', '');

        if ($header === false) {
            fclose($handle);

            return null;
        }

        // Map each column index to a known field (BOM-stripped, case-insensitive).
        $columns = [];
        foreach ($header as $i => $name) {
            $key = strtolower(trim(str_replace("\u{FEFF}", '', (string) $name)));
            if (isset(self::BULK_FIELDS[$key])) {
                $columns[$i] = self::BULK_FIELDS[$key];
            }
        }

        if (! in_array('title', $columns, true)) {
            fclose($handle);

            return null;
        }

        $rows = [];
        while (($line = fgetcsv($handle, null, ',', '"', '')) !== false) {
            if (count(array_filter($line, fn ($v) => trim((string) $v) !== '')) === 0) {
                continue;
            }
            $row = [];
            foreach ($columns as $i => $field) {
                $value = trim((string) ($line[$i] ?? ''));
                if ($value !== '') {
                    $row[$field] = $value;
                }
            }
            $rows[] = $row;
        }
        fclose($handle);

        return $rows;
    }

    /**
     * @return list<array<string, string>>|null
     */
    private function rowsFromXml(string $content): ?array
    {
        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($content);

        if ($xml === false) {
            return null;
        }

        $articles = isset($xml->article) ? $xml->article : $xml->children();
        $rows = [];

        foreach ($articles as $node) {
            $row = [];
            foreach ($node->children() as $child) {
                $key = strtolower(trim($child->getName()));
                $value = trim((string) $child);
                if (isset(self::BULK_FIELDS[$key]) && $value !== '') {
                    $row[self::BULK_FIELDS[$key]] = $value;
                }
            }
            if ($row !== []) {
                $rows[] = $row;
            }
        }

        return $rows;
    }

    /**
     * Next numeric legacy id, so admin-created articles fit the existing
     * public URL scheme (/article/{legacy_id}).
     */
    private function nextLegacyId(): string
    {
        $max = (int) Article::whereRaw("legacy_id ~ '^[0-9]+$'")
            ->selectRaw('max(legacy_id::int) as m')
            ->value('m');

        return (string) ($max + 1);
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
            'division' => ['sometimes', 'nullable', 'string', 'max:255'],
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
        Cache::forget('articles:media-map');
        $article->load('authors');

        return response()->json(['data' => $article, 'message' => 'Article updated.']);
    }

    /**
     * Upload an article PDF, store it, and set it as the article's pdf_url.
     */
    public function uploadPdf(Request $request, string $id): JsonResponse
    {
        $this->authorizeEdit();

        $request->validate([
            'pdf' => ['required', 'file', 'mimes:pdf', 'max:30720'],
        ]);

        $article = Article::where('legacy_id', $id)->orWhere('id', $id)->first();

        if (! $article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        $path = $request->file('pdf')->store('article-pdfs', 'public');
        $url = Storage::disk('public')->url($path);

        $article->update([
            'pdf_url' => $url,
            'file_name' => $request->file('pdf')->getClientOriginalName(),
        ]);
        Cache::forget('articles:media-map');

        return response()->json([
            'data' => ['pdf_url' => $url],
            'message' => 'PDF uploaded.',
        ]);
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
        Cache::forget('articles:media-map');

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
