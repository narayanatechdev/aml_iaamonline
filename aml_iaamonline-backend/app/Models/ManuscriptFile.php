<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManuscriptFile extends Model
{
    protected $fillable = [
        'manuscript_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'mime_type',
        'file_type_category',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    public function manuscript()
    {
        return $this->belongsTo(Manuscript::class);
    }
}
