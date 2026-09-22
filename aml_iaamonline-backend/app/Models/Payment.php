<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'purpose', 'reference', 'user_id', 'email', 'amount_minor', 'currency',
    'status', 'stripe_session_id', 'stripe_payment_intent_id', 'paid_at',
])]
class Payment extends Model
{
    use HasFactory;

    public const PURPOSE_ARTICLE = 'article';

    public const PURPOSE_SUBSCRIPTION = 'subscription';

    public const PURPOSE_APC = 'apc';

    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REFUNDED = 'refunded';

    protected function casts(): array
    {
        return [
            'paid_at' => 'datetime',
            'amount_minor' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePaid($query)
    {
        return $query->where('status', self::STATUS_PAID);
    }
}
