<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    public const PLACEMENTS = ['header', 'footer', 'none'];

    protected $fillable = ['title', 'slug', 'content', 'placement', 'position', 'is_published'];

    protected $casts = [
        'is_published' => 'boolean',
        'position' => 'integer',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopePlacement(Builder $query, string $placement): Builder
    {
        return $query->where('placement', $placement);
    }
}
