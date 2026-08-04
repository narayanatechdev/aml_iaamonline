<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Per-member article access allowances.
 *
 * Signed-in members consume one unit of their tier's daily/monthly allowance
 * per distinct article per day; admins and editorial staff are exempt. The
 * allowances come from the admin-managed access_model setting.
 */
class ArticleAccessController extends Controller
{
    /**
     * Check (and record) access to an article's full text for the
     * authenticated user. Returns whether access is allowed plus the
     * remaining daily/monthly allowance.
     */
    public function check(Request $request, int $articleId): JsonResponse
    {
        $user = $request->user();
        $model = Setting::getValue(AccessSettingsController::SETTING_KEY, AccessSettingsController::defaults());

        // Gate off, or privileged users: unlimited access.
        if (! ($model['enabled'] ?? true) || $user->hasAnyRole(['admin', 'editor', 'managing_editor', 'publisher'])) {
            return response()->json(['data' => [
                'allowed' => true,
                'unlimited' => true,
            ]]);
        }

        $tiers = collect($model['tiers'] ?? []);
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
            'tier' => $tier['key'] ?? null,
            'remaining_today' => max(0, $dailyLimit - $usedToday),
            'remaining_month' => max(0, $monthlyLimit - $usedThisMonth),
        ]]);
    }
}
