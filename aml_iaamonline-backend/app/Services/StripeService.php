<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Minimal Stripe Checkout client.
 *
 * Talks to Stripe's REST API over the HTTP client rather than pulling in the
 * SDK, because the journal only needs hosted Checkout Sessions and webhook
 * verification. Every method is inert until STRIPE_SECRET is configured, so
 * the rest of the access model works before payments go live.
 */
class StripeService
{
    private const API = 'https://api.stripe.com/v1';

    /** Webhook timestamps older than this are rejected, to blunt replay attacks. */
    private const WEBHOOK_TOLERANCE_SECONDS = 300;

    public function isConfigured(): bool
    {
        return filled(config('services.stripe.secret'));
    }

    /**
     * Create a hosted Checkout Session and return it.
     *
     * @param  array<string, string>  $metadata
     * @return array{id: string, url: string}
     */
    public function createCheckoutSession(
        string $productName,
        int $amountMinor,
        string $currency,
        string $customerEmail,
        string $successUrl,
        string $cancelUrl,
        array $metadata = [],
    ): array {
        $this->ensureConfigured();

        $payload = [
            'mode' => 'payment',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'customer_email' => $customerEmail,
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => strtolower($currency),
                    'unit_amount' => $amountMinor,
                    'product_data' => ['name' => $productName],
                ],
            ]],
            'metadata' => $metadata,
        ];

        try {
            $response = Http::withToken(config('services.stripe.secret'))
                ->asForm()
                ->timeout(20)
                ->post(self::API.'/checkout/sessions', $this->flatten($payload));
        } catch (ConnectionException $e) {
            throw new RuntimeException('Could not reach Stripe. Please try again.', previous: $e);
        }

        if ($response->failed()) {
            throw new RuntimeException($response->json('error.message') ?? 'Stripe rejected the checkout request.');
        }

        return [
            'id' => $response->json('id'),
            'url' => $response->json('url'),
        ];
    }

    /**
     * Verify a webhook payload against the Stripe-Signature header.
     *
     * Implements Stripe's documented scheme: the header carries a timestamp
     * and one or more v1 signatures, each an HMAC-SHA256 of "timestamp.payload"
     * keyed by the endpoint's signing secret.
     */
    public function verifyWebhookSignature(string $payload, ?string $signatureHeader): bool
    {
        $secret = config('services.stripe.webhook_secret');

        if (blank($secret) || blank($signatureHeader)) {
            return false;
        }

        $timestamp = null;
        $signatures = [];

        foreach (explode(',', $signatureHeader) as $part) {
            [$key, $value] = array_pad(explode('=', trim($part), 2), 2, null);

            if ($key === 't') {
                $timestamp = $value;
            } elseif ($key === 'v1' && $value !== null) {
                $signatures[] = $value;
            }
        }

        if ($timestamp === null || $signatures === []) {
            return false;
        }

        if (abs(time() - (int) $timestamp) > self::WEBHOOK_TOLERANCE_SECONDS) {
            return false;
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

        foreach ($signatures as $signature) {
            if (hash_equals($expected, $signature)) {
                return true;
            }
        }

        return false;
    }

    private function ensureConfigured(): void
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Online payment is not available yet. Please contact the editorial office.');
        }
    }

    /**
     * Stripe's form API takes nested data as bracketed keys
     * (line_items[0][price_data][currency]).
     *
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function flatten(array $data, string $prefix = ''): array
    {
        $flat = [];

        foreach ($data as $key => $value) {
            $name = $prefix === '' ? (string) $key : "{$prefix}[{$key}]";

            if (is_array($value)) {
                $flat += $this->flatten($value, $name);
            } elseif ($value !== null) {
                $flat[$name] = is_bool($value) ? ($value ? 'true' : 'false') : (string) $value;
            }
        }

        return $flat;
    }
}
