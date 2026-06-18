<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Manuscript;
use Illuminate\Http\JsonResponse;

class ReferenceController extends Controller
{
    public const DIVISIONS = [
        'Materials for Human Health',
        'Intelligent Functional Materials',
        'Sustainable Materials',
        'Translational Biomaterials',
        'Digital & AI-Designed Materials',
    ];

    public const CATEGORIES = [
        'nanotechnology', 'materials-science', 'polymers', 'composites',
        'functional-materials', 'sustainable', 'other',
    ];

    public function index(): JsonResponse
    {
        return response()->json([
            'divisions' => self::DIVISIONS,
            'categories' => self::CATEGORIES,
            'trl_levels' => range(1, 9),
            'volumes' => Article::query()->whereNotNull('volume')->distinct()->orderByDesc('volume')->pluck('volume')->values(),
            'issues' => Manuscript::query()->whereNotNull('issue')->distinct()->pluck('issue')->values(),
        ]);
    }
}
