<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'legacy_id', 'manuscript_id', 'title', 'document_type', 'subject',
    'abstract', 'keywords', 'doi', 'volume', 'issue', 'pages_from',
    'pages_to', 'language', 'status', 'pdf_url', 'original_pdf_url',
    'graphical_abstract_url', 'article_link', 'file_name',
    'views_count', 'pdf_downloads', 'cited_count',
    'corresponding_author', 'receive_date', 'revise_date',
    'accept_date', 'publish_date', 'publish_year', 'publish_month',
    'acknowledgements', 'funding_information', 'conflict_of_interest',
    'author_contributions', 'data_availability',
])]
class Article extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'receive_date' => 'date',
            'revise_date' => 'date',
            'accept_date' => 'date',
            'publish_date' => 'date',
            'author_contributions' => 'json',
        ];
    }

    public function articleAuthors(): HasMany
    {
        return $this->hasMany(ArticleAuthor::class, 'article_id', 'legacy_id');
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'article_authors', 'article_id', 'author_id', 'legacy_id')
            ->withPivot('position', 'is_corresponding', 'affiliation_id', 'affiliation_text')
            ->orderByPivot('position');
    }

    public function getKeywordsArrayAttribute(): array
    {
        if (! $this->keywords) {
            return [];
        }

        return array_map('trim', explode(',', $this->keywords));
    }

    public function getPagesAttribute(): string
    {
        if ($this->pages_from && $this->pages_to) {
            return "{$this->pages_from}-{$this->pages_to}";
        }

        return $this->pages_from ? (string) $this->pages_from : '';
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByVolume($query, string $volume, ?string $issue = null)
    {
        $query->where('volume', $volume);
        if ($issue) {
            $query->where('issue', $issue);
        }

        return $query;
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('publish_year', $year);
    }

    public function scopeSearch($query, string $term)
    {
        $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
        $searchTerm = "%{$term}%";

        return $query->where(function ($q) use ($like, $searchTerm) {
            $q->where('title', $like, $searchTerm)
                ->orWhere('abstract', $like, $searchTerm)
                ->orWhere('keywords', $like, $searchTerm)
                ->orWhere('doi', $like, $searchTerm)
                ->orWhere('corresponding_author', $like, $searchTerm);
        });
    }

    public function sdgs(): BelongsToMany
    {
        return $this->belongsToMany(SustainableDevelopmentGoal::class, 'article_sdgs');
    }
}
