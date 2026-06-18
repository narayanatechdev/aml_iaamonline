<?php

namespace App\Services;

/**
 * Similarity / plagiarism check (iThenticate / Crossref Similarity Check).
 *
 * This is a scaffold. Wire a real provider by setting THENTICATE_* env vars and
 * implementing submit() against their API. Until configured it returns null
 * (pending), so the workflow is never blocked.
 */
class SimilarityCheckService
{
    public static function isConfigured(): bool
    {
        return ! empty(config('services.ithenticate.key'));
    }

    /**
     * Submit a manuscript file for similarity scoring. Returns a percentage or null.
     */
    public static function check(string $filePath): ?float
    {
        if (! self::isConfigured()) {
            return null; // pending — provider not configured
        }

        // TODO: call iThenticate API, poll for the report, return the score.
        return null;
    }
}
