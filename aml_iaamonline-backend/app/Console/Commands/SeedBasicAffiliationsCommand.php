<?php

namespace App\Console\Commands;

use App\Models\Affiliation;
use App\Models\ArticleAuthor;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('affiliations:seed-basic')]
#[Description('Seed basic affiliations from articles data')]
class SeedBasicAffiliationsCommand extends Command
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
        
        $this->info('Processing ' . count($articles) . ' articles for affiliations...');
        
        $affiliationCount = 0;
        $updateCount = 0;
        $processedAffiliations = [];
        
        $progressBar = $this->output->createProgressBar(count($articles));
        $progressBar->start();
        
        foreach ($articles as $article) {
            if (!isset($article['affiliations']) || !is_array($article['affiliations'])) {
                $progressBar->advance();
                continue;
            }
            
            $articleId = $article['id'];
            
            foreach ($article['affiliations'] as $affiliationText) {
                $affiliationText = trim($affiliationText);
                if (empty($affiliationText)) continue;
                
                // Check if we've already processed this affiliation
                $affiliationKey = strtolower($affiliationText);
                
                if (!isset($processedAffiliations[$affiliationKey])) {
                    // Create new affiliation
                    $affiliation = Affiliation::firstOrCreate(
                        ['name' => $affiliationText],
                        [
                            'full_address' => $affiliationText,
                            'author_count' => 0,
                        ]
                    );
                    
                    // Parse location info
                    if (!$affiliation->country) {
                        $affiliation->parseLocationFromName();
                    }
                    
                    $processedAffiliations[$affiliationKey] = $affiliation->id;
                    $affiliationCount++;
                }
                
                $affiliationId = $processedAffiliations[$affiliationKey];
                
                // Update ArticleAuthor records for this article
                $articleAuthors = ArticleAuthor::where('article_id', $articleId)
                    ->whereNull('affiliation_id')
                    ->get();
                
                foreach ($articleAuthors as $articleAuthor) {
                    $articleAuthor->update([
                        'affiliation_id' => $affiliationId,
                        'affiliation_text' => $affiliationText,
                    ]);
                    
                    $updateCount++;
                }
            }
            
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine();
        
        // Update affiliation counts
        $this->info('Updating affiliation counts...');
        $affiliations = Affiliation::withCount('articleAuthors')->get();
        
        foreach ($affiliations as $affiliation) {
            $affiliation->update(['author_count' => $affiliation->article_authors_count]);
        }
        
        $this->info('Basic affiliation seeding completed!');
        $this->info("Affiliations created: $affiliationCount");
        $this->info("Article-author records updated: $updateCount");
        
        // Show some statistics
        $this->newLine();
        $this->info('Top 10 affiliations by author count:');
        $topAffiliations = Affiliation::orderBy('author_count', 'desc')->limit(10)->get();
        
        foreach ($topAffiliations as $affiliation) {
            $shortName = strlen($affiliation->name) > 80 ? substr($affiliation->name, 0, 80) . '...' : $affiliation->name;
            $this->line("- {$shortName}: {$affiliation->author_count} authors (ID: {$affiliation->id})");
        }
        
        return 0;
    }
}
