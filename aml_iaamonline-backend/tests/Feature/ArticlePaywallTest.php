<?php

use App\Models\Article;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Subscription;
use App\Models\User;
use App\Services\ArticleAccessService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeArticle(array $attributes = []): Article
{
    return Article::create(array_merge([
        'legacy_id' => (string) fake()->unique()->numberBetween(1000, 99999),
        'title' => 'An article',
        'document_type' => 'Research Article',
        'status' => 'published',
        'volume' => '18',
        'issue' => '1',
        'publish_year' => 2027,
        'publish_date' => '2027-01-15',
    ], $attributes));
}

describe('free-access cut-off', function () {
    it('keeps every volume up to the cut-off free to read', function () {
        $service = app(ArticleAccessService::class);

        foreach (['1', '9', '17'] as $volume) {
            $article = makeArticle(['volume' => $volume, 'publish_year' => 2020]);

            expect($service->isFreeToRead($article))->toBeTrue();
        }
    });

    it('gates volumes past the cut-off', function () {
        $article = makeArticle(['volume' => '18', 'publish_year' => 2027]);

        expect(app(ArticleAccessService::class)->isFreeToRead($article))->toBeFalse();
    });

    it('keeps articles published up to the cut-off year free even without a volume', function () {
        $article = makeArticle(['volume' => '', 'publish_year' => 2026]);

        expect(app(ArticleAccessService::class)->isFreeToRead($article))->toBeTrue();
    });

    it('treats an open-access article as free however new it is', function () {
        $article = makeArticle(['volume' => '25', 'publish_year' => 2035, 'is_open_access' => true]);

        expect(app(ArticleAccessService::class)->isFreeToRead($article))->toBeTrue();
    });

    it('leaves everything free while the access model is switched off', function () {
        Setting::setValue('access_model', ['enabled' => false]);

        $article = makeArticle(['volume' => '18', 'publish_year' => 2027]);

        expect(app(ArticleAccessService::class)->isFreeToRead($article))->toBeTrue();
    });
});

describe('public access state', function () {
    it('reports a pre-cut-off article as free', function () {
        $article = makeArticle(['volume' => '12', 'publish_year' => 2021]);

        $this->getJson("/api/articles/{$article->legacy_id}/access-state")
            ->assertOk()
            ->assertJsonPath('data.free', true)
            ->assertJsonPath('data.gated', false);
    });

    it('reports a post-cut-off article as gated, with its price', function () {
        $article = makeArticle(['volume' => '18', 'publish_year' => 2027]);

        $this->getJson("/api/articles/{$article->legacy_id}/access-state")
            ->assertOk()
            ->assertJsonPath('data.gated', true)
            ->assertJsonPath('data.price', 25)
            ->assertJsonPath('data.currency', 'EUR');
    });
});

describe('member allowance', function () {
    it('does not spend an allowance on a free article', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        $article = makeArticle(['volume' => '10', 'publish_year' => 2019]);

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.reason', 'free');

        expect(DB::table('article_access_logs')->count())->toBe(0);
    });

    it('spends an allowance on a gated article', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        $article = makeArticle();

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.allowed', true)
            ->assertJsonPath('data.reason', 'membership');

        expect(DB::table('article_access_logs')->count())->toBe(1);
    });

    it('lets a subscriber read a gated article without spending an allowance', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        Subscription::create([
            'user_id' => $user->id,
            'plan_key' => 'individual',
            'audience' => 'individual',
            'period' => 'year',
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addYear(),
        ]);
        $article = makeArticle();

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.reason', 'subscription');

        expect(DB::table('article_access_logs')->count())->toBe(0);
    });

    it('ignores a subscription that has run out', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        Subscription::create([
            'user_id' => $user->id,
            'plan_key' => 'individual',
            'audience' => 'individual',
            'period' => 'year',
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now()->subYears(2),
            'ends_at' => now()->subDay(),
        ]);
        $article = makeArticle();

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.reason', 'membership');
    });

    it('lets a reader who bought the article read it without spending an allowance', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        $article = makeArticle();

        Payment::create([
            'purpose' => Payment::PURPOSE_ARTICLE,
            'reference' => $article->legacy_id,
            'user_id' => $user->id,
            'email' => $user->email,
            'amount_minor' => 2500,
            'currency' => 'EUR',
            'status' => Payment::STATUS_PAID,
            'paid_at' => now(),
        ]);

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.reason', 'purchase');

        expect(DB::table('article_access_logs')->count())->toBe(0);
    });

    it('does not count an unpaid purchase', function () {
        $user = User::factory()->create(['membership_tier' => 'regular']);
        $article = makeArticle();

        Payment::create([
            'purpose' => Payment::PURPOSE_ARTICLE,
            'reference' => $article->legacy_id,
            'user_id' => $user->id,
            'email' => $user->email,
            'amount_minor' => 2500,
            'currency' => 'EUR',
            'status' => Payment::STATUS_PENDING,
        ]);

        $this->actingAs($user)
            ->getJson("/api/articles/{$article->legacy_id}/access")
            ->assertOk()
            ->assertJsonPath('data.reason', 'membership');
    });

    it('refuses a gated article once the daily allowance is gone', function () {
        Setting::setValue('access_model', [
            'tiers' => [['key' => 'regular', 'label' => 'Regular', 'daily_limit' => 1, 'monthly_limit' => 10]],
        ]);

        $user = User::factory()->create(['membership_tier' => 'regular']);
        $first = makeArticle();
        $second = makeArticle();

        $this->actingAs($user)->getJson("/api/articles/{$first->legacy_id}/access")
            ->assertJsonPath('data.allowed', true);

        $this->actingAs($user)->getJson("/api/articles/{$second->legacy_id}/access")
            ->assertJsonPath('data.allowed', false);
    });
});
