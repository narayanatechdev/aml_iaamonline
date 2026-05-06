<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewAssignment extends Model
{
    protected $fillable = [
        'manuscript_id',
        'reviewer_email',
        'reviewer_name',
        'status',
        'invited_at',
        'response_date',
        'due_date',
        'completed_at',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
        'response_date' => 'datetime',
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }

    public function tokens()
    {
        return $this->hasMany(ReviewToken::class);
    }

    public function verificationCodes()
    {
        return $this->hasMany(VerificationCode::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
