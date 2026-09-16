<?php

namespace App\Http\Middleware;

use App\Models\ServiceClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Runs after ServiceApiAuth: the authenticated service client must also hold
 * the named ability (e.g. `service.ability:manuscripts.write`). Keys are
 * read-only unless an operator grants more with service-clients:grant.
 */
class ServiceAbility
{
    public function handle(Request $request, Closure $next, string $ability): Response
    {
        /** @var ServiceClient|null $client */
        $client = $request->attributes->get('service_client');

        if (! $client?->hasAbility($ability)) {
            return response()->json(['message' => "This service key is not allowed to {$ability}."], 403);
        }

        return $next($request);
    }
}
