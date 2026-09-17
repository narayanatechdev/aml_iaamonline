<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ServiceClient;
use App\Models\Subject;
use App\Models\SustainableDevelopmentGoal;
use App\Services\IaamIdService;
use App\Services\ManuscriptPresenter;
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
        private ManuscriptPresenter $presenter,
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
            'data' => $manuscripts->map(fn (Manuscript $m) => $this->presenter->summary($m))->values(),
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

        return response()->json(['data' => $this->presenter->detail($manuscript)]);
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

        return response()->json(['data' => $this->presenter->detail($manuscript->load(['files', 'reviews', 'sdgs']))], 201);
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

        if (ManuscriptSubmissionService::normalizeStatus($manuscript->status) !== ManuscriptSubmissionService::AWAITING_REVISION) {
            return response()->json(['message' => 'This manuscript is not awaiting a revision.'], 422);
        }

        $request->validate($this->submissions->revisionRules());

        $this->submissions->revise($manuscript, $request, $manuscript->author_email, $this->clientLabel($request));

        return response()->json(['data' => $this->presenter->detail($manuscript->load(['files', 'reviews', 'sdgs']))]);
    }

    private function find(string $iaamId, string $submissionId): ?Manuscript
    {
        return Manuscript::ownedByIaamId($iaamId)->where('submission_id', $submissionId)->first();
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
