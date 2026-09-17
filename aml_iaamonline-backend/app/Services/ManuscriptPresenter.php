<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Manuscript;
use Illuminate\Support\Str;

/**
 * How a manuscript is described to other IAAM systems. detail() is the
 * author's view: never editor-only notes, reviewer identities or storage
 * paths. Staff views build on it.
 */
class ManuscriptPresenter
{
    public function __construct(private ManuscriptSubmissionService $submissions) {}

    public function summary(Manuscript $m): array
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
    public function detail(Manuscript $m): array
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
            'decision_notes' => in_array(ManuscriptSubmissionService::normalizeStatus($m->status), ['revision_required', 'accepted', 'rejected', 'published'], true) ? $m->decision_notes : null,
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

    public function stage(?string $status): string
    {
        foreach (ManuscriptSubmissionService::STATUS_GROUPS as $stage => $statuses) {
            if (in_array($status, $statuses, true)) {
                return $stage;
            }
        }

        return 'in_progress';
    }

    /** Milestones from the manuscript's own dates, plus the author's revisions. */
    public function timeline(Manuscript $m): array
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
}
