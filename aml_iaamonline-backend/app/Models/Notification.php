<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications_feed';

    protected $fillable = ['user_email', 'type', 'title', 'body', 'link', 'read_at'];

    protected $casts = ['read_at' => 'datetime'];

    /**
     * Create an in-app notification (and optionally mirror to email later).
     */
    public static function add(string $email, string $type, string $title, ?string $body = null, ?string $link = null): void
    {
        static::create([
            'user_email' => $email,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'link' => $link,
        ]);
    }
}
