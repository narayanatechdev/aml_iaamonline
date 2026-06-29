<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DoiMetadataService
{
    /**
     * Fetch metadata from CrossRef API by DOI.
     * 
     * @param string $doi
     * @return array|null
     */
    /**
     * Fetch metadata from CrossRef API by DOI.
     * Returns ['data' => array, 'error' => null] on success,
     * or ['data' => null, 'error' => string] on failure.
     */
    public static function fetch(string $doi): array
    {
        try {
            // Standardizing DOI format (removes URL prefixes and surrounding whitespace)
            $cleanDoi = trim($doi);
            $cleanDoi = preg_replace('#^https?://(dx\.)?doi\.org/#i', '', $cleanDoi) ?? $cleanDoi;
            $cleanDoi = preg_replace('#^doi:\s*#i', '', $cleanDoi) ?? $cleanDoi;
            $cleanDoi = trim($cleanDoi);

            $response = Http::timeout(15)
                ->withHeaders([
                    'User-Agent' => 'AMLJournal/1.0 (mailto:patra@iaamonline.org)',
                ])
                ->get('https://api.crossref.org/works/'.rawurlencode($cleanDoi));

            if ($response->successful()) {
                $message = $response->json()['message'] ?? null;
                return ['data' => $message, 'error' => null];
            }

            if ($response->status() === 404) {
                Log::info("DOI not registered at CrossRef: {$cleanDoi}");
                return [
                    'data' => null,
                    'error' => "DOI '{$cleanDoi}' is not yet registered at CrossRef. Please deposit this DOI via https://doi.crossref.org/ first.",
                ];
            }

            Log::warning("CrossRef API failed for DOI: {$cleanDoi}", [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);
            return [
                'data' => null,
                'error' => "CrossRef API returned HTTP {$response->status()}. Please try again later.",
            ];
        } catch (\Exception $e) {
            Log::error("Error fetching CrossRef metadata: " . $e->getMessage());
            return [
                'data' => null,
                'error' => 'Could not connect to CrossRef API. Please check your internet connection and try again.',
            ];
        }
    }
}
