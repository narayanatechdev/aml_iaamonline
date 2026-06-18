<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

/**
 * ORCID OAuth (scaffold). Set ORCID_CLIENT_ID / ORCID_CLIENT_SECRET / ORCID_REDIRECT
 * in env + config/services.php to activate. Without them the routes return a clear
 * "not configured" response instead of failing.
 */
class OrcidController extends Controller
{
    public function redirect(): RedirectResponse|JsonResponse
    {
        $clientId = config('services.orcid.client_id');
        if (! $clientId) {
            return response()->json(['configured' => false, 'message' => 'ORCID OAuth is not configured.'], 501);
        }

        $params = http_build_query([
            'client_id' => $clientId,
            'response_type' => 'code',
            'scope' => '/authenticate',
            'redirect_uri' => config('services.orcid.redirect'),
        ]);

        return redirect('https://orcid.org/oauth/authorize?'.$params);
    }

    public function callback(): JsonResponse
    {
        // TODO: exchange the code for a token, fetch the ORCID iD, link to the user.
        return response()->json(['configured' => (bool) config('services.orcid.client_id')]);
    }
}
