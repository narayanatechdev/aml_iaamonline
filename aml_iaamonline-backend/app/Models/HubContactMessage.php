<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HubContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'organisation',
        'subject',
        'message',
        'ip_address',
        'confirmation_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'confirmation_sent_at' => 'datetime',
        ];
    }
}
