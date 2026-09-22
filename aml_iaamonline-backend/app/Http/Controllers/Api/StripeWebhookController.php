<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Payment;
use App\Models\Subscription;
use App\Services\ArticleAccessService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Fulfils Stripe Checkout payments.
 *
 * Stripe is the only source of truth for whether money actually moved, so
 * access is granted here rather than when the reader returns to the site.
 */
class StripeWebhookController extends Controller
{
    public function __construct(
        private readonly StripeService $stripe,
        private readonly ArticleAccessService $access,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        if (! $this->stripe->verifyWebhookSignature($request->getContent(), $request->header('Stripe-Signature'))) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $event = $request->json()->all();

        if (($event['type'] ?? null) !== 'checkout.session.completed') {
            return response()->json(['received' => true]);
        }

        $session = $event['data']['object'] ?? [];
        $payment = $this->resolvePayment($session);

        if ($payment === null) {
            Log::warning('Stripe webhook: no matching payment.', ['session' => $session['id'] ?? null]);

            return response()->json(['received' => true]);
        }

        // Stripe retries webhooks, so fulfilment must run at most once.
        if ($payment->status === Payment::STATUS_PAID) {
            return response()->json(['received' => true]);
        }

        DB::transaction(function () use ($payment, $session) {
            $payment->update([
                'status' => Payment::STATUS_PAID,
                'paid_at' => now(),
                'stripe_payment_intent_id' => $session['payment_intent'] ?? null,
            ]);

            match ($payment->purpose) {
                Payment::PURPOSE_SUBSCRIPTION => $this->grantSubscription($payment),
                Payment::PURPOSE_APC => $this->openArticleAccess($payment),
                default => null, // article purchases are read straight off the payments table
            };
        });

        return response()->json(['received' => true]);
    }

    private function resolvePayment(array $session): ?Payment
    {
        $paymentId = $session['metadata']['payment_id'] ?? null;

        if ($paymentId !== null) {
            return Payment::find($paymentId);
        }

        return isset($session['id'])
            ? Payment::where('stripe_session_id', $session['id'])->first()
            : null;
    }

    private function grantSubscription(Payment $payment): void
    {
        $plan = collect($this->access->settings()['plans'] ?? [])->firstWhere('key', $payment->reference);
        $period = $plan['period'] ?? 'year';

        // Renewals extend from the current expiry rather than from today.
        $current = Subscription::query()->active()->where('user_id', $payment->user_id)->latest('ends_at')->first();
        $startsAt = $current?->ends_at && $current->ends_at->isFuture() ? $current->ends_at : now();

        Subscription::create([
            'user_id' => $payment->user_id,
            'payment_id' => $payment->id,
            'plan_key' => $payment->reference,
            'audience' => $plan['audience'] ?? 'individual',
            'period' => $period,
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => $startsAt,
            'ends_at' => $period === 'month' ? $startsAt->copy()->addMonth() : $startsAt->copy()->addYear(),
        ]);
    }

    private function openArticleAccess(Payment $payment): void
    {
        Article::where('legacy_id', $payment->reference)
            ->orWhere('id', $payment->reference)
            ->update(['is_open_access' => true, 'apc_status' => 'paid']);
    }
}
