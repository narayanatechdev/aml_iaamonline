<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\ReviewToken;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ReviewerController extends Controller
{
    /**
     * Step 1: Verify email and send 6-digit code.
     */
    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $email = $validated['email'];

        // Check for active review assignments
        $assignments = ReviewAssignment::where('reviewer_email', $email)
            ->whereIn('status', ['invited', 'accepted'])
            ->get();

        if ($assignments->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No active assignments found for this email.',
            ], 404);
        }

        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(10);

        foreach ($assignments as $assignment) {
            VerificationCode::create([
                'review_assignment_id' => $assignment->id,
                'code' => $code, // In production, hash this.
                'code_hash' => Hash::make($code),
                'reviewer_email' => $email,
                'expires_at' => $expiresAt,
            ]);
        }

        // Log the code for development (in production, send email)
        Log::info("Verification code for {$email}: {$code}");

        return response()->json([
            'success' => true,
            'message' => 'Verification code sent to your email.',
        ]);
    }

    /**
     * Step 2: Verify code and return access token.
     */
    public function verifyCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $verification = VerificationCode::where('reviewer_email', $validated['email'])
            ->where('code', $validated['code'])
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (! $verification) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code.',
            ], 401);
        }

        $verification->update([
            'is_used' => true,
            'used_at' => now(),
        ]);

        // Generate a random token for future requests
        $token = Str::random(64);

        ReviewToken::create([
            'token' => $token,
            'token_hash' => Hash::make($token),
            'review_assignment_id' => $verification->review_assignment_id,
            'reviewer_email' => $validated['email'],
            'expires_at' => now()->addHours(24),
            'ip_addresses' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'token' => $token,
            'message' => 'Verification successful.',
        ]);
    }

    /**
     * Get all manuscripts assigned to the reviewer.
     */
    public function manuscripts(Request $request)
    {
        $email = $request->reviewer_email;

        $assignments = ReviewAssignment::where('reviewer_email', $email)
            ->whereIn('status', ['invited', 'accepted'])
            ->with(['manuscript' => function ($query) {
                $query->select('id', 'submission_id', 'title', 'authors', 'abstract', 'category', 'status', 'submitted_at');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $assignments,
        ]);
    }

    /**
     * Show a specific manuscript.
     */
    public function showManuscript(Request $request, $id)
    {
        $email = $request->reviewer_email;

        $assignment = ReviewAssignment::where('reviewer_email', $email)
            ->where('manuscript_id', $id)
            ->firstOrFail();

        $manuscript = Manuscript::with('files')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $manuscript,
        ]);
    }

    /**
     * Submit a review.
     */
    public function submitReview(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'recommendation' => 'required|in:accept,minor-revisions,major-revisions,reject',
            'strengths' => 'nullable|string',
            'weaknesses' => 'nullable|string',
            'comments' => 'nullable|string',
            'questions' => 'nullable|string',
            'quality_score' => 'nullable|integer|min:1|max:10',
            'novelty_score' => 'nullable|integer|min:1|max:10',
            'relevance_score' => 'nullable|integer|min:1|max:10',
        ]);

        $email = $request->reviewer_email;
        $assignmentId = $request->review_assignment_id;

        $review = Review::create([
            'review_assignment_id' => $assignmentId,
            'manuscript_id' => $validated['manuscript_id'],
            'reviewer_email' => $email,
            'recommendation' => $validated['recommendation'],
            'strengths' => $validated['strengths'],
            'weaknesses' => $validated['weaknesses'],
            'comments' => $validated['comments'],
            'questions' => $validated['questions'],
            'quality_score' => $validated['quality_score'],
            'novelty_score' => $validated['novelty_score'],
            'relevance_score' => $validated['relevance_score'],
            'is_submitted' => true,
            'submitted_at' => now(),
            'is_draft' => false,
            'ip_address' => $request->ip(),
        ]);

        // Update assignment status
        ReviewAssignment::where('id', $assignmentId)->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        AuditLog::create([
            'action' => 'review_submitted',
            'actor_email' => $email,
            'actor_type' => 'reviewer',
            'manuscript_id' => $validated['manuscript_id'],
            'description' => 'Review submitted for manuscript: '.$validated['manuscript_id'],
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully.',
        ]);
    }
}
