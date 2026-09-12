<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Peer-review workflow cadence, editable from Admin → Settings → Workflow
 * and consumed by the daily reviews:send-reminders scheduler.
 */
class WorkflowSettingsController extends Controller
{
    public const SETTING_KEY = 'workflow';

    /** @return array{review_deadline_days: int, invite_response_days: int, invite_reminder_after_days: int, due_soon_reminder_days: int} */
    public static function defaults(): array
    {
        return [
            'review_deadline_days' => 21,
            'invite_response_days' => 7,
            'invite_reminder_after_days' => 3,
            'due_soon_reminder_days' => 7,
        ];
    }

    /** @return array{review_deadline_days: int, invite_response_days: int, invite_reminder_after_days: int, due_soon_reminder_days: int} */
    public static function current(): array
    {
        $stored = Setting::getValue(self::SETTING_KEY, []);

        return array_merge(self::defaults(), is_array($stored) ? $stored : []);
    }

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('settings:view'), 403, 'Not authorized.');

        return response()->json(['data' => self::current()]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->hasPermission('settings:edit'), 403, 'Not authorized.');

        $validated = $request->validate([
            'review_deadline_days' => ['required', 'integer', 'min:1', 'max:365'],
            'invite_response_days' => ['required', 'integer', 'min:1', 'max:90'],
            'invite_reminder_after_days' => ['required', 'integer', 'min:1', 'max:90'],
            'due_soon_reminder_days' => ['required', 'integer', 'min:1', 'max:90'],
        ]);

        Setting::setValue(self::SETTING_KEY, $validated);

        return response()->json(['data' => $validated]);
    }
}
