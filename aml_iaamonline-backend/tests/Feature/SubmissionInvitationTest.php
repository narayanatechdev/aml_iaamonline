<?php

use App\Models\Setting;
use App\Models\SubmissionInvitation;
use App\Models\User;
use App\Services\SubmissionGateService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;

uses(RefreshDatabase::class);

function openWindow(): void
{
    Setting::setValue(SubmissionGateService::SETTING_KEY, ['invited_only_from' => '2099-01-01']);
}

function closedWindow(): void
{
    Setting::setValue(SubmissionGateService::SETTING_KEY, ['invited_only_from' => '2000-01-01']);
}

function makeInvitation(array $attributes = []): SubmissionInvitation
{
    return SubmissionInvitation::create(array_merge([
        'code' => SubmissionInvitation::generateCode(),
        'email' => 'author@example.edu',
        'invited_name' => 'Dr Author',
    ], $attributes));
}

describe('the invited-only window', function () {
    it('is open to everyone before the start date', function () {
        openWindow();

        expect(app(SubmissionGateService::class)->isInvitedOnly())->toBeFalse();
    });

    it('closes on and after the start date', function () {
        closedWindow();

        expect(app(SubmissionGateService::class)->isInvitedOnly())->toBeTrue();
    });

    it('needs no code while the window is open', function () {
        openWindow();

        expect(app(SubmissionGateService::class)->redeem(null))->toBeNull();
    });

    it('refuses a submission with no code once the window closes', function () {
        closedWindow();

        app(SubmissionGateService::class)->redeem(null);
    })->throws(ValidationException::class);

    it('refuses an unknown code', function () {
        closedWindow();

        app(SubmissionGateService::class)->redeem('AML-NOPE');
    })->throws(ValidationException::class);

    it('refuses a code that has already been used', function () {
        closedWindow();
        $invitation = makeInvitation(['used_at' => now()->subDay()]);

        app(SubmissionGateService::class)->redeem($invitation->code);
    })->throws(ValidationException::class);

    it('refuses an expired code', function () {
        closedWindow();
        $invitation = makeInvitation(['expires_at' => now()->subDay()]);

        app(SubmissionGateService::class)->redeem($invitation->code);
    })->throws(ValidationException::class);

    it('accepts a valid code', function () {
        closedWindow();
        $invitation = makeInvitation();

        expect(app(SubmissionGateService::class)->redeem($invitation->code)?->id)->toBe($invitation->id);
    });
});

describe('the public gate endpoints', function () {
    it('reports the gate state', function () {
        closedWindow();

        $this->getJson('/api/submission-gate')
            ->assertOk()
            ->assertJsonPath('data.invited_only', true);
    });

    it('verifies a good code', function () {
        $invitation = makeInvitation(['article_type' => 'Review']);

        $this->postJson('/api/submission-gate/verify', ['code' => $invitation->code])
            ->assertOk()
            ->assertJsonPath('data.valid', true)
            ->assertJsonPath('data.article_type', 'Review');
    });

    it('turns away a used code', function () {
        $invitation = makeInvitation(['used_at' => now()]);

        $this->postJson('/api/submission-gate/verify', ['code' => $invitation->code])
            ->assertStatus(422)
            ->assertJsonPath('data.valid', false);
    });
});

describe('issuing invitations', function () {
    it('refuses an ordinary member', function () {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/admin/submission-invitations', ['email' => 'author@example.edu'])
            ->assertForbidden();
    });

    it('refuses an anonymous visitor', function () {
        $this->postJson('/api/admin/submission-invitations', ['email' => 'author@example.edu'])
            ->assertUnauthorized();
    });
});
