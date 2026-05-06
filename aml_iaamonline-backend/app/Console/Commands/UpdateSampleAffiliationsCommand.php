<?php

namespace App\Console\Commands;

use App\Models\Affiliation;
use App\Models\ArticleAuthor;
use App\Models\Author;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('affiliations:update-sample')]
#[Description('Update sample articles with real affiliations from XML')]
class UpdateSampleAffiliationsCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Sample article IDs to process
        $sampleArticles = ['25039', '25040', '25041', '25042', '25043'];
        
        $this->info('Updating sample articles with real affiliations...');
        
        $affiliationCount = 0;
        $updateCount = 0;
        
        foreach ($sampleArticles as $articleId) {
            $this->info("Processing article {$articleId}...");
            
            try {
                $xmlUrl = "https://aml.iaamonline.org/?_action=xml&article=" . $articleId;
                $xmlContent = @file_get_contents($xmlUrl);
                
                if (!$xmlContent) {
                    $this->warn("Could not fetch XML for article {$articleId}");
                    continue;
                }
                
                $xml = simplexml_load_string($xmlContent);
                
                if (!$xml || !isset($xml->AuthorList->Author)) {
                    $this->warn("No author data found for article {$articleId}");
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
                    
                    $this->line("  Author: {$fullName}");
                    $this->line("  Affiliation: {$affiliationText}");
                    
                    // Find author by name
                    $author = Author::where('name', $fullName)->first();
                    
                    if (!$author) {
                        $this->warn("  Author {$fullName} not found in database");
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
                        
                        $this->info("  Created new affiliation (ID: {$affiliation->id})");
                    } else {
                        $this->line("  Using existing affiliation (ID: {$affiliation->id})");
                    }
                    
                    // Update ArticleAuthor with affiliation
                    $articleAuthor = ArticleAuthor::where('article_id', $articleId)
                        ->where('author_id', $author->id)
                        ->first();
                    
                    if ($articleAuthor) {
                        $articleAuthor->update([
                            'affiliation_id' => $affiliation->id,
                            'affiliation_text' => $affiliationText,
                        ]);
                        
                        $updateCount++;
                        $this->info("  Updated article-author relationship");
                    }
                }
                
                $this->newLine();
                
                // Small delay to avoid overwhelming the server
                sleep(1);
                
            } catch (\Exception $e) {
                $this->error("Error processing article {$articleId}: " . $e->getMessage());
                continue;
            }
        }
        
        // Update affiliation counts
        $this->info('Updating affiliation counts...');
        $affiliations = Affiliation::withCount('articleAuthors')->get();
        
        foreach ($affiliations as $affiliation) {
            $affiliation->update(['author_count' => $affiliation->article_authors_count]);
        }
        
        $this->info('Sample affiliation update completed!');
        $this->info("New affiliations created: $affiliationCount");
        $this->info("Article-author records updated: $updateCount");
        
        // Show updated affiliations
        $this->newLine();
        $this->info('All affiliations in system:');
        $allAffiliations = Affiliation::orderBy('author_count', 'desc')->get();
        
        foreach ($allAffiliations as $affiliation) {
            $shortName = strlen($affiliation->name) > 100 ? substr($affiliation->name, 0, 100) . '...' : $affiliation->name;
            $location = $affiliation->country ? " [{$affiliation->country}]" : "";
            $this->line("- {$shortName}{$location}: {$affiliation->author_count} authors (ID: {$affiliation->id})");
        }
        
        return 0;
    }
}
