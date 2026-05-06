<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'country', 'city', 'department', 'full_address', 'author_count'])]
class Affiliation extends Model
{
    use HasFactory;

    public function articleAuthors(): HasMany
    {
        return $this->hasMany(ArticleAuthor::class);
    }

    public function incrementAuthorCount(): void
    {
        $this->increment('author_count');
    }

    public function scopeByCountry($query, string $country)
    {
        return $query->where('country', $country);
    }

    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    public static function findOrCreateByName(string $name, ?string $country = null, ?string $city = null, ?string $department = null): self
    {
        $affiliation = self::where('name', $name)
            ->when($country, fn($q) => $q->where('country', $country))
            ->first();

        if (!$affiliation) {
            $affiliation = self::create([
                'name' => $name,
                'country' => $country,
                'city' => $city,
                'department' => $department,
                'full_address' => $name,
                'author_count' => 0,
            ]);
        }

        return $affiliation;
    }

    public function parseLocationFromName(): void
    {
        $name = $this->name;
        
        // Extract country (usually at the end)
        if (preg_match('/,\s*([^,]+)$/', $name, $matches)) {
            $this->country = trim($matches[1]);
        }
        
        // Extract city (usually second to last)
        if (preg_match('/,\s*([^,]+)\s*,\s*[^,]+$/', $name, $matches)) {
            $this->city = trim($matches[1]);
        }
        
        // Extract department (usually at the beginning)
        if (preg_match('/^([^,]+)/', $name, $matches)) {
            $this->department = trim($matches[1]);
        }
        
        $this->save();
    }
}
