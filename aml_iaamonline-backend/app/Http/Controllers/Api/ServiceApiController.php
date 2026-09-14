<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ServiceClient;
use App\Models\User;
use App\Services\IaamIdService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Service-to-service fetch API: what AML has on a person, keyed by their
 * IAAM ID. Called by other systems (the IAAM Portal, eventually AMP) —
 * never by an end user's own browser. Read-only. See ServiceApiAuth for
 * the caller authentication and the portal restructure plan for how this
 * fits the wider "Portal owns identity, journals own content, fetched on
 * demand" architecture.
 */
class ServiceApiController extends Controller
{
    public function __construct(private IaamIdService $iaamIds) {}

    /** AML's profile for one IAAM ID: role, academic profile, submission summary. */
    public function showUser(Request $request, string $iaamId): JsonResponse
    {
        if (! $this->iaamIds->isValid($iaamId)) {
            return response()->json(['message' => 'Malformed IAAM ID.'], 422);
        }

        $user = User::where('iaam_id', $iaamId)->first();

        if (! $user) {
            return response()->json(['message' => 'No AML account for this IAAM ID.'], 404);
        }

        $manuscriptCount = Manuscript::where('author_email', $user->email)->count();

        $this->logFetch($request, $user, 'user_profile');

        return response()->json([
            'data' => [
                'iaam_id' => $user->iaam_id,
                'aml_user_id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'title' => $user->title,
                'degree' => $user->degree,
                'position' => $user->position,
                'specialty' => $user->specialty,
                'orcid' => $user->orcid,
                'affiliation' => $user->affiliation,
                'country' => $user->country,
                'membership_tier' => $user->membership_tier,
                'is_reviewer' => $user->is_reviewer,
                'roles' => $user->getRoleNames(),
                'author_id' => $user->authorProfile?->id,
                'published_article_count' => $user->authorProfile?->article_count ?? 0,
                'manuscript_submission_count' => $manuscriptCount,
                'join_date' => optional($user->join_date)->toDateString(),
            ],
        ]);
    }

    /** Same as showUser(), looked up by email instead — for a caller that only has an address. */
    public function showUserByEmail(Request $request, string $email): JsonResponse
    {
        $user = User::whereRaw('lower(email) = ?', [strtolower($email)])->first();

        if (! $user) {
            return response()->json(['message' => 'No AML account for this email.'], 404);
        }

        if (blank($user->iaam_id)) {
            // Every user gets an iaam_id on creation now; a blank one here
            // means a pre-migration row the backfill command hasn't reached.
            return response()->json(['message' => 'This AML account has no IAAM ID yet.'], 409);
        }

        return $this->showUser($request, $user->iaam_id);
    }

    private function logFetch(Request $request, User $user, string $resource): void
    {
        /** @var ServiceClient|null $client */
        $client = $request->attributes->get('service_client');

        AuditLog::create([
            'action' => 'service_fetch',
            'actor_email' => $client ? "service:{$client->name}" : 'service:unknown',
            'actor_type' => 'service_client',
            'description' => "Fetched {$resource} for {$user->iaam_id} ({$user->email})",
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);
    }
}
