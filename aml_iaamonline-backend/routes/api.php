<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminArticleController;
use App\Http\Controllers\Api\AdminManuscriptController;
use App\Http\Controllers\Api\AdminRoleController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\EditorController;
use App\Http\Controllers\Api\HomeSectionController;
use App\Http\Controllers\Api\IntegrationController;
use App\Http\Controllers\Api\ManagingEditorController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OaiController;
use App\Http\Controllers\Api\OrcidController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\ReferenceController;
use App\Http\Controllers\Api\ReviewerController;
use App\Http\Controllers\Api\ReviewerPortalController;
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
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Author Submission Routes
Route::post('/submit', [SubmissionController::class, 'store'])->name('submit');
Route::post('/track', [SubmissionController::class, 'show'])->name('track');
Route::post('/submit/author-image', [SubmissionController::class, 'uploadAuthorImage'])->name('submit.author-image');

// Article Routes (public) — static routes before dynamic {id}
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/search', [ArticleController::class, 'search'])->name('articles.search');
Route::get('/articles/stats', [ArticleController::class, 'stats'])->name('articles.stats');
Route::get('/articles/citation-formats', [ArticleController::class, 'citationFormats'])->name('articles.citation-formats');
Route::get('/articles/{id}', [ArticleController::class, 'show'])->where('id', '[0-9]+')->name('articles.show');
Route::get('/articles/{id}/authors', [ArticleController::class, 'getAuthorsWithAffiliations'])->name('article.authors');
Route::get('/articles/{id}/affiliations', [ArticleController::class, 'getAffiliations'])->name('article.affiliations');
Route::get('/articles/{id}/citation', [ArticleController::class, 'citation'])->name('article.citation');

// Author Routes (public)
Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');
Route::get('/authors/{author}', [AuthorController::class, 'show'])->name('authors.show');

// Homepage content (public — powers the dynamic homepage)
Route::get('/home/sections', [HomeSectionController::class, 'index'])->name('home.sections');

// Reference data + open scholarly endpoints (public)
Route::get('/reference', [ReferenceController::class, 'index'])->name('reference');
Route::get('/oai', [OaiController::class, 'handle'])->name('oai');
Route::get('/articles/{id}/jats', [OaiController::class, 'jats'])->where('id', '[0-9]+')->name('articles.jats');
Route::get('/auth/orcid', [OrcidController::class, 'redirect'])->name('orcid.redirect');
Route::get('/auth/orcid/callback', [OrcidController::class, 'callback'])->name('orcid.callback');

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
    // Authenticated author's own workspace (any logged-in user)
    Route::get('/my/manuscripts', [AccountController::class, 'manuscripts'])->name('my.manuscripts');
    Route::get('/my/manuscripts/{id}', [AccountController::class, 'manuscriptDetail'])->name('my.manuscript.detail');
    Route::post('/my/manuscripts/{id}/revise', [AccountController::class, 'revise'])->name('my.manuscript.revise');
    Route::get('/me', [AccountController::class, 'profile'])->name('me.profile');
    Route::patch('/me', [AccountController::class, 'updateProfile'])->name('me.update');
    Route::put('/me/password', [AccountController::class, 'updatePassword'])->name('me.password');

    // In-app notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    // Reviewer portal (authenticated reviewer)
    Route::get('/reviewer/assignments', [ReviewerPortalController::class, 'assignments'])->name('reviewer.assignments');
    Route::post('/reviewer/assignments/{id}/respond', [ReviewerPortalController::class, 'respond'])->name('reviewer.respond');
    Route::post('/reviewer/assignments/{id}/review', [ReviewerPortalController::class, 'review'])->name('reviewer.review-submit');

    // Book / proceedings proposals
    Route::get('/my/proposals', [ProposalController::class, 'mine'])->name('proposals.mine');
    Route::post('/proposals', [ProposalController::class, 'store'])->name('proposals.store');
    Route::get('/proposals', [ProposalController::class, 'index'])->name('proposals.index');
    Route::post('/proposals/{id}/decision', [ProposalController::class, 'decide'])->name('proposals.decide');

    // Editor production & publishing
    Route::post('/editor/production/{id}/start', [EditorController::class, 'sendToProduction'])->name('editor.production.start');
    Route::patch('/editor/production/{id}', [EditorController::class, 'updateProduction'])->name('editor.production.update');
    Route::post('/editor/publish/{id}', [EditorController::class, 'publish'])->name('editor.publish');
    Route::patch('/editor/articles/{id}/integration', [IntegrationController::class, 'update'])->name('editor.articles.integration');
    Route::post('/editor/articles/{id}/doi-update', [IntegrationController::class, 'updateDoi'])->name('editor.articles.doi-update');
    Route::get('/editor/articles/{id}/doi-status', [IntegrationController::class, 'doiStatus'])->name('editor.articles.doi-status');
    Route::get('/editor/manuscripts', [EditorController::class, 'index'])->name('editor.manuscripts');
    Route::get('/editor/manuscript/{id}', [EditorController::class, 'show'])->name('editor.show');
    Route::post('/editor/invite-reviewer', [EditorController::class, 'inviteReviewer'])->name('editor.invite-reviewer');
    Route::post('/editor/decision', [EditorController::class, 'makeDecision'])->name('editor.decision');
    Route::get('/editor/stats', [EditorController::class, 'stats'])->name('editor.stats');
    Route::get('/editor/reviewers', [EditorController::class, 'reviewers'])->name('editor.reviewers');

    // Admin User Management Routes
    Route::prefix('admin')->group(function () {
        // User management
        Route::get('/editors', [AdminUserController::class, 'editors'])->name('admin.editors');
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}', [AdminUserController::class, 'show'])->name('admin.users.show');
        Route::patch('/users/{id}', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
        Route::patch('/users/{id}/roles', [AdminUserController::class, 'updateRoles'])->name('admin.users.roles');
        Route::post('/users/{id}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.users.reset-password');
        Route::get('/users/{id}/articles', [AdminUserController::class, 'articles'])->name('admin.users.articles');

        // Homepage content management (admin + publisher via homepage:* permissions)
        Route::get('/home/sections', [HomeSectionController::class, 'adminIndex'])->name('admin.home.sections.index');
        Route::post('/home/sections', [HomeSectionController::class, 'store'])->name('admin.home.sections.store');
        Route::post('/home/sections/reorder', [HomeSectionController::class, 'reorder'])->name('admin.home.sections.reorder');
        Route::post('/home/sections/{id}/duplicate', [HomeSectionController::class, 'duplicate'])->name('admin.home.sections.duplicate');
        Route::patch('/home/sections/{id}', [HomeSectionController::class, 'update'])->name('admin.home.sections.update');
        Route::delete('/home/sections/{id}', [HomeSectionController::class, 'destroy'])->name('admin.home.sections.destroy');

        // Article editing (admin/editor via article:* permissions)
        Route::get('/articles/{id}', [AdminArticleController::class, 'show'])->name('admin.articles.show');
        Route::patch('/articles/{id}', [AdminArticleController::class, 'update'])->name('admin.articles.update');
        Route::post('/articles/{id}/graphical-abstract', [AdminArticleController::class, 'uploadGraphicalAbstract'])->name('admin.articles.graphical-abstract');

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
        Route::get('/analytics/countries', [AdminAnalyticsController::class, 'countryStats'])->name('admin.analytics.countries');
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
