<?php

namespace App\Console\Commands;

use App\Models\Affiliation;
use App\Models\ArticleAuthor;
use App\Models\Author;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('affiliations:update')]
#[Description('Scrape and update author affiliations from XML sources')]
class UpdateAffiliationsCommand extends Command
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
        $processedArticles = [];
        
        $progressBar = $this->output->createProgressBar(count($articles));
        $progressBar->start();
        
        foreach ($articles as $article) {
            $articleId = $article['id'];
            
            if (in_array($articleId, $processedArticles)) {
                $progressBar->advance();
                continue;
            }
            
            $processedArticles[] = $articleId;
            
            try {
                $xmlUrl = "https://aml.iaamonline.org/?_action=xml&article=" . $articleId;
                $xmlContent = @file_get_contents($xmlUrl);
                
                if (!$xmlContent) {
                    $progressBar->advance();
                    continue;
                }
                
                $xml = simplexml_load_string($xmlContent);
                
                if (!$xml || !isset($xml->AuthorList->Author)) {
                    $progressBar->advance();
                    continue;
                }
                
                foreach ($xml->AuthorList->Author as $position => $authorXml) {
                    $firstName = (string)$authorXml->FirstName;
                    $lastName = (string)$authorXml->LastName;
                    $affiliationText = (string)$authorXml->Affiliation;
                    
                    if (empty($affiliationText)) {
                        continue;
                    }
                    
                    $fullName = trim($firstName . ' ' . $lastName);
                    
                    // Find author by name
                    $author = Author::where('name', $fullName)->first();
                    
                    if (!$author) {
                        continue;
                    }
                    
                    // Find or create affiliation
                    $affiliation = Affiliation::where('name', $affiliationText)->first();
                    
                    if (!$affiliation) {
                        $affiliation = Affiliation::create([
                            'name' => $affiliationText,
                            'full_address' => $affiliationText,
                            'author_count' => 0,
                        ]);
                        
                        // Parse location info
                        $affiliation->parseLocationFromName();
                        $affiliationCount++;
                    }
                    
                    // Update ArticleAuthor with affiliation
                    $articleAuthor = ArticleAuthor::where('article_id', $articleId)
                        ->where('author_id', $author->id)
                        ->first();
                    
                    if ($articleAuthor && !$articleAuthor->affiliation_id) {
                        $articleAuthor->update([
                            'affiliation_id' => $affiliation->id,
                            'affiliation_text' => $affiliationText,
                        ]);
                        
                        $updateCount++;
                    }
                }
                
                // Small delay to avoid overwhelming the server
                usleep(100000); // 0.1 second
                
            } catch (\Exception $e) {
                // Continue processing other articles
                continue;
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
        
        $this->info('Affiliation update completed!');
        $this->info("New affiliations created: $affiliationCount");
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
