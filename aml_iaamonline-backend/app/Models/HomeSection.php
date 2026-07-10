<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    protected $fillable = [
        'block_type',
        'name',
        'position',
        'is_visible',
        'content',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'position' => 'integer',
        'content' => 'array',
    ];

    /**
     * Scope: only visible blocks, ordered for public rendering.
     */
    public function scopeVisibleOrdered($query)
    {
        return $query->where('is_visible', true)->orderBy('position');
    }
}
