<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['article_id', 'author_id', 'affiliation_id', 'affiliation_ids', 'affiliation_text', 'position', 'is_corresponding'])]
class ArticleAuthor extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_corresponding' => 'boolean',
            'affiliation_ids' => 'array',
        ];
    }

    /**
     * All affiliation ids for this author on this article, in display order.
     * Falls back to the legacy single affiliation_id column.
     *
     * @return list<int>
     */
    public function affiliationIdList(): array
    {
        $ids = array_values(array_filter(array_map('intval', $this->affiliation_ids ?? [])));

        if ($ids === [] && $this->affiliation_id) {
            $ids = [(int) $this->affiliation_id];
        }

        return $ids;
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id', 'legacy_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function affiliation(): BelongsTo
    {
        return $this->belongsTo(Affiliation::class);
    }
}
