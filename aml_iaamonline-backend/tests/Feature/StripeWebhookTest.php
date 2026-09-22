<?php

use App\Models\Article;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);
});

/** Build the Stripe-Signature header the way Stripe signs a payload. */
function signedHeader(string $payload, ?int $timestamp = null, string $secret = 'whsec_test'): string
{
    $timestamp ??= time();
    $signature = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

    return "t={$timestamp},v1={$signature}";
}

function completedSessionPayload(int $paymentId, string $sessionId = 'cs_test_1'): string
{
    return json_encode([
        'type' => 'checkout.session.completed',
        'data' => ['object' => [
            'id' => $sessionId,
            'payment_intent' => 'pi_test_1',
            'metadata' => ['payment_id' => (string) $paymentId],
        ]],
    ]);
}

function pendingPayment(array $attributes = []): Payment
{
    return Payment::create(array_merge([
        'purpose' => Payment::PURPOSE_ARTICLE,
        'reference' => '4242',
        'user_id' => User::factory()->create()->id,
        'email' => 'reader@example.com',
        'amount_minor' => 2500,
        'currency' => 'EUR',
        'status' => Payment::STATUS_PENDING,
        'stripe_session_id' => 'cs_test_1',
    ], $attributes));
}

it('rejects a webhook with no signature', function () {
    $payment = pendingPayment();

    $this->postJson('/api/webhooks/stripe', json_decode(completedSessionPayload($payment->id), true))
        ->assertStatus(400);

    expect($payment->fresh()->status)->toBe(Payment::STATUS_PENDING);
});

it('rejects a webhook signed with the wrong secret', function () {
    $payment = pendingPayment();
    $payload = completedSessionPayload($payment->id);

    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload, secret: 'whsec_wrong'),
    ], $payload)->assertStatus(400);

    expect($payment->fresh()->status)->toBe(Payment::STATUS_PENDING);
});

it('rejects a replayed webhook older than the tolerance window', function () {
    $payment = pendingPayment();
    $payload = completedSessionPayload($payment->id);

    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload, timestamp: time() - 3600),
    ], $payload)->assertStatus(400);

    expect($payment->fresh()->status)->toBe(Payment::STATUS_PENDING);
});

it('marks an article purchase paid on a correctly signed webhook', function () {
    $payment = pendingPayment();
    $payload = completedSessionPayload($payment->id);

    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload),
    ], $payload)->assertOk();

    $payment->refresh();
    expect($payment->status)->toBe(Payment::STATUS_PAID)
        ->and($payment->paid_at)->not->toBeNull()
        ->and($payment->stripe_payment_intent_id)->toBe('pi_test_1');
});

it('fulfils a payment only once when Stripe retries', function () {
    $payment = pendingPayment(['purpose' => Payment::PURPOSE_SUBSCRIPTION, 'reference' => 'individual']);
    $payload = completedSessionPayload($payment->id);
    $header = signedHeader($payload);

    foreach (range(1, 3) as $ignored) {
        $this->call('POST', '/api/webhooks/stripe', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_STRIPE_SIGNATURE' => $header,
        ], $payload)->assertOk();
    }

    expect(Subscription::where('user_id', $payment->user_id)->count())->toBe(1);
});

it('starts a subscription and dates it a year out', function () {
    $payment = pendingPayment(['purpose' => Payment::PURPOSE_SUBSCRIPTION, 'reference' => 'individual']);
    $payload = completedSessionPayload($payment->id);

    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload),
    ], $payload)->assertOk();

    $subscription = Subscription::where('user_id', $payment->user_id)->firstOrFail();

    expect($subscription->status)->toBe(Subscription::STATUS_ACTIVE)
        ->and(now()->diffInDays($subscription->ends_at))->toBeGreaterThan(360);
});

it('extends a renewal from the current expiry rather than today', function () {
    $payment = pendingPayment(['purpose' => Payment::PURPOSE_SUBSCRIPTION, 'reference' => 'individual']);
    $existingEnd = now()->addMonths(3)->startOfSecond();

    Subscription::create([
        'user_id' => $payment->user_id,
        'plan_key' => 'individual',
        'audience' => 'individual',
        'period' => 'year',
        'status' => Subscription::STATUS_ACTIVE,
        'starts_at' => now()->subMonths(9),
        'ends_at' => $existingEnd,
    ]);

    $payload = completedSessionPayload($payment->id);
    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload),
    ], $payload)->assertOk();

    $renewal = Subscription::where('payment_id', $payment->id)->firstOrFail();

    expect($renewal->starts_at->timestamp)->toBe($existingEnd->timestamp)
        ->and($renewal->ends_at->timestamp)->toBe($existingEnd->copy()->addYear()->timestamp);
});

it('opens an article to everyone once its open-access charge is paid', function () {
    $article = Article::create([
        'legacy_id' => '9911',
        'title' => 'A gated article',
        'document_type' => 'Research Article',
        'status' => 'published',
        'volume' => '18',
        'issue' => '1',
        'publish_year' => 2027,
        'publish_date' => '2027-02-01',
    ]);

    $payment = pendingPayment(['purpose' => Payment::PURPOSE_APC, 'reference' => '9911']);
    $payload = completedSessionPayload($payment->id);

    $this->call('POST', '/api/webhooks/stripe', [], [], [], [
        'CONTENT_TYPE' => 'application/json',
        'HTTP_STRIPE_SIGNATURE' => signedHeader($payload),
    ], $payload)->assertOk();

    $article->refresh();
    expect($article->is_open_access)->toBeTrue()
        ->and($article->apc_status)->toBe('paid');

    $this->getJson('/api/articles/9911/access-state')->assertJsonPath('data.free', true);
});
