<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubmissionInvitation;
use App\Services\SubmissionGateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Invitation codes for the invited-only submission window.
 *
 * Editors issue a code to an author they have commissioned; the author enters
 * it when submitting. Codes are single-use and may carry an expiry.
 */
class SubmissionInvitationController extends Controller
{
    public function __construct(private readonly SubmissionGateService $gate) {}

    /** Public: whether submissions are currently gated, for the submit form. */
    public function gateState(): JsonResponse
    {
        return response()->json(['data' => $this->gate->state()]);
    }

    /** Public: check a code before the author fills in the whole form. */
    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:40'],
        ]);

        $invitation = SubmissionInvitation::where('code', $validated['code'])->first();

        if ($invitation === null || ! $invitation->isRedeemable()) {
            return response()->json([
                'data' => ['valid' => false, 'message' => 'That invitation code is not valid or has already been used.'],
            ], 422);
        }

        return response()->json(['data' => [
            'valid' => true,
            'invited_name' => $invitation->invited_name,
            'article_type' => $invitation->article_type,
            'scope_note' => $invitation->scope_note,
            'expires_at' => $invitation->expires_at,
        ]]);
    }

    /** Admin: list issued invitations. */
    public function index(Request $request): JsonResponse
    {
        $this->authorizeEditorial($request);

        return response()->json([
            'data' => SubmissionInvitation::with('issuer:id,name')->latest()->paginate(25),
        ]);
    }

    /** Admin: issue a new invitation code. */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeEditorial($request);

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'invited_name' => ['nullable', 'string', 'max:255'],
            'article_type' => ['nullable', 'string', 'max:50'],
            'scope_note' => ['nullable', 'string', 'max:2000'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ]);

        $invitation = SubmissionInvitation::create([
            ...$validated,
            'code' => SubmissionInvitation::generateCode(),
            'issued_by' => $request->user()->id,
        ]);

        return response()->json(['data' => $invitation], 201);
    }

    /** Admin: withdraw an unused invitation. */
    public function destroy(Request $request, SubmissionInvitation $invitation): JsonResponse
    {
        $this->authorizeEditorial($request);

        abort_if($invitation->used_at !== null, 422, 'That invitation has already been used.');

        $invitation->delete();

        return response()->json(['message' => 'Invitation withdrawn.']);
    }

    private function authorizeEditorial(Request $request): void
    {
        $user = $request->user();

        abort_unless(
            $user && $user->hasAnyRole(['admin', 'editor', 'managing_editor', 'publisher']),
            403,
            'Not authorized.'
        );
    }
}
