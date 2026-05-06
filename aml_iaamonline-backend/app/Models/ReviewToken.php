<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewToken extends Model
{
    protected $fillable = [
        'token',
        'token_hash',
        'review_assignment_id',
        'reviewer_email',
        'is_revoked',
        'expires_at',
        'used_at',
        'access_count',
        'last_accessed_at',
        'ip_addresses',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'last_accessed_at' => 'datetime',
        'is_revoked' => 'boolean',
    ];

    public function assignment()
    {
        return $this->belongsTo(ReviewAssignment::class, 'review_assignment_id');
    }
}
