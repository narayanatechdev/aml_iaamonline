<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VerificationCode extends Model
{
    protected $fillable = [
        'review_assignment_id',
        'code',
        'code_hash',
        'reviewer_email',
        'is_used',
        'expires_at',
        'used_at',
        'attempt_count',
        'max_attempts',
        'is_locked',
        'locked_until',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'is_used' => 'boolean',
        'is_locked' => 'boolean',
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'locked_until' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(ReviewAssignment::class, 'review_assignment_id');
    }
}
