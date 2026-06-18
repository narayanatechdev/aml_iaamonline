<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsortiumMember extends Model
{
    protected $fillable = ['name', 'sso_domain', 'ip_ranges', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}
