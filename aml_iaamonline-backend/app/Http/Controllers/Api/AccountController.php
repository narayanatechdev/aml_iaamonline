<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Manuscript;
use App\Services\ManuscriptSubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AccountController extends Controller
{
    private const PROFILE_FIELDS = [
        'id', 'name', 'email', 'first_name', 'last_name', 'degree',
        'position', 'affiliation', 'orcid', 'phone', 'country', 'city',
    ];

    /**
     * Return the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'user' => $user->only(self::PROFILE_FIELDS),
            'roles' => $user->getRoleNames(),
        ]);
    }

    /**
     * Update the authenticated user's profile details.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'affiliation' => ['nullable', 'string', 'max:255'],
            'orcid' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated.',
            'user' => $user->only(self::PROFILE_FIELDS),
        ]);
    }

    /**
     * Change the authenticated user's password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Your current password is incorrect.',
            ], 422);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        return response()->json(['success' => true, 'message' => 'Password updated.']);
    }

    /**
     * Show one of the author's manuscripts with reviews/feedback (for the revision view).
     */
    public function manuscriptDetail(Request $request, int $id): JsonResponse
    {
        $manuscript = Manuscript::where('author_email', $request->user()->email)
            ->with(['files', 'reviews'])
            ->findOrFail($id);

        $data = $manuscript->toArray();
        $data['reviews'] = app(ManuscriptSubmissionService::class)->reviewsForAuthor($manuscript);

        return response()->json(['data' => $data]);
    }

    /**
     * Submit a revision: response to reviewers + revised files. Increments the
     * round, re-attaches files, returns the manuscript to under review and
     * resets reviewer assignments for another look.
     */
    public function revise(Request $request, int $id, ManuscriptSubmissionService $submissions): JsonResponse
    {
        $manuscript = Manuscript::where('author_email', $request->user()->email)->findOrFail($id);

        if (ManuscriptSubmissionService::normalizeStatus($manuscript->status) !== ManuscriptSubmissionService::AWAITING_REVISION) {
            return response()->json(['success' => false, 'message' => 'This manuscript is not awaiting a revision.'], 422);
        }

        $request->validate($submissions->revisionRules());

        $submissions->revise($manuscript, $request, $request->user()->email);

        return response()->json(['success' => true, 'message' => "Revision R{$manuscript->revision_round} submitted.", 'data' => $manuscript]);
    }

    private const STATUS_GROUPS = ManuscriptSubmissionService::STATUS_GROUPS;

    /**
     * List the authenticated author's own manuscripts with summary stats.
     */
    public function manuscripts(Request $request): JsonResponse
    {
        $email = $request->user()->email;

        $manuscripts = Manuscript::where('author_email', $email)
            ->latest('submitted_at')
            ->get(['id', 'submission_id', 'title', 'category', 'status', 'submitted_at']);

        $countIn = fn (array $statuses) => $manuscripts->whereIn('status', $statuses)->count();

        return response()->json([
            'data' => $manuscripts,
            'stats' => [
                'total' => $manuscripts->count(),
                'in_progress' => $countIn(self::STATUS_GROUPS['in_progress']),
                'awaiting_revision' => $countIn(self::STATUS_GROUPS['awaiting_revision']),
                'decided' => $countIn(self::STATUS_GROUPS['decided']),
            ],
        ]);
    }
}
