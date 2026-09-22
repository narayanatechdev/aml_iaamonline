<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\SubmissionInvitation;
use Illuminate\Validation\ValidationException;

/**
 * The invited-only submission window.
 *
 * From the configured start date the journal publishes invited contributions
 * only, so a manuscript may not be submitted without a valid invitation code.
 * Before that date submissions stay open to everyone.
 */
class SubmissionGateService
{
    public const SETTING_KEY = 'submission_gate';

    /** @return array{invited_only_from: string, invited_only: bool, message: string} */
    public function state(): array
    {
        $settings = $this->settings();
        $from = $settings['invited_only_from'];

        return [
            'invited_only_from' => $from,
            'invited_only' => $this->isInvitedOnly(),
            'message' => $settings['message'],
        ];
    }

    public function isInvitedOnly(): bool
    {
        $settings = $this->settings();

        if (! ($settings['enabled'] ?? true)) {
            return false;
        }

        return now()->greaterThanOrEqualTo($settings['invited_only_from']);
    }

    /**
     * Redeem a code for a submission, or fail validation explaining why not.
     * Returns null when the window is open and no code is required.
     */
    public function redeem(?string $code): ?SubmissionInvitation
    {
        if (! $this->isInvitedOnly()) {
            return null;
        }

        if (blank($code)) {
            throw ValidationException::withMessages([
                'invitation_code' => $this->settings()['message'],
            ]);
        }

        $invitation = SubmissionInvitation::where('code', $code)->first();

        if ($invitation === null || ! $invitation->isRedeemable()) {
            throw ValidationException::withMessages([
                'invitation_code' => 'That invitation code is not valid or has already been used.',
            ]);
        }

        return $invitation;
    }

    /** @return array{enabled: bool, invited_only_from: string, message: string} */
    private function settings(): array
    {
        $stored = Setting::getValue(self::SETTING_KEY, []);

        return array_merge([
            'enabled' => true,
            'invited_only_from' => '2027-01-01',
            'message' => 'From Volume 18 the journal publishes invited contributions only. Enter the invitation code from your handling editor, or send a manuscript proposal to ask for an invitation.',
        ], is_array($stored) ? $stored : []);
    }
}
