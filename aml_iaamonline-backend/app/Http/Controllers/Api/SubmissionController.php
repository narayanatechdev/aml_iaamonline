<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\ManuscriptFile;
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
        ]);

        $submissionId = 'SUB-'.Str::random(12);

        $manuscript = Manuscript::create([
            'submission_id' => $submissionId,
            'title' => $validated['title'],
            'authors' => $validated['authors'],
            'author_email' => $validated['author_email'],
            'author_affiliation' => $validated['author_affiliation'],
            'abstract' => $validated['abstract'],
            'keywords' => $validated['keywords'],
            'category' => $validated['category'],
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

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
            'email' => 'required|email',
        ]);

        $manuscript = Manuscript::where('submission_id', $validated['submission_id'])
            ->where('author_email', $validated['email'])
            ->firstOrFail();

        AuditLog::create([
            'action' => 'manuscript_viewed',
            'actor_email' => $validated['email'],
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
}
