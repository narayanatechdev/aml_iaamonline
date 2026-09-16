<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ServiceClient;
use App\Models\Subject;
use App\Models\SustainableDevelopmentGoal;
use App\Services\IaamIdService;
use App\Services\ManuscriptSubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Manuscripts on behalf of a person identified only by IAAM ID — how the
 * IAAM Portal lets its members submit to and track AML without an AML login.
 * AML stays the owner: the paper goes through the same intake pipeline and
 * editorial workflow as one sent from AML's own form.
 */
class ServiceManuscriptController extends Controller
{
    public function __construct(
        private IaamIdService $iaamIds,
        private ManuscriptSubmissionService $submissions,
    ) {}

    /** What the submission form needs to offer: research areas, divisions, SDGs, TRL. */
    public function options(): JsonResponse
    {
        $subjects = Subject::activeOrdered()->get(['slug', 'name']);

        $categories = $subjects->isNotEmpty()
            ? $subjects->map(fn ($s) => ['value' => $s->slug, 'label' => $s->name])
            : collect(ManuscriptSubmissionService::LEGACY_CATEGORIES)
                ->map(fn ($slug) => ['value' => $slug, 'label' => Str::headline($slug)]);

        return response()->json(['data' => [
            'categories' => $categories->values(),
            'divisions' => ReferenceController::DIVISIONS,
            'sdgs' => SustainableDevelopmentGoal::orderBy('sdg_number')->get(['sdg_number', 'name'])
                ->map(fn ($g) => ['value' => $g->sdg_number, 'label' => $g->name])->values(),
            'trl_levels' => range(1, 9),
            'max_sdgs' => 5,
        ]]);
    }

    public function index(Request $request, string $iaamId): JsonResponse
    {
        if ($error = $this->invalidId($iaamId)) {
            return $error;
        }

        $manuscripts = Manuscript::ownedByIaamId($iaamId)->latest('submitted_at')->get();

        $countIn = fn (array $statuses) => $manuscripts->whereIn('status', $statuses)->count();

        $this->audit($request, 'service_fetch', "Listed manuscripts for {$iaamId}");

        return response()->json([
            'data' => $manuscripts->map(fn (Manuscript $m) => $this->summary($m))->values(),
            'stats' => [
                'total' => $manuscripts->count(),
                'in_progress' => $countIn(ManuscriptSubmissionService::STATUS_GROUPS['in_progress']),
                'awaiting_revision' => $countIn(ManuscriptSubmissionService::STATUS_GROUPS['awaiting_revision']),
                'decided' => $countIn(ManuscriptSubmissionService::STATUS_GROUPS['decided']),
            ],
        ]);
    }

    public function show(Request $request, string $iaamId, string $submissionId): JsonResponse
    {
        if ($error = $this->invalidId($iaamId)) {
            return $error;
        }

        $manuscript = $this->find($iaamId, $submissionId);

        if (! $manuscript) {
            return $this->notFound();
        }

        $manuscript->load(['files', 'reviews', 'sdgs']);

        $this->audit($request, 'service_fetch', "Fetched {$submissionId} for {$iaamId}", $manuscript);

        return response()->json(['data' => $this->detail($manuscript)]);
    }

    public function store(Request $request, string $iaamId): JsonResponse
    {
        if ($error = $this->invalidId($iaamId)) {
            return $error;
        }

        $validated = $request->validate($this->submissions->rules());

        $manuscript = $this->submissions->create($request, $validated, [
            'iaam_id' => $iaamId,
            'submitted_via' => 'portal',
        ], $this->clientLabel($request));

        return response()->json(['data' => $this->detail($manuscript->load(['files', 'reviews', 'sdgs']))], 201);
    }

    public function revise(Request $request, string $iaamId, string $submissionId): JsonResponse
    {
        if ($error = $this->invalidId($iaamId)) {
            return $error;
        }

        $manuscript = $this->find($iaamId, $submissionId);

        if (! $manuscript) {
            return $this->notFound();
        }

        if ($manuscript->status !== ManuscriptSubmissionService::AWAITING_REVISION) {
            return response()->json(['message' => 'This manuscript is not awaiting a revision.'], 422);
        }

        $request->validate($this->submissions->revisionRules());

        $this->submissions->revise($manuscript, $request, $manuscript->author_email, $this->clientLabel($request));

        return response()->json(['data' => $this->detail($manuscript->load(['files', 'reviews', 'sdgs']))]);
    }

    private function find(string $iaamId, string $submissionId): ?Manuscript
    {
        return Manuscript::ownedByIaamId($iaamId)->where('submission_id', $submissionId)->first();
    }

    private function summary(Manuscript $m): array
    {
        return [
            'submission_id' => $m->submission_id,
            'journal' => 'aml',
            'title' => $m->title,
            'category' => $m->category,
            'division' => $m->division,
            'status' => $m->status,
            'stage' => $this->stage($m->status),
            'revision_round' => (int) $m->revision_round,
            'submitted_via' => $m->submitted_via ?? 'aml',
            'submitted_at' => $m->submitted_at?->toIso8601String(),
            'decision_date' => $m->decision_date?->toIso8601String(),
            'published_at' => $m->published_at?->toIso8601String(),
            'doi' => $m->doi,
        ];
    }

    /**
     * What the author may see. Never editor-only notes, reviewer identities or
     * storage paths.
     */
    private function detail(Manuscript $m): array
    {
        return $this->summary($m) + [
            'authors' => $m->authors,
            'author_email' => $m->author_email,
            'author_affiliation' => $m->author_affiliation,
            'abstract' => $m->abstract,
            'keywords' => $m->keywords,
            'co_authors' => $m->co_authors ?? [],
            'cover_letter' => $m->cover_letter,
            'funding_information' => $m->funding_information,
            'acknowledgements' => $m->acknowledgements,
            'conflict_of_interest' => $m->conflict_of_interest,
            'data_availability' => $m->data_availability,
            'trl' => $m->trl,
            'sdgs' => $m->sdgs->map(fn ($g) => ['value' => $g->sdg_number, 'label' => $g->name])->values(),
            'final_decision' => $m->final_decision,
            'decision_notes' => in_array($m->status, ['revision_required', 'accepted', 'rejected', 'published'], true) ? $m->decision_notes : null,
            'revision_response' => $m->revision_response,
            'volume' => $m->volume,
            'issue' => $m->issue,
            'pages' => $m->pages,
            'files' => $m->files->map(fn ($f) => [
                'name' => $f->file_name,
                'category' => $f->file_type_category,
                'size' => $f->file_size,
                'uploaded_at' => optional($f->uploaded_at)->toIso8601String(),
            ])->values(),
            'reviews' => $this->submissions->reviewsForAuthor($m),
            'timeline' => $this->timeline($m),
        ];
    }

    private function stage(?string $status): string
    {
        foreach (ManuscriptSubmissionService::STATUS_GROUPS as $stage => $statuses) {
            if (in_array($status, $statuses, true)) {
                return $stage;
            }
        }

        return 'in_progress';
    }

    /** Milestones from the manuscript's own dates, plus the author's revisions. */
    private function timeline(Manuscript $m): array
    {
        $events = collect([
            ['event' => 'submitted', 'label' => 'Submitted', 'at' => $m->submitted_at],
            ['event' => 'editor_review_completed', 'label' => 'Editorial check completed', 'at' => $m->editor_review_completed_at],
            ['event' => 'peer_review_completed', 'label' => 'Peer review completed', 'at' => $m->peer_review_completed_at],
            ['event' => 'decision', 'label' => 'Decision: '.Str::headline((string) $m->final_decision), 'at' => $m->final_decision && $m->final_decision !== 'pending' ? $m->decision_date : null],
            ['event' => 'published', 'label' => 'Published', 'at' => $m->published_at],
        ]);

        AuditLog::where('manuscript_id', $m->id)
            ->where('action', 'file_uploaded')
            ->where('description', 'like', 'Revision R%')
            ->orderBy('created_at')
            ->get(['description', 'created_at'])
            ->each(function ($log) use ($events) {
                preg_match('/Revision (R\d+)/', $log->description, $r);
                $events->push(['event' => 'revision_submitted', 'label' => ($r[1] ?? 'Revision').' submitted', 'at' => $log->created_at]);
            });

        return $events
            ->filter(fn ($e) => $e['at'] !== null)
            ->sortBy('at')
            ->map(fn ($e) => ['event' => $e['event'], 'label' => $e['label'], 'at' => $e['at']->toIso8601String()])
            ->values()
            ->all();
    }

    private function invalidId(string $iaamId): ?JsonResponse
    {
        return $this->iaamIds->isValid($iaamId)
            ? null
            : response()->json(['message' => 'Malformed IAAM ID.'], 422);
    }

    private function notFound(): JsonResponse
    {
        return response()->json(['message' => 'No such manuscript for this IAAM ID.'], 404);
    }

    private function clientLabel(Request $request): string
    {
        /** @var ServiceClient|null $client */
        $client = $request->attributes->get('service_client');

        return 'service:'.($client?->name ?? 'unknown');
    }

    private function audit(Request $request, string $action, string $description, ?Manuscript $manuscript = null): void
    {
        AuditLog::create([
            'action' => $action,
            'actor_email' => $this->clientLabel($request),
            'actor_type' => 'service_client',
            'manuscript_id' => $manuscript?->id,
            'description' => $description,
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);
    }
}
