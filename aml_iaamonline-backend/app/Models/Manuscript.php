<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'category',
        'status',
        'file_path',
        'file_name',
        'file_size',
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
}
