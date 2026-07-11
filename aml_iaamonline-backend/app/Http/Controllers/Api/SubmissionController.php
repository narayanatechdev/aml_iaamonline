<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ManuscriptFile;
use App\Models\Notification;
use App\Models\SustainableDevelopmentGoal;
use App\Services\AuthorImageValidationService;
use App\Services\SimilarityCheckService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SubmissionController extends Controller
{
    /**
     * Store a newly created manuscript submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'authors' => 'required|string',
            'author_email' => 'required|email',
            'author_affiliation' => 'required|string',
            'abstract' => 'required|string|min:50|max:5000',
            'keywords' => 'required|string',
            'category' => ['required', Rule::in(['nanotechnology', 'materials-science', 'polymers', 'composites', 'functional-materials', 'sustainable', 'other'])],
            'pdf' => 'required|file|mimes:pdf|max:52428800',
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png',
                'max:10240',
                function ($attribute, $value, $fail) {
                    $imageSize = getimagesize($value->getRealPath());

                    if (! $imageSize) {
                        $fail('Cover image must be a readable JPG or PNG image.');

                        return;
                    }

                    [$width, $height] = $imageSize;

                    if ($height === 0 || abs(($width / $height) - (16 / 9)) > 0.01) {
                        $fail('Cover image must use a 16:9 ratio.');
                    }
                },
            ],
            'graphical_abstract' => 'required|image|mimes:jpeg,jpg,png|max:5120',
            // Optional metadata
            'funding_information' => 'nullable|string|max:2000',
            'acknowledgements' => 'nullable|string|max:2000',
            'conflict_of_interest' => 'nullable|string|max:2000',
            'data_availability' => 'nullable|string|max:2000',
            'cover_letter' => 'required|string|max:5000',
            'co_authors' => 'nullable|json',
            'sdgs' => ['nullable', 'json', function ($attribute, $value, $fail) {
                $sdgs = json_decode($value, true);
                if (is_array($sdgs) && count($sdgs) > 5) {
                    $fail('You can select a maximum of 5 SDGs.');
                }
            }],
            'trl' => 'nullable|integer|min:1|max:9',
            'division' => 'nullable|string|max:255',
        ]);

        $submissionId = 'SUB-'.Str::random(12);

        $coAuthors = $request->filled('co_authors') ? json_decode($request->input('co_authors'), true) : null;

        $manuscript = Manuscript::create([
            'submission_id' => $submissionId,
            'title' => $validated['title'],
            'authors' => $validated['authors'],
            'author_email' => $validated['author_email'],
            'author_affiliation' => $validated['author_affiliation'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'],
            'category' => $validated['category'],
            'funding_information' => $validated['funding_information'] ?? null,
            'acknowledgements' => $validated['acknowledgements'] ?? null,
            'conflict_of_interest' => $validated['conflict_of_interest'] ?? null,
            'data_availability' => $validated['data_availability'] ?? null,
            'cover_letter' => $validated['cover_letter'] ?? null,
            'co_authors' => $coAuthors,
            'trl' => $validated['trl'] ?? null,
            'division' => $validated['division'] ?? null,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // Attach selected Sustainable Development Goals (by sdg_number)
        if ($request->filled('sdgs')) {
            $sdgNumbers = json_decode($request->input('sdgs'), true) ?? [];
            if (is_array($sdgNumbers) && count($sdgNumbers) > 0) {
                $sdgIds = SustainableDevelopmentGoal::whereIn('sdg_number', $sdgNumbers)->pluck('id');
                $manuscript->sdgs()->sync($sdgIds);
            }
        }

        if ($request->hasFile('pdf')) {
            $file = $request->file('pdf');
            $fileName = $submissionId.'_manuscript.pdf';
            $filePath = $file->storeAs('manuscripts', $fileName, 'local');

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'file_type' => 'pdf',
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'file_type_category' => 'manuscript',
                'uploaded_at' => now(),
            ]);

            $manuscript->update([
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_size' => $file->getSize(),
            ]);
        }

        // Required 16:9 cover image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $submissionId.'_image.'.$image->getClientOriginalExtension();
            $imagePath = $image->storeAs('manuscript-images', $imageName, 'public');

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $image->getClientOriginalName(),
                'file_path' => $imagePath,
                'file_type' => $image->getClientOriginalExtension(),
                'file_size' => $image->getSize(),
                'mime_type' => $image->getMimeType(),
                'file_type_category' => 'supplementary',
                'uploaded_at' => now(),
            ]);

            $manuscript->update([
                'author_image_url' => $imagePath,
                'author_image_mime_type' => $image->getMimeType(),
                'author_image_size' => $image->getSize(),
            ]);
        }

        // Graphical abstract
        if ($request->hasFile('graphical_abstract')) {
            $ga = $request->file('graphical_abstract');
            $gaName = $submissionId.'_ga.'.$ga->getClientOriginalExtension();
            $gaPath = $ga->storeAs('graphical-abstracts', $gaName, 'public');

            $manuscript->update([
                'graphical_abstract_path' => $gaPath,
            ]);

            ManuscriptFile::create([
                'manuscript_id' => $manuscript->id,
                'file_name' => $ga->getClientOriginalName(),
                'file_path' => $gaPath,
                'file_type' => $ga->getClientOriginalExtension(),
                'file_size' => $ga->getSize(),
                'mime_type' => $ga->getMimeType(),
                'file_type_category' => 'supplementary',
                'uploaded_at' => now(),
            ]);
        }

        // Similarity check (scaffold — returns null/pending until a provider is configured)
        if ($manuscript->file_path) {
            $manuscript->update(['similarity_score' => SimilarityCheckService::check($manuscript->file_path)]);
        }

        // In-app notification to the author
        Notification::add(
            $manuscript->author_email,
            'submission_received',
            'Manuscript received',
            'Your submission "'.$manuscript->title.'" ('.$submissionId.') has been received.',
            '/dashboard'
        );

        AuditLog::create([
            'action' => 'submission_created',
            'actor_email' => $validated['author_email'],
            'actor_type' => 'author',
            'manuscript_id' => $manuscript->id,
            'description' => 'New manuscript submission: '.$validated['title'],
            'status' => 'success',
            'actor_ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'submission_id' => $submissionId,
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
