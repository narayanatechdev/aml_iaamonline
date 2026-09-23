<?php

namespace App\Services\Crossref;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Posts a Crossref deposit and reports what came back.
 *
 * Crossref accepts the batch synchronously but processes it later, so a 200
 * here means "queued", never "registered". The batch id is what ties this
 * submission to the result mail and the admin queue.
 */
class CrossrefDepositService
{
    /** Crossref rejects uploads above 10 MB. */
    private const MAX_BYTES = 10 * 1024 * 1024;

    public function isConfigured(): bool
    {
        return filled(config('services.crossref.username'))
            && filled(config('services.crossref.password'));
    }

    public function endpoint(): string
    {
        return (string) config('services.crossref.endpoint');
    }

    public function isProduction(): bool
    {
        return str_contains($this->endpoint(), 'doi.crossref.org');
    }

    /** Crossref authenticates as "user/role", and the role is case-sensitive. */
    public function loginId(): string
    {
        $user = (string) config('services.crossref.username');
        $role = trim((string) config('services.crossref.role'));

        return $role === '' ? $user : $user.'/'.$role;
    }

    /**
     * @return array{ok: bool, status: int, body: string, batch_id: string}
     */
    public function deposit(string $xml, string $batchId): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Crossref credentials are not configured.');
        }

        $bytes = strlen($xml);
        if ($bytes > self::MAX_BYTES) {
            throw new RuntimeException(
                "Deposit is {$bytes} bytes; Crossref rejects anything over ".self::MAX_BYTES.'. Split the batch.'
            );
        }

        try {
            $response = Http::timeout(120)
                ->asMultipart()
                ->attach('fname', $xml, $batchId.'.xml')
                ->post($this->endpoint(), [
                    ['name' => 'operation', 'contents' => 'doMDUpload'],
                    ['name' => 'login_id', 'contents' => $this->loginId()],
                    ['name' => 'login_passwd', 'contents' => (string) config('services.crossref.password')],
                ]);
        } catch (ConnectionException $e) {
            throw new RuntimeException('Could not reach Crossref: '.$e->getMessage(), previous: $e);
        }

        $body = trim($response->body());

        Log::info('Crossref deposit submitted', [
            'batch_id' => $batchId,
            'endpoint' => $this->endpoint(),
            'status' => $response->status(),
            'bytes' => $bytes,
        ]);

        return [
            'ok' => $response->successful() && ! $this->looksLikeFailure($body),
            'status' => $response->status(),
            'body' => $body,
            'batch_id' => $batchId,
        ];
    }

    /** Crossref answers some rejections with a 200 and an error in the body. */
    private function looksLikeFailure(string $body): bool
    {
        return (bool) preg_match('/(cannot assume|wrong credentials|not allowed|failure|fatal)/i', $body);
    }
}
