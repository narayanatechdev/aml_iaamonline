<?php

namespace App\Console\Commands;

use App\Models\Author;
use App\Models\ArticleAuthor;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('authors:seed')]
#[Description('Seed authors from articles data and create relationships')]
class SeedAuthorsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Loading articles data...');
        
        $articlesPath = base_path('../aml_iaamonline-frontend/lib/articles_data.json');
        
        if (!file_exists($articlesPath)) {
            $this->error('Articles data file not found at: ' . $articlesPath);
            return 1;
        }
        
        $articlesJson = file_get_contents($articlesPath);
        $articles = json_decode($articlesJson, true);
        
        if (!$articles) {
            $this->error('Failed to parse articles JSON');
            return 1;
        }
        
        $this->info('Processing ' . count($articles) . ' articles...');
        
        $authorCount = 0;
        $relationshipCount = 0;
        $processedAuthors = [];
        
        $progressBar = $this->output->createProgressBar(count($articles));
        $progressBar->start();
        
        foreach ($articles as $article) {
            if (!isset($article['authors']) || !is_array($article['authors'])) {
                $progressBar->advance();
                continue;
            }
            
            $articleId = $article['id'];
            
            foreach ($article['authors'] as $position => $authorName) {
                $authorName = trim($authorName);
                if (empty($authorName)) continue;
                
                // Check if we've already processed this author name
                $authorKey = strtolower($authorName);
                
                if (!isset($processedAuthors[$authorKey])) {
                    // Create new author
                    $author = Author::firstOrCreate(
                        ['name' => $authorName],
                        [
                            'email' => null,
                            'affiliation' => isset($article['affiliations'][0]) ? $article['affiliations'][0] : null,
                            'article_count' => 0,
                        ]
                    );
                    
                    $processedAuthors[$authorKey] = $author->id;
                    $authorCount++;
                }
                
                $authorId = $processedAuthors[$authorKey];
                
                // Create article-author relationship
                try {
                    ArticleAuthor::firstOrCreate([
                        'article_id' => $articleId,
                        'author_id' => $authorId,
                    ], [
                        'position' => $position + 1,
                        'is_corresponding' => $position === 0,
                    ]);
                    
                    $relationshipCount++;
                } catch (\Exception $e) {
                    // Skip duplicates
                    continue;
                }
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine();
        
        // Update article counts for all authors
        $this->info('Updating article counts...');
        $authors = Author::withCount('articleAuthors')->get();
        
        foreach ($authors as $author) {
            $author->update(['article_count' => $author->article_authors_count]);
        }
        
        $this->info('Seeding completed!');
        $this->info("Total unique authors created: $authorCount");
        $this->info("Total article-author relationships created: $relationshipCount");
        
        // Show some statistics
        $this->newLine();
        $this->info('Top 10 authors by article count:');
        $topAuthors = Author::orderBy('article_count', 'desc')->limit(10)->get();
        
        foreach ($topAuthors as $author) {
            $this->line("- {$author->name}: {$author->article_count} articles (ID: {$author->id})");
        }
        
        return 0;
    }
}
