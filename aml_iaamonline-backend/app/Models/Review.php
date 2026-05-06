<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'review_assignment_id',
        'manuscript_id',
        'reviewer_email',
        'recommendation',
        'strengths',
        'weaknesses',
        'comments',
        'questions',
        'quality_score',
        'novelty_score',
        'relevance_score',
        'is_submitted',
        'submitted_at',
        'is_draft',
        'last_saved_at',
        'ip_address',
    ];

    protected $casts = [
        'is_submitted' => 'boolean',
        'is_draft' => 'boolean',
        'submitted_at' => 'datetime',
        'last_saved_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(ReviewAssignment::class, 'review_assignment_id');
    }

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }
}
