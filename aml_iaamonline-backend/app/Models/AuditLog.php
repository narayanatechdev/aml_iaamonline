<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'action',
        'actor_type',
        'actor_email',
        'actor_ip',
        'manuscript_id',
        'review_assignment_id',
        'resource_type',
        'resource_id',
        'changes',
        'description',
        'status',
        'metadata',
    ];

    protected $casts = [
        'changes' => 'array',
        'metadata' => 'array',
    ];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function reviewAssignment()
    {
        return $this->belongsTo(ReviewAssignment::class);
    }
}
