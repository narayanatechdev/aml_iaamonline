<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $fillable = [
        'proposal_id',
        'kind',
        'title',
        'editors',
        'scope',
        'units',
        'timeline',
        'audience',
        'status',
        'author_email',
        'user_id',
        'decision_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
