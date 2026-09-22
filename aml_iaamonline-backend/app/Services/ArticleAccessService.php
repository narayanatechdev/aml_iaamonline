<?php

namespace App\Services;

use App\Http\Controllers\Api\AccessSettingsController;
use App\Models\Article;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Subscription;
use App\Models\User;

/**
 * Decides who may read an article's full text.
 *
 * The journal's access model: everything published up to the free-access
 * cut-off (Volumes 1-17, 2010-2026) stays free to read forever, as does any
 * article whose authors took the optional open-access route. Only articles
 * beyond the cut-off are gated, and a reader passes that gate through IAAM
 * membership, an active subscription, or a single-article purchase.
 */
class ArticleAccessService
{
    /** @return array{enabled: bool, preview: string, free_until_volume: int, free_until_year: int, tiers: array, article_price: float, currency: string} */
    public function settings(): array
    {
        $stored = Setting::getValue(AccessSettingsController::SETTING_KEY, []);

        return array_merge(AccessSettingsController::defaults(), is_array($stored) ? $stored : []);
    }

    /**
     * Whether an article is outside the paywall entirely — free for everyone,
     * signed in or not, and never counted against a member's allowance.
     */
    public function isFreeToRead(Article $article, ?array $settings = null): bool
    {
        $settings ??= $this->settings();

        if (! ($settings['enabled'] ?? true)) {
            return true;
        }

        if ($article->is_open_access) {
            return true;
        }

        $volume = (int) $article->volume;
        $freeUntilVolume = (int) ($settings['free_until_volume'] ?? 0);

        if ($volume > 0 && $freeUntilVolume > 0 && $volume <= $freeUntilVolume) {
            return true;
        }

        $year = (int) $article->publish_year;
        $freeUntilYear = (int) ($settings['free_until_year'] ?? 0);

        return $year > 0 && $freeUntilYear > 0 && $year <= $freeUntilYear;
    }

    /** Whether the reader has bought permanent access to this one article. */
    public function hasPurchased(?User $user, int|string $articleId): bool
    {
        if (! $user) {
            return false;
        }

        return Payment::query()
            ->paid()
            ->where('purpose', Payment::PURPOSE_ARTICLE)
            ->where('reference', (string) $articleId)
            ->where('user_id', $user->id)
            ->exists();
    }

    /** Whether the reader holds a subscription that is currently in force. */
    public function hasActiveSubscription(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return Subscription::query()->active()->where('user_id', $user->id)->exists();
    }

    /** Editorial staff always read everything. */
    public function isPrivileged(?User $user): bool
    {
        return (bool) $user?->hasAnyRole(['admin', 'editor', 'managing_editor', 'publisher']);
    }

    /**
     * The public gating state of an article, for readers who are not signed in
     * and for rendering the paywall before any allowance is consumed.
     *
     * @return array{free: bool, gated: bool, is_open_access: bool, is_invited: bool, price: float, currency: string, preview: string}
     */
    public function publicState(Article $article): array
    {
        $settings = $this->settings();
        $free = $this->isFreeToRead($article, $settings);

        return [
            'free' => $free,
            'gated' => ! $free,
            'is_open_access' => (bool) $article->is_open_access,
            'is_invited' => (bool) $article->is_invited,
            'price' => (float) ($settings['article_price'] ?? 0),
            'currency' => $settings['currency'] ?? 'EUR',
            'preview' => $settings['preview'] ?? 'abstract',
        ];
    }
}
