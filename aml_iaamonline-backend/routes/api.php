<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminManuscriptController;
use App\Http\Controllers\Api\AdminRoleController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\EditorController;
use App\Http\Controllers\Api\ManagingEditorController;
use App\Http\Controllers\Api\ReviewerController;
use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Laravel API is running',
        'timestamp' => now(),
    ]);
});

// Authentication Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Author Submission Routes
Route::post('/submit', [SubmissionController::class, 'store'])->name('submit');
Route::post('/track', [SubmissionController::class, 'show'])->name('track');

// Article Routes (public)
Route::get('/articles/{id}/authors', [ArticleController::class, 'getAuthorsWithAffiliations'])->name('article.authors');
Route::get('/articles/{id}/affiliations', [ArticleController::class, 'getAffiliations'])->name('article.affiliations');

// Author Routes (public)
Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');
Route::get('/authors/{author}', [AuthorController::class, 'show'])->name('authors.show');

// Reviewer Routes
Route::post('/reviewer/verify-email', [ReviewerController::class, 'verifyEmail'])->name('reviewer.verify-email');
Route::post('/reviewer/verify-code', [ReviewerController::class, 'verifyCode'])->name('reviewer.verify-code');
Route::middleware('auth.token')->group(function () {
    Route::get('/reviewer/manuscripts', [ReviewerController::class, 'manuscripts'])->name('reviewer.manuscripts');
    Route::get('/reviewer/manuscript/{id}', [ReviewerController::class, 'showManuscript'])->name('reviewer.show-manuscript');
    Route::post('/reviewer/review', [ReviewerController::class, 'submitReview'])->name('reviewer.submit-review');
});

// Editor Routes (require editor authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/editor/manuscripts', [EditorController::class, 'index'])->name('editor.manuscripts');
    Route::get('/editor/manuscript/{id}', [EditorController::class, 'show'])->name('editor.show');
    Route::post('/editor/invite-reviewer', [EditorController::class, 'inviteReviewer'])->name('editor.invite-reviewer');
    Route::post('/editor/decision', [EditorController::class, 'makeDecision'])->name('editor.decision');
    Route::get('/editor/stats', [EditorController::class, 'stats'])->name('editor.stats');

    // Admin User Management Routes
    Route::prefix('admin')->group(function () {
        // User management
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}', [AdminUserController::class, 'show'])->name('admin.users.show');
        Route::patch('/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
        Route::patch('/users/{id}/roles', [AdminUserController::class, 'updateRoles'])->name('admin.users.roles');
        Route::post('/users/{id}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.users.reset-password');

        // Role management
        Route::get('/roles', [AdminRoleController::class, 'index'])->name('admin.roles.index');
        Route::post('/roles', [AdminRoleController::class, 'store'])->name('admin.roles.store');
        Route::get('/roles/{id}', [AdminRoleController::class, 'show'])->name('admin.roles.show');
        Route::patch('/roles/{id}', [AdminRoleController::class, 'update'])->name('admin.roles.update');
        Route::delete('/roles/{id}', [AdminRoleController::class, 'destroy'])->name('admin.roles.destroy');
        Route::patch('/roles/{id}/permissions', [AdminRoleController::class, 'updatePermissions'])->name('admin.roles.permissions');

        // Manuscript management (admin)
        Route::get('/manuscripts', [AdminManuscriptController::class, 'index'])->name('admin.manuscripts.index');
        Route::get('/manuscripts/{id}', [AdminManuscriptController::class, 'show'])->name('admin.manuscripts.show');
        Route::patch('/manuscripts/{id}/status', [AdminManuscriptController::class, 'updateStatus'])->name('admin.manuscripts.status');
        Route::get('/manuscripts/{id}/timeline', [AdminManuscriptController::class, 'getTimeline'])->name('admin.manuscripts.timeline');

        // Analytics
        Route::get('/analytics/dashboard', [AdminAnalyticsController::class, 'dashboardStats'])->name('admin.analytics.dashboard');
        Route::get('/analytics/submissions', [AdminAnalyticsController::class, 'submissionTrends'])->name('admin.analytics.submissions');
        Route::get('/analytics/acceptance-rate', [AdminAnalyticsController::class, 'acceptanceRate'])->name('admin.analytics.acceptance');
        Route::get('/analytics/review-turnaround', [AdminAnalyticsController::class, 'reviewTurnaround'])->name('admin.analytics.turnaround');
        Route::get('/analytics/editor-performance', [AdminAnalyticsController::class, 'editorPerformance'])->name('admin.analytics.editors');
        Route::get('/analytics/audit-logs', [AdminAnalyticsController::class, 'auditLogs'])->name('admin.analytics.audit-logs');
    });

    // Managing Editor Routes
    Route::prefix('managing-editor')->group(function () {
        Route::get('/screening-queue', [ManagingEditorController::class, 'screeningQueue'])->name('managing-editor.screening-queue');
        Route::post('/screening/{id}', [ManagingEditorController::class, 'performScreening'])->name('managing-editor.screening');
        Route::get('/editor-assignment-queue', [ManagingEditorController::class, 'editorAssignmentQueue'])->name('managing-editor.editor-queue');
        Route::post('/assign-editor/{id}', [ManagingEditorController::class, 'assignEditor'])->name('managing-editor.assign-editor');
        Route::get('/manuscript-tracking', [ManagingEditorController::class, 'manuscriptTracking'])->name('managing-editor.tracking');
    });
});
