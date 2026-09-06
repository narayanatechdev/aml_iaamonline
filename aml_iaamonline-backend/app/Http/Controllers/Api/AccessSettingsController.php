<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Subscription / access-model configuration.
 *
 * The journal operates on a membership + subscription model: IAAM members
 * receive daily/monthly article access allowances by membership tier, and
 * non-members subscribe or purchase access. The tier limits are editable
 * from the admin dashboard at any time (per the Editor-in-Chief's request),
 * so they live in the settings table rather than in code.
 */
class AccessSettingsController extends Controller
{
    public const SETTING_KEY = 'access_model';

    /** Default access model used until an admin saves a custom one. */
    public static function defaults(): array
    {
        return [
            'enabled' => true,
            'preview' => 'abstract', // what non-subscribers see on an article page
            'tiers' => [
                ['key' => 'regular',       'label' => 'Regular Member',       'daily_limit' => 5,  'monthly_limit' => 100],
                ['key' => 'fellow',        'label' => 'Fellow Member',        'daily_limit' => 10, 'monthly_limit' => 200],
                ['key' => 'distinguished', 'label' => 'Distinguished Fellow', 'daily_limit' => 15, 'monthly_limit' => 300],
                ['key' => 'industry',      'label' => 'Industry Member',      'daily_limit' => 15, 'monthly_limit' => 300],
                ['key' => 'institutional', 'label' => 'Institutional Member', 'daily_limit' => 25, 'monthly_limit' => 500],
            ],
            // Subscription plans & fees (prices are placeholders until an
            // admin sets real ones in Settings → Access & Subscription).
            'plans' => [
                [
                    'key' => 'individual',
                    'name' => 'Individual Subscription',
                    'audience' => 'individual',
                    'price' => 199,
                    'currency' => 'USD',
                    'period' => 'year',
                    'description' => 'Full-text access for a single reader.',
                    'benefits' => ['Unlimited full-text article access', 'New-issue email alerts', 'Citation export tools'],
                    'featured' => false,
                ],
                [
                    'key' => 'institutional',
                    'name' => 'Institutional Subscription',
                    'audience' => 'institutional',
                    'price' => 999,
                    'currency' => 'USD',
                    'period' => 'year',
                    'description' => 'Campus-wide access for universities, libraries, and R&D organisations.',
                    'benefits' => ['Unlimited access for all campus users', 'IP-range based authentication', 'Usage reporting for librarians', 'Priority support'],
                    'featured' => true,
                ],
            ],
            'article_price' => 35,
            'currency' => 'USD',
            'contact_email' => 'aml@iaamonline.org',
        ];
    }

    /** Stored settings merged over defaults, so newly added keys always exist. */
    private static function current(): array
    {
        $stored = Setting::getValue(self::SETTING_KEY, []);

        return array_merge(self::defaults(), is_array($stored) ? $stored : []);
    }

    /** Public: the access model, for pricing/membership pages and article gating UI. */
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => self::current(),
        ]);
    }

    /** Admin: same payload, gated by settings:view. */
    public function adminShow(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('settings:view'), 403, 'Not authorized.');

        return response()->json([
            'data' => self::current(),
        ]);
    }

    /** Admin: update tier limits / toggle the model, gated by settings:edit. */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('settings:edit'), 403, 'Not authorized.');

        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'preview' => ['required', 'in:abstract,none'],
            'tiers' => ['required', 'array', 'min:1'],
            'tiers.*.key' => ['required', 'string', 'max:50'],
            'tiers.*.label' => ['required', 'string', 'max:100'],
            'tiers.*.daily_limit' => ['required', 'integer', 'min:0', 'max:10000'],
            'tiers.*.monthly_limit' => ['required', 'integer', 'min:0', 'max:100000'],
            'plans' => ['present', 'array'],
            'plans.*.key' => ['required', 'string', 'max:50'],
            'plans.*.name' => ['required', 'string', 'max:100'],
            'plans.*.audience' => ['required', 'in:individual,institutional'],
            'plans.*.price' => ['required', 'numeric', 'min:0', 'max:1000000'],
            'plans.*.currency' => ['required', 'string', 'size:3'],
            'plans.*.period' => ['required', 'in:year,month'],
            'plans.*.description' => ['nullable', 'string', 'max:500'],
            'plans.*.benefits' => ['present', 'array'],
            'plans.*.benefits.*' => ['string', 'max:200'],
            'plans.*.featured' => ['required', 'boolean'],
            'article_price' => ['required', 'numeric', 'min:0', 'max:100000'],
            'currency' => ['required', 'string', 'size:3'],
            'contact_email' => ['required', 'email', 'max:255'],
        ]);

        $planKeys = array_column($validated['plans'], 'key');
        if (count($planKeys) !== count(array_unique($planKeys))) {
            throw ValidationException::withMessages(['plans' => 'Plan keys must be unique.']);
        }

        $keys = array_column($validated['tiers'], 'key');
        if (count($keys) !== count(array_unique($keys))) {
            throw ValidationException::withMessages(['tiers' => 'Tier keys must be unique.']);
        }

        Setting::setValue(self::SETTING_KEY, $validated);

        return response()->json(['data' => $validated]);
    }
}
