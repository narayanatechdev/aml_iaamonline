<?php

namespace App\Http\Middleware;

use App\Models\ReviewToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewerTokenAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Unauthorized. No token provided.'], 401);
        }

        $reviewToken = ReviewToken::where('token', $token)
            ->where('is_revoked', false)
            ->where('expires_at', '>', now())
            ->first();

        if (! $reviewToken) {
            return response()->json(['message' => 'Unauthorized. Invalid or expired token.'], 401);
        }

        // Add the review token and assignment to the request for easy access in controllers
        $request->merge([
            'review_token' => $reviewToken,
            'review_assignment_id' => $reviewToken->review_assignment_id,
            'reviewer_email' => $reviewToken->reviewer_email,
        ]);

        // Update access stats
        $reviewToken->increment('access_count');
        $reviewToken->update([
            'last_accessed_at' => now(),
            'ip_addresses' => $request->ip(),
        ]);

        return $next($request);
    }
}
