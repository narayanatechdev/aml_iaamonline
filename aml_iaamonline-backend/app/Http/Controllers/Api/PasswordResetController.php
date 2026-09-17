<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

/** Sets a new password from an emailed reset/setup link. */
class PasswordResetController extends Controller
{
    public function reset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset($validated, function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();

            // Signing in elsewhere with the old password should stop working.
            $user->tokens()->delete();
        });

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status), 'errors' => ['email' => [__($status)]]], 422);
        }

        AuditLog::create([
            'action' => 'password_reset',
            'actor_email' => $validated['email'],
            'actor_type' => 'user',
            'description' => 'Password set from an emailed link',
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json(['message' => 'Your password has been set. You can sign in now.']);
    }
}
