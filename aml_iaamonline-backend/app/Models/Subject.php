<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'is_active',
        'position',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'position' => 'integer',
    ];

    /**
     * Scope: only active subjects, ordered for display.
     */
    public function scopeActiveOrdered($query)
    {
        return $query->where('is_active', true)->orderBy('position')->orderBy('name');
    }
}
