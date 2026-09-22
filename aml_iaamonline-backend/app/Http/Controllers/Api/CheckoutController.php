<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Payment;
use App\Services\ArticleAccessService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use RuntimeException;

/**
 * Starts Stripe Checkout for the three things a reader or author can pay for:
 * a single gated article, a subscription plan, or the optional open-access
 * charge on their own accepted article.
 */
class CheckoutController extends Controller
{
    public function __construct(
        private readonly StripeService $stripe,
        private readonly ArticleAccessService $access,
    ) {}

    /** Buy permanent access to one gated article. */
    public function article(Request $request, int $articleId): JsonResponse
    {
        $user = $request->user();
        $article = Article::where('legacy_id', $articleId)->orWhere('id', $articleId)->first();

        abort_if($article === null, 404, 'Article not found.');

        $settings = $this->access->settings();

        if ($this->access->isFreeToRead($article, $settings)) {
            throw ValidationException::withMessages([
                'article' => 'This article is free to read — no purchase needed.',
            ]);
        }

        if ($this->access->hasPurchased($user, $articleId)) {
            throw ValidationException::withMessages([
                'article' => 'You have already purchased this article.',
            ]);
        }

        $currency = $settings['currency'] ?? 'EUR';
        $amountMinor = $this->toMinorUnits((float) ($settings['article_price'] ?? 0));

        return $this->startCheckout(
            purpose: Payment::PURPOSE_ARTICLE,
            reference: (string) $articleId,
            productName: 'Article access: '.strip_tags((string) $article->title),
            amountMinor: $amountMinor,
            currency: $currency,
            user: $user,
        );
    }

    /** Subscribe to one of the journal's plans. */
    public function subscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan_key' => ['required', 'string', 'max:50'],
        ]);

        $settings = $this->access->settings();
        $plan = collect($settings['plans'] ?? [])->firstWhere('key', $validated['plan_key']);

        if ($plan === null) {
            throw ValidationException::withMessages(['plan_key' => 'Unknown subscription plan.']);
        }

        return $this->startCheckout(
            purpose: Payment::PURPOSE_SUBSCRIPTION,
            reference: $plan['key'],
            productName: $plan['name'].' ('.$plan['period'].')',
            amountMinor: $this->toMinorUnits((float) $plan['price']),
            currency: $plan['currency'] ?? ($settings['currency'] ?? 'EUR'),
            user: $request->user(),
        );
    }

    /**
     * Pay the optional open-access charge on an accepted article, which makes
     * it free for every reader. Only the article's corresponding author (or
     * editorial staff) may start this.
     */
    public function apc(Request $request, int $articleId): JsonResponse
    {
        $user = $request->user();
        $article = Article::where('legacy_id', $articleId)->orWhere('id', $articleId)->first();

        abort_if($article === null, 404, 'Article not found.');

        $settings = $this->access->settings();
        $apc = $settings['apc'] ?? [];

        if (! ($apc['enabled'] ?? false)) {
            throw ValidationException::withMessages(['apc' => 'The open-access route is not currently open.']);
        }

        if ($article->is_open_access) {
            throw ValidationException::withMessages(['apc' => 'This article is already open access.']);
        }

        $isAuthor = $this->access->isPrivileged($user)
            || strcasecmp((string) $article->corresponding_author, (string) $user->email) === 0
            || strcasecmp((string) $article->corresponding_author, (string) $user->name) === 0;

        abort_unless($isAuthor, 403, 'Only the corresponding author can pay the open-access charge for this article.');

        $isReview = str_contains(strtolower((string) $article->document_type), 'review');
        $amount = (float) ($isReview ? ($apc['review'] ?? 0) : ($apc['research'] ?? 0));

        return $this->startCheckout(
            purpose: Payment::PURPOSE_APC,
            reference: (string) $articleId,
            productName: 'Open-access charge: '.strip_tags((string) $article->title),
            amountMinor: $this->toMinorUnits($amount),
            currency: $settings['currency'] ?? 'EUR',
            user: $user,
        );
    }

    /** The reader's own payment history and current subscription. */
    public function purchases(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json(['data' => [
            'payments' => Payment::where('user_id', $user->id)->latest()->get([
                'id', 'purpose', 'reference', 'amount_minor', 'currency', 'status', 'paid_at',
            ]),
            'subscription' => $user->subscriptions()->active()->latest('ends_at')->first(),
        ]]);
    }

    private function startCheckout(
        string $purpose,
        string $reference,
        string $productName,
        int $amountMinor,
        string $currency,
        $user,
    ): JsonResponse {
        if ($amountMinor <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'No price has been set for this yet. Please contact the editorial office.',
            ]);
        }

        $payment = Payment::create([
            'purpose' => $purpose,
            'reference' => $reference,
            'user_id' => $user->id,
            'email' => $user->email,
            'amount_minor' => $amountMinor,
            'currency' => strtoupper($currency),
            'status' => Payment::STATUS_PENDING,
        ]);

        try {
            $session = $this->stripe->createCheckoutSession(
                productName: $productName,
                amountMinor: $amountMinor,
                currency: $currency,
                customerEmail: $user->email,
                successUrl: $this->successUrl(),
                cancelUrl: $this->cancelUrl(),
                metadata: ['payment_id' => (string) $payment->id],
            );
        } catch (RuntimeException $e) {
            $payment->update(['status' => Payment::STATUS_FAILED]);

            return response()->json(['message' => $e->getMessage()], 503);
        }

        $payment->update(['stripe_session_id' => $session['id']]);

        return response()->json(['data' => [
            'checkout_url' => $session['url'],
            'payment_id' => $payment->id,
        ]]);
    }

    private function successUrl(): string
    {
        return config('services.stripe.success_url')
            ?: rtrim((string) config('app.frontend_url'), '/').'/account/purchases?status=success';
    }

    private function cancelUrl(): string
    {
        return config('services.stripe.cancel_url')
            ?: rtrim((string) config('app.frontend_url'), '/').'/subscribe?status=cancelled';
    }

    private function toMinorUnits(float $amount): int
    {
        return (int) round($amount * 100);
    }
}
