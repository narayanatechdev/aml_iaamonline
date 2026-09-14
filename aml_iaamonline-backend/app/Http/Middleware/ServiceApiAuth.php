<?php

namespace App\Http\Middleware;

use App\Models\ServiceClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authenticates a calling SYSTEM (the IAAM Portal, eventually AMP) for the
 * service-to-service fetch API — separate from user login. The caller sends
 * its key as a bearer token; on success $request gets a `service_client`
 * attribute controllers can read for auditing.
 */
class ServiceApiAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->bearerToken();

        if (! $key) {
            return response()->json(['message' => 'Unauthorized. No service API key provided.'], 401);
        }

        $client = ServiceClient::findByPlainKey($key);

        if (! $client) {
            return response()->json(['message' => 'Unauthorized. Invalid or inactive service API key.'], 401);
        }

        $client->update(['last_used_at' => now()]);
        $request->attributes->set('service_client', $client);

        return $next($request);
    }
}
