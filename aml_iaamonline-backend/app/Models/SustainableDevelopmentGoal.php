<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class SustainableDevelopmentGoal extends Model
{
    protected $fillable = [
        'sdg_number',
        'name',
        'description',
        'color_code',
        'icon_identifier',
    ];

    protected $casts = [
        'sdg_number' => 'integer',
    ];

    public function manuscripts(): BelongsToMany
    {
        return $this->belongsToMany(Manuscript::class, 'manuscript_sdgs');
    }

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_sdgs');
    }
}
