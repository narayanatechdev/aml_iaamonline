<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'status',
        'file_path',
        'file_name',
        'file_size',
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
}
