<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\ArticleAccessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Per-member article access allowances.
 *
 * Articles published before the paywall cut-off are free for everyone and
 * never touch a member's allowance. Beyond the cut-off, signed-in members
 * consume one unit of their tier's daily/monthly allowance per distinct
 * article per day, unless they hold a subscription or have bought that
 * article outright; editorial staff are exempt.
 */
class ArticleAccessController extends Controller
{
    public function __construct(private readonly ArticleAccessService $access) {}

    /**
     * The gating state of an article for any visitor, signed in or not.
     * Consumes nothing — it only says what the reader is facing.
     */
    public function state(int $articleId): JsonResponse
    {
        $article = $this->findArticle($articleId);

        abort_if($article === null, 404, 'Article not found.');

        return response()->json(['data' => $this->access->publicState($article)]);
    }

    /**
     * Check (and record) access to an article's full text for the
     * authenticated user. Returns whether access is allowed plus the
     * remaining daily/monthly allowance.
     */
    public function check(Request $request, int $articleId): JsonResponse
    {
        $user = $request->user();
        $settings = $this->access->settings();

        if (! ($settings['enabled'] ?? true)) {
            return $this->unlimited('free');
        }

        $article = $this->findArticle($articleId);

        // Free-to-read articles, privileged staff, subscribers and readers who
        // bought this article all pass without spending an allowance.
        if ($article && $this->access->isFreeToRead($article, $settings)) {
            return $this->unlimited('free');
        }

        if ($this->access->isPrivileged($user)) {
            return $this->unlimited('staff');
        }

        if ($this->access->hasActiveSubscription($user)) {
            return $this->unlimited('subscription');
        }

        if ($this->access->hasPurchased($user, $articleId)) {
            return $this->unlimited('purchase');
        }

        $tiers = collect($settings['tiers'] ?? []);
        $tier = $tiers->firstWhere('key', $user->membership_tier) ?? $tiers->first();

        $dailyLimit = (int) ($tier['daily_limit'] ?? 0);
        $monthlyLimit = (int) ($tier['monthly_limit'] ?? 0);

        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        $alreadyToday = DB::table('article_access_logs')
            ->where('user_id', $user->id)
            ->where('article_id', $articleId)
            ->where('accessed_on', $today)
            ->exists();

        $usedToday = DB::table('article_access_logs')
            ->where('user_id', $user->id)
            ->where('accessed_on', $today)
            ->count();

        $usedThisMonth = DB::table('article_access_logs')
            ->where('user_id', $user->id)
            ->where('accessed_on', '>=', $monthStart)
            ->count();

        // Re-reading an article already opened today is always allowed.
        $allowed = $alreadyToday || ($usedToday < $dailyLimit && $usedThisMonth < $monthlyLimit);

        if ($allowed && ! $alreadyToday) {
            DB::table('article_access_logs')->insertOrIgnore([
                'user_id' => $user->id,
                'article_id' => $articleId,
                'accessed_on' => $today,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $usedToday++;
            $usedThisMonth++;
        }

        return response()->json(['data' => [
            'allowed' => $allowed,
            'unlimited' => false,
            'reason' => 'membership',
            'tier' => $tier['key'] ?? null,
            'remaining_today' => max(0, $dailyLimit - $usedToday),
            'remaining_month' => max(0, $monthlyLimit - $usedThisMonth),
            'price' => (float) ($settings['article_price'] ?? 0),
            'currency' => $settings['currency'] ?? 'EUR',
        ]]);
    }

    private function findArticle(int $articleId): ?Article
    {
        return Article::where('legacy_id', $articleId)->orWhere('id', $articleId)->first();
    }

    private function unlimited(string $reason): JsonResponse
    {
        return response()->json(['data' => [
            'allowed' => true,
            'unlimited' => true,
            'reason' => $reason,
        ]]);
    }
}
