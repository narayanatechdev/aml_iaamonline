<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'name', 'first_name', 'last_name', 'email', 'orcid',
    'affiliation', 'user_id', 'article_count',
    'degree', 'position', 'phone', 'mobile', 'country', 'city',
])]
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

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_authors', 'author_id', 'article_id', 'id', 'legacy_id')
            ->withPivot('position', 'is_corresponding', 'affiliation_id', 'affiliation_text')
            ->orderByPivot('position');
    }

    public function getFullNameAttribute(): string
    {
        if ($this->first_name || $this->last_name) {
            return trim("{$this->first_name} {$this->last_name}");
        }
        return $this->name ?? '';
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

    public function scopeByLastName($query, string $lastName)
    {
        return $query->where('last_name', $lastName);
    }

    public function scopeByCountry($query, string $country)
    {
        return $query->where('country', $country);
    }

    public static function findOrCreateByName(
        string $name,
        ?string $email = null,
        ?string $affiliation = null,
        ?string $firstName = null,
        ?string $lastName = null,
    ): self {
        $query = self::where('name', $name);
        if ($email) {
            $query->orWhere('email', $email);
        }
        $author = $query->first();

        if (!$author) {
            $author = self::create([
                'name' => $name,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'affiliation' => $affiliation,
                'article_count' => 0,
            ]);
        } elseif ($firstName && !$author->first_name) {
            $author->update([
                'first_name' => $firstName,
                'last_name' => $lastName,
            ]);
        }

        return $author;
    }
}
