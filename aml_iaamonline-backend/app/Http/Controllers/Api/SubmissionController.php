<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Services\AuthorImageValidationService;
use App\Services\ManuscriptSubmissionService;
use App\Services\SubmissionGateService;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    /**
     * Store a newly created manuscript submission.
     */
    public function store(Request $request, ManuscriptSubmissionService $submissions, SubmissionGateService $gate)
    {
        $validated = $request->validate($submissions->rules());

        // During the invited-only window a manuscript needs a code from its
        // handling editor; the code is burned once the manuscript exists.
        $invitation = $gate->redeem($request->input('invitation_code'));

        $manuscript = $submissions->create($request, $validated);

        $invitation?->update(['used_at' => now(), 'manuscript_id' => $manuscript->id]);

        return response()->json([
            'success' => true,
            'submission_id' => $manuscript->submission_id,
            'message' => 'Manuscript submitted successfully',
            'data' => $manuscript->load('files'),
        ], 201);
    }

    /**
     * Get submission by ID and email verification.
     */
    public function show(Request $request)
    {
        $validated = $request->validate([
            'submission_id' => 'required|string',
            'email' => 'nullable|email',
        ]);

        $query = Manuscript::where('submission_id', $validated['submission_id']);

        if ($request->filled('email')) {
            $query->where('author_email', $validated['email']);
        }

        $manuscript = $query->first();

        if (! $manuscript) {
            return response()->json([
                'success' => false,
                'message' => 'Submission not found. Please verify your Submission ID and email address.',
            ], 404);
        }

        AuditLog::create([
            'action' => 'manuscript_viewed',
            'actor_email' => $request->input('email', 'anonymous'),
            'actor_type' => 'author',
            'manuscript_id' => $manuscript->id,
            'description' => 'Submission status checked',
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $manuscript->load('files'),
        ]);
    }

    /**
     * Upload author image for manuscript submission.
     */
    public function uploadAuthorImage(Request $request)
    {
        $validated = $request->validate([
            'manuscript_id' => 'required|exists:manuscripts,id',
            'author_image' => 'required|image|mimes:jpeg,png',
        ]);

        try {
            $manuscript = Manuscript::findOrFail($validated['manuscript_id']);
            $imageFile = $request->file('author_image');

            // Delete old image if exists
            if ($manuscript->author_image_url) {
                AuthorImageValidationService::delete($manuscript->author_image_url);
            }

            // Validate and store new image
            $imageUrl = AuthorImageValidationService::store($imageFile, $manuscript->author_email);

            $imageValidation = AuthorImageValidationService::validate($imageFile);

            $manuscript->update([
                'author_image_url' => $imageUrl,
                'author_image_mime_type' => $imageValidation['mime_type'],
                'author_image_size' => $imageValidation['size'],
            ]);

            AuditLog::create([
                'action' => 'author_image_uploaded',
                'actor_email' => $manuscript->author_email,
                'actor_type' => 'author',
                'manuscript_id' => $manuscript->id,
                'description' => 'Author image uploaded',
                'status' => 'success',
                'actor_ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Author image uploaded successfully',
                'data' => [
                    'author_image_url' => $imageUrl,
                    'author_image_size' => $imageValidation['size'],
                ],
            ], 200);
        } catch (\Exception $e) {
            AuditLog::create([
                'action' => 'author_image_upload_failed',
                'actor_email' => $manuscript->author_email ?? 'unknown',
                'actor_type' => 'author',
                'manuscript_id' => $manuscript->id ?? null,
                'description' => 'Author image upload failed: '.$e->getMessage(),
                'status' => 'failed',
                'actor_ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload author image',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
