<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'email', 'orcid', 'affiliation', 'user_id', 'article_count'])]
class Author extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function articleAuthors(): HasMany
    {
        return $this->hasMany(ArticleAuthor::class);
    }

    public function incrementArticleCount(): void
    {
        $this->increment('article_count');
    }

    public function scopeByName($query, string $name)
    {
        return $query->where('name', $name);
    }

    public function scopeByEmail($query, string $email)
    {
        return $query->where('email', $email);
    }

    public static function findOrCreateByName(string $name, ?string $email = null, ?string $affiliation = null): self
    {
        $author = self::where('name', $name)
            ->when($email, fn($q) => $q->where('email', $email))
            ->first();

        if (!$author) {
            $author = self::create([
                'name' => $name,
                'email' => $email,
                'affiliation' => $affiliation,
                'article_count' => 0,
            ]);
        }

        return $author;
    }
}
