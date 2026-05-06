<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAnalyticsController extends Controller
{
    /**
     * Return summary stats for admin dashboard.
     */
    public function dashboardStats(): JsonResponse
    {
        $this->authorizeAdmin();

        $totalSubmissions = Manuscript::count();
        $activeManuscripts = Manuscript::whereNotIn('status', ['accepted', 'rejected'])->count();
        $pendingDecisions = Manuscript::where('status', 'under-review')->count();
        $totalUsers = User::count();
        $activeReviewers = ReviewAssignment::where('status', 'accepted')
            ->distinct('reviewer_email')
            ->count('reviewer_email');

        return response()->json([
            'data' => [
                'total_submissions' => $totalSubmissions,
                'active_manuscripts' => $activeManuscripts,
                'pending_decisions' => $pendingDecisions,
                'total_users' => $totalUsers,
                'active_reviewers' => $activeReviewers,
                'submissions_this_month' => Manuscript::whereMonth('submitted_at', now()->month)
                    ->whereYear('submitted_at', now()->year)
                    ->count(),
                'accepted_this_month' => Manuscript::where('status', 'accepted')
                    ->whereMonth('decision_date', now()->month)
                    ->whereYear('decision_date', now()->year)
                    ->count(),
                'rejected_this_month' => Manuscript::where('status', 'rejected')
                    ->whereMonth('decision_date', now()->month)
                    ->whereYear('decision_date', now()->year)
                    ->count(),
            ],
            'message' => 'Success',
        ]);
    }

    /**
     * Return monthly submission counts for last 12 months.
     */
    public function submissionTrends(): JsonResponse
    {
        $this->authorizeAdmin();

        $trends = [];
        $now = Carbon::now();

        for ($i = 11; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $count = Manuscript::whereYear('submitted_at', $month->year)
                ->whereMonth('submitted_at', $month->month)
                ->count();

            $trends[] = [
                'month' => $month->format('Y-m'),
                'label' => $month->format('M Y'),
                'count' => $count,
            ];
        }

        return response()->json([
            'data' => $trends,
            'message' => 'Success',
        ]);
    }

    /**
     * Return acceptance percentage over time periods.
     */
    public function acceptanceRate(): JsonResponse
    {
        $this->authorizeAdmin();

        $periods = [
            'all_time' => null,
            'last_year' => Carbon::now()->subYear(),
            'last_6_months' => Carbon::now()->subMonths(6),
            'last_3_months' => Carbon::now()->subMonths(3),
            'last_month' => Carbon::now()->subMonth(),
        ];

        $rates = [];

        foreach ($periods as $period => $startDate) {
            $query = Manuscript::whereIn('status', ['accepted', 'rejected']);

            if ($startDate) {
                $query->where('decision_date', '>=', $startDate);
            }

            $total = $query->count();
            $accepted = (clone $query)->where('status', 'accepted')->count();

            $rates[$period] = [
                'total_decided' => $total,
                'accepted' => $accepted,
                'rejected' => $total - $accepted,
                'acceptance_rate' => $total > 0 ? round(($accepted / $total) * 100, 2) : 0,
            ];
        }

        return response()->json([
            'data' => $rates,
            'message' => 'Success',
        ]);
    }

    /**
     * Return average review completion time by category.
     */
    public function reviewTurnaround(): JsonResponse
    {
        $this->authorizeAdmin();

        $categories = [
            'nanotechnology',
            'materials-science',
            'polymers',
            'composites',
            'functional-materials',
            'sustainable',
            'other',
        ];

        $turnaround = [];

        foreach ($categories as $category) {
            $reviews = Review::whereHas('manuscript', function ($q) use ($category) {
                $q->where('category', $category);
            })
                ->where('is_submitted', true)
                ->whereNotNull('submitted_at')
                ->get();

            $avgDays = 0;
            $count = $reviews->count();

            if ($count > 0) {
                $totalDays = $reviews->sum(function ($review) {
                    $assignment = $review->assignment;
                    if ($assignment && $assignment->invited_at) {
                        return Carbon::parse($assignment->invited_at)
                            ->diffInDays(Carbon::parse($review->submitted_at));
                    }

                    return Carbon::parse($review->created_at)
                        ->diffInDays(Carbon::parse($review->submitted_at));
                });
                $avgDays = round($totalDays / $count, 1);
            }

            $turnaround[] = [
                'category' => $category,
                'review_count' => $count,
                'avg_days_to_complete' => $avgDays,
            ];
        }

        $overallCount = Review::where('is_submitted', true)->count();
        $overallAvg = 0;

        if ($overallCount > 0) {
            $allReviews = Review::where('is_submitted', true)
                ->whereNotNull('submitted_at')
                ->with('assignment')
                ->get();

            $totalDays = $allReviews->sum(function ($review) {
                $start = $review->assignment?->invited_at ?? $review->created_at;

                return Carbon::parse($start)->diffInDays(Carbon::parse($review->submitted_at));
            });

            $overallAvg = round($totalDays / $overallCount, 1);
        }

        return response()->json([
            'data' => [
                'by_category' => $turnaround,
                'overall' => [
                    'review_count' => $overallCount,
                    'avg_days_to_complete' => $overallAvg,
                ],
            ],
            'message' => 'Success',
        ]);
    }

    /**
     * Return metrics per editor (workload, decisions/month, avg review time).
     */
    public function editorPerformance(): JsonResponse
    {
        $this->authorizeAdmin();

        $editors = User::whereHas('activeRoles', function ($q) {
            $q->whereIn('name', ['editor', 'managing-editor', 'admin']);
        })->get();

        $performance = [];

        foreach ($editors as $editor) {
            $decisionsThisMonth = AuditLog::where('actor_email', $editor->email)
                ->where('action', 'decision_made')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            $totalDecisions = AuditLog::where('actor_email', $editor->email)
                ->where('action', 'decision_made')
                ->count();

            $invitationsSent = AuditLog::where('actor_email', $editor->email)
                ->where('action', 'reviewer_invited')
                ->count();

            $performance[] = [
                'editor_id' => $editor->id,
                'name' => $editor->name,
                'email' => $editor->email,
                'roles' => $editor->getRoleNames(),
                'decisions_this_month' => $decisionsThisMonth,
                'total_decisions' => $totalDecisions,
                'invitations_sent' => $invitationsSent,
            ];
        }

        usort($performance, fn ($a, $b) => $b['total_decisions'] <=> $a['total_decisions']);

        return response()->json([
            'data' => $performance,
            'message' => 'Success',
        ]);
    }

    /**
     * Get filtered audit logs with search, pagination, export.
     *
     * @param  array{
     *   action?: string,
     *   actor_email?: string,
     *   from_date?: string,
     *   to_date?: string,
     *   search?: string,
     *   per_page?: int,
     *   export?: string
     * } $request
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $query = AuditLog::select([
            'id',
            'action',
            'actor_type',
            'actor_email',
            'actor_ip',
            'manuscript_id',
            'resource_type',
            'resource_id',
            'description',
            'status',
            'created_at',
        ]);

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        if ($request->filled('actor_email')) {
            $query->where('actor_email', 'ilike', '%'.$request->input('actor_email').'%');
        }

        if ($request->filled('from_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->input('from_date'))->startOfDay());
        }

        if ($request->filled('to_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->input('to_date'))->endOfDay());
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('description', 'ilike', "%{$search}%")
                    ->orWhere('actor_email', 'ilike', "%{$search}%");
            });
        }

        if ($request->input('export') === 'csv') {
            $logs = $query->latest()->limit(10000)->get();

            $csv = "ID,Action,Actor Type,Actor Email,Actor IP,Manuscript ID,Description,Status,Created At\n";
            foreach ($logs as $log) {
                $csv .= sprintf(
                    "%d,%s,%s,%s,%s,%s,%s,%s,%s\n",
                    $log->id,
                    $log->action,
                    $log->actor_type ?? '',
                    $log->actor_email ?? '',
                    $log->actor_ip ?? '',
                    $log->manuscript_id ?? '',
                    '"'.str_replace('"', '""', $log->description ?? '').'"',
                    $log->status ?? '',
                    $log->created_at->toISOString()
                );
            }

            return response()->json([
                'data' => [
                    'content' => $csv,
                    'filename' => 'audit_logs_'.now()->format('Y-m-d_His').'.csv',
                    'mime_type' => 'text/csv',
                ],
                'message' => 'Export ready.',
            ]);
        }

        $perPage = min($request->integer('per_page', 25), 100);
        $logs = $query->latest()->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
            ],
        ]);
    }

    /**
     * Authorize that the current user has admin role.
     */
    private function authorizeAdmin(): void
    {
        $user = auth()->user();

        if (! $user || ! $user->hasRole('admin')) {
            abort(403, 'Unauthorized. Admin role required.');
        }
    }
}
