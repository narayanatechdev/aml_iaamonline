<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class Manuscript extends Model
{
    protected $fillable = [
        'submission_id',
        'title',
        'authors',
        'author_email',
        'author_affiliation',
        'abstract',
        'keywords',
        'acknowledgements',
        'funding_information',
        'conflict_of_interest',
        'author_contributions',
        'data_availability',
        'cover_letter',
        'co_authors',
        'revision_round',
        'revision_response',
        'prod_copyedit',
        'prod_typeset',
        'prod_proof',
        'prod_xml',
        'volume',
        'issue',
        'pages',
        'doi',
        'published_at',
        'category',
        'trl',
        'division',
        'similarity_score',
        'assigned_editor_id',
        'status',
        'file_path',
        'file_name',
        'file_size',
        'graphical_abstract_path',
        'author_image_url',
        'author_image_mime_type',
        'author_image_size',
        'submitted_at',
        'editor_review_completed_at',
        'editor_notes',
        'peer_review_completed_at',
        'reviewer_count',
        'final_decision',
        'decision_date',
        'decision_notes',
        'iaam_id',
        'submitted_via',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'editor_review_completed_at' => 'datetime',
        'peer_review_completed_at' => 'datetime',
        'decision_date' => 'datetime',
        'author_contributions' => 'json',
        'co_authors' => 'json',
        'prod_copyedit' => 'boolean',
        'prod_typeset' => 'boolean',
        'prod_proof' => 'boolean',
        'prod_xml' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function files()
    {
        return $this->hasMany(ManuscriptFile::class);
    }

    public function assignedEditor()
    {
        return $this->belongsTo(User::class, 'assigned_editor_id');
    }

    public function reviewAssignments()
    {
        return $this->hasMany(ReviewAssignment::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function sdgs(): BelongsToMany
    {
        return $this->belongsToMany(SustainableDevelopmentGoal::class, 'manuscript_sdgs');
    }

    /**
     * Manuscripts belonging to the person with this IAAM ID: stamped with it
     * (Portal submissions and anything since), or — for older AML papers
     * that predate IAAM IDs — sent from the email of the AML account that
     * holds it.
     */
    public function scopeOwnedByIaamId(Builder $query, string $iaamId): Builder
    {
        $emails = User::where('iaam_id', $iaamId)->pluck('email')->map(fn ($e) => strtolower($e));

        return $query->where(function (Builder $q) use ($iaamId, $emails) {
            $q->where('iaam_id', $iaamId);

            if ($emails->isNotEmpty()) {
                $q->orWhere(fn (Builder $q) => $q->whereNull('iaam_id')
                    ->whereIn(DB::raw('lower(author_email)'), $emails->all()));
            }
        });
    }
}
