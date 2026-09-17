<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ManuscriptFile;
use App\Models\Notification;
use App\Models\ReviewAssignment;
use App\Models\Subject;
use App\Models\SustainableDevelopmentGoal;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * The one manuscript intake pipeline. AML's own submit form and the IAAM
 * Portal (via the service API) both go through here, so a paper is stored,
 * checked, notified and audited the same way whichever door it came in by.
 */
class ManuscriptSubmissionService
{
    public const AWAITING_REVISION = 'revision_required';

    /**
     * AML's admin and managing-editor screens write hyphenated statuses; the
     * editor workflow and author revisions use these underscored ones.
     *
     * @var array<string, string>
     */
    public const STATUS_ALIASES = [
        'editor-review' => 'with_editor',
        'under-review' => 'under_review',
        'revision-requested' => self::AWAITING_REVISION,
    ];

    public static function normalizeStatus(?string $status): ?string
    {
        return self::STATUS_ALIASES[$status] ?? $status;
    }

    /**
     * Statuses grouped for the author dashboard summary cards.
     *
     * @var array<string, list<string>>
     */
    public const STATUS_GROUPS = [
        'in_progress' => ['submitted', 'with_editor', 'under_review', 'decision', 'editor-review', 'under-review'],
        'awaiting_revision' => [self::AWAITING_REVISION, 'revision-requested'],
        'decided' => ['accepted', 'rejected', 'published'],
    ];

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:500',
            'authors' => 'required|string',
            'author_email' => 'required|email',
            'author_affiliation' => 'required|string',
            'abstract' => 'required|string|min:50|max:5000',
            'keywords' => 'required|string',
            'category' => ['required', Rule::in($this->allowedCategories())],
            'pdf' => 'required|file|mimes:pdf|max:52428800',
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png',
                'max:10240',
                function ($attribute, $value, $fail) {
                    $imageSize = getimagesize($value->getRealPath());

                    if (! $imageSize) {
                        $fail('Cover image must be a readable JPG or PNG image.');

                        return;
                    }

                    [$width, $height] = $imageSize;

                    if ($height === 0 || abs(($width / $height) - (16 / 9)) > 0.01) {
                        $fail('Cover image must use a 16:9 ratio.');
                    }
                },
            ],
            'graphical_abstract' => 'required|image|mimes:jpeg,jpg,png|max:5120',
            // Optional metadata
            'funding_information' => 'nullable|string|max:2000',
            'acknowledgements' => 'nullable|string|max:2000',
            'conflict_of_interest' => 'nullable|string|max:2000',
            'data_availability' => 'nullable|string|max:2000',
            'cover_letter' => 'required|string|max:5000',
            'co_authors' => 'nullable|json',
            'sdgs' => ['nullable', 'json', function ($attribute, $value, $fail) {
                $sdgs = json_decode($value, true);
                if (is_array($sdgs) && count($sdgs) > 5) {
                    $fail('You can select a maximum of 5 SDGs.');
                }
            }],
            'trl' => 'nullable|integer|min:1|max:9',
            'division' => 'nullable|string|max:255',
        ];
    }

    /**
     * Store a validated submission with its files.
     *
     * @param  array  $attributes  Extra manuscript columns, e.g. iaam_id / submitted_via.
     * @param  string|null  $via  Appended to the audit description, e.g. "service:IAAM Portal".
     */
    public function create(Request $request, array $validated, array $attributes = [], ?string $via = null): Manuscript
    {
        $submissionId = 'SUB-'.Str::random(12);

        $coAuthors = $request->filled('co_authors') ? json_decode($request->input('co_authors'), true) : null;

        $manuscript = Manuscript::create([
            'submission_id' => $submissionId,
            'title' => $validated['title'],
            'authors' => $validated['authors'],
            'author_email' => $validated['author_email'],
            'author_affiliation' => $validated['author_affiliation'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'],
            'category' => $validated['category'],
            'funding_information' => $validated['funding_information'] ?? null,
            'acknowledgements' => $validated['acknowledgements'] ?? null,
            'conflict_of_interest' => $validated['conflict_of_interest'] ?? null,
            'data_availability' => $validated['data_availability'] ?? null,
            'cover_letter' => $validated['cover_letter'] ?? null,
            'co_authors' => $coAuthors,
            'trl' => $validated['trl'] ?? null,
            'division' => $validated['division'] ?? null,
            'status' => 'submitted',
            'submitted_at' => now(),
        ] + $attributes);

        // Attach selected Sustainable Development Goals (by sdg_number)
        if ($request->filled('sdgs')) {
            $sdgNumbers = json_decode($request->input('sdgs'), true) ?? [];
            if (is_array($sdgNumbers) && count($sdgNumbers) > 0) {
                $sdgIds = SustainableDevelopmentGoal::whereIn('sdg_number', $sdgNumbers)->pluck('id');
                $manuscript->sdgs()->sync($sdgIds);
            }
        }

        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
            $fileName = $submissionId.'_manuscript.pdf';
            $filePath = $file->storeAs('manuscripts', $fileName, 'local');

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => 'pdf',
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'file_type_category' => 'manuscript',
                'uploaded_at' => now(),
            ]);

            $manuscript->update([
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
            ]);
        }

        // Required 16:9 cover image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $submissionId.'_image.'.$image->getClientOriginalExtension();
            $imagePath = $image->storeAs('manuscript-images', $imageName, 'public');

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $image->getClientOriginalName(),
                'file_path' => $imagePath,
                'file_type' => $image->getClientOriginalExtension(),
                'file_size' => $image->getSize(),
                'mime_type' => $image->getMimeType(),
                'file_type_category' => 'supplementary',
                'uploaded_at' => now(),
            ]);

            $manuscript->update([
                'author_image_url' => $imagePath,
                'author_image_mime_type' => $image->getMimeType(),
                'author_image_size' => $image->getSize(),
            ]);
        }

        // Graphical abstract
        if ($request->hasFile('graphical_abstract')) {
            $ga = $request->file('graphical_abstract');
            $gaName = $submissionId.'_ga.'.$ga->getClientOriginalExtension();
            $gaPath = $ga->storeAs('graphical-abstracts', $gaName, 'public');

            $manuscript->update([
                'graphical_abstract_path' => $gaPath,
            ]);

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $ga->getClientOriginalName(),
                'file_path' => $gaPath,
                'file_type' => $ga->getClientOriginalExtension(),
                'file_size' => $ga->getSize(),
                'mime_type' => $ga->getMimeType(),
                'file_type_category' => 'supplementary',
                'uploaded_at' => now(),
            ]);
        }

        // Similarity check (scaffold — returns null/pending until a provider is configured)
        if ($manuscript->file_path) {
            $manuscript->update(['similarity_score' => SimilarityCheckService::check($manuscript->file_path)]);
        }

        // In-app notification to the author
        Notification::add(
            $manuscript->author_email,
            'submission_received',
            'Manuscript received',
            'Your submission "'.$manuscript->title.'" ('.$submissionId.') has been received.',
            '/dashboard'
        );

        AuditLog::create([
            'action' => 'submission_created',
            'actor_email' => $validated['author_email'],
            'actor_type' => 'author',
            'manuscript_id' => $manuscript->id,
            'description' => 'New manuscript submission: '.$validated['title'].($via ? " (via {$via})" : ''),
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return $manuscript;
    }

    public function revisionRules(): array
    {
        return [
            'response' => 'required|string|min:10|max:10000',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:pdf|max:52428800',
        ];
    }

    /**
     * Submit a revision: response to reviewers + revised files. Increments the
     * round, re-attaches files, returns the manuscript to under review and
     * resets reviewer assignments for another look. The caller checks the
     * manuscript is awaiting a revision and validates revisionRules() first.
     */
    public function revise(Manuscript $manuscript, Request $request, string $actorEmail, ?string $via = null): Manuscript
    {
        $round = (int) $manuscript->revision_round + 1;

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $i => $file) {
                $name = $manuscript->submission_id."_R{$round}_".($i + 1).'.pdf';
                $path = $file->storeAs('manuscripts', $name, 'local');
                ManuscriptFile::create([
                    'manuscript_id' => $manuscript->id,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_type' => 'pdf',
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'file_type_category' => 'revision',
                    'uploaded_at' => now(),
                ]);
            }
        }

        // Reset reviewers for a fresh look
        ReviewAssignment::where('manuscript_id', $manuscript->id)->delete();

        $manuscript->update([
            'revision_round' => $round,
            'revision_response' => $request->input('response'),
            'status' => 'under_review',
        ]);

        AuditLog::create([
            'action' => 'file_uploaded',
            'actor_email' => $actorEmail,
            'actor_type' => 'author',
            'manuscript_id' => $manuscript->id,
            'description' => "Revision R{$round} submitted for manuscript: ".$manuscript->submission_id.($via ? " (via {$via})" : ''),
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return $manuscript;
    }

    /**
     * Reviews as an author may see them. Blind review: authors never see
     * reviewer identities or confidential (editor-only) comments.
     * Reviewers are anonymised as "Reviewer N".
     */
    public function reviewsForAuthor(Manuscript $manuscript): array
    {
        return $manuscript->reviews
            ->where('is_submitted', true)
            ->values()
            ->map(fn ($r, $i) => [
                'reviewer' => 'Reviewer '.($i + 1),
                'recommendation' => $r->recommendation,
                'strengths' => $r->strengths,
                'weaknesses' => $r->weaknesses,
                'comments' => $r->comments,            // comments to author only
                'questions' => $r->questions,
            ])
            ->all();
    }

    /**
     * Research-area slugs accepted for submission: active admin-managed
     * subjects, plus the legacy hardcoded areas so older clients keep working.
     *
     * @return list<string>
     */
    public function allowedCategories(): array
    {
        return Subject::where('is_active', true)
            ->pluck('slug')
            ->merge(self::LEGACY_CATEGORIES)
            ->unique()
            ->values()
            ->all();
    }

    public const LEGACY_CATEGORIES = ['nanotechnology', 'materials-science', 'polymers', 'composites', 'functional-materials', 'sustainable', 'other'];
}
