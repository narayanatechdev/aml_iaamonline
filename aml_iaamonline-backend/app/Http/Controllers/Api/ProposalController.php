<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProposalController extends Controller
{
    /**
     * The authenticated author's own proposals.
     */
    public function mine(Request $request): JsonResponse
    {
        $proposals = Proposal::where('author_email', $request->user()->email)
            ->latest()
            ->get();

        return response()->json(['data' => $proposals]);
    }

    /**
     * Submit a new book / proceedings proposal.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kind' => ['required', Rule::in(['Book', 'Conference Proceedings'])],
            'title' => 'required|string|max:255',
            'editors' => 'nullable|string|max:255',
            'scope' => 'required|string|max:5000',
            'units' => 'nullable|string|max:255',
            'timeline' => 'nullable|string|max:255',
            'audience' => 'nullable|string|max:255',
        ]);

        $proposal = Proposal::create(array_merge($validated, [
            'proposal_id' => 'PROP-'.now()->year.'-'.Str::upper(Str::random(5)),
            'status' => 'proposed',
            'author_email' => $request->user()->email,
            'user_id' => $request->user()->id,
        ]));

        return response()->json(['success' => true, 'data' => $proposal], 201);
    }

    /**
     * Commissioning queue (editors / admins).
     */
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAnyRole(['editor', 'managing-editor', 'admin'])) {
            abort(403);
        }

        return response()->json(['data' => Proposal::latest()->get()]);
    }

    /**
     * Approve or decline a proposal.
     */
    public function decide(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->hasAnyRole(['editor', 'managing-editor', 'admin'])) {
            abort(403);
        }

        $validated = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'declined'])],
            'notes' => 'nullable|string|max:5000',
        ]);

        $proposal = Proposal::findOrFail($id);
        $proposal->update([
            'status' => $validated['decision'],
            'decision_notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $proposal]);
    }
}
