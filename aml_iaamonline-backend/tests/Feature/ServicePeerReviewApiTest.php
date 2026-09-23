<?php

use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\Role;
use App\Models\ServiceClient;
use App\Models\User;
use App\Services\IaamIdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    [$this->client, $this->key] = ServiceClient::issue('IAAM Portal');
    $this->client->update(['abilities' => ['manuscripts.write', 'journal.admin', 'reviews.write']]);

    foreach (['author', 'reviewer', 'editor', 'managing-editor', 'admin'] as $name) {
        Role::create(['name' => $name, 'display_name' => ucfirst($name), 'type' => 'system', 'is_active' => true]);
    }

    Mail::fake();
});

function reviewManuscript(array $attributes = []): Manuscript
{
    return Manuscript::create(array_merge([
        'submission_id' => 'SUB-'.fake()->unique()->bothify('????????????'),
        'title' => 'A paper under review',
        'authors' => 'Someone',
        'author_email' => 'author@example.com',
        'author_affiliation' => 'Somewhere',
        'abstract' => 'Abstract',
        'keywords' => 'k',
        'category' => 'other',
        'status' => 'submitted',
        'submitted_at' => now(),
    ], $attributes));
}

function reviewerUser(string $iaamId): User
{
    return User::factory()->create(['iaam_id' => $iaamId, 'email' => 'reviewer@example.edu']);
}

function anIaamId(int $sequence = 5000042): string
{
    return app(IaamIdService::class)->format(26, $sequence);
}

describe('permissions', function () {
    it('refuses the editor endpoints without journal.admin', function () {
        $this->client->update(['abilities' => ['manuscripts.write']]);
        $m = reviewManuscript();

        $this->withToken($this->key)
            ->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", [])
            ->assertForbidden();
    });

    it('refuses the reviewer endpoints without reviews.write', function () {
        $this->client->update(['abilities' => ['journal.admin']]);

        $this->withToken($this->key)
            ->getJson('/api/service/users/'.anIaamId().'/review-assignments')
            ->assertForbidden();
    });

    it('refuses an unauthenticated caller', function () {
        $this->withoutToken()
            ->getJson('/api/service/users/'.anIaamId().'/review-assignments')
            ->assertUnauthorized();
    });
});

describe('editors inviting reviewers', function () {
    it('invites a reviewer and moves the manuscript into review', function () {
        $m = reviewManuscript(['status' => 'submitted']);

        $this->withToken($this->key)
            ->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", [
                'reviewer_email' => 'reviewer@example.edu',
                'reviewer_name' => 'Dr Reviewer',
                'due_date' => now()->addDays(21)->toDateString(),
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'invited')
            ->assertJsonPath('data.reviewer_name', 'Dr Reviewer');

        expect($m->fresh()->status)->toBe('under_review')
            ->and(ReviewAssignment::where('manuscript_id', $m->id)->count())->toBe(1);
    });

    it('records who invited the reviewer', function () {
        $m = reviewManuscript();

        $this->withToken($this->key)
            ->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", [
                'reviewer_email' => 'reviewer@example.edu',
                'reviewer_name' => 'Dr Reviewer',
                'due_date' => now()->addDays(21)->toDateString(),
            ])->assertCreated();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'reviewer_invited',
            'actor_type' => 'portal',
            'manuscript_id' => $m->id,
        ]);
    });

    it('refuses to invite the same reviewer twice', function () {
        $m = reviewManuscript();
        $payload = [
            'reviewer_email' => 'reviewer@example.edu',
            'reviewer_name' => 'Dr Reviewer',
            'due_date' => now()->addDays(21)->toDateString(),
        ];

        $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", $payload)->assertCreated();
        $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", $payload)
            ->assertStatus(422)
            ->assertJsonValidationErrors('reviewer_email');
    });

    it('rejects a due date in the past', function () {
        $m = reviewManuscript();

        $this->withToken($this->key)
            ->postJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers", [
                'reviewer_email' => 'reviewer@example.edu',
                'reviewer_name' => 'Dr Reviewer',
                'due_date' => now()->subDay()->toDateString(),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('due_date');
    });

    it('lists reviewers on a manuscript', function () {
        $m = reviewManuscript();
        ReviewAssignment::create([
            'manuscript_id' => $m->id,
            'reviewer_email' => 'reviewer@example.edu',
            'reviewer_name' => 'Dr Reviewer',
            'status' => 'invited',
            'invited_at' => now(),
            'due_date' => now()->addDays(14),
        ]);

        $this->withToken($this->key)
            ->getJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'invited')
            ->assertJsonPath('data.0.review', null);
    });

    it('withdraws a pending invitation but not a completed one', function () {
        $m = reviewManuscript();
        $pending = ReviewAssignment::create([
            'manuscript_id' => $m->id, 'reviewer_email' => 'a@example.edu', 'reviewer_name' => 'A',
            'status' => 'invited', 'invited_at' => now(), 'due_date' => now()->addDays(14),
        ]);
        $done = ReviewAssignment::create([
            'manuscript_id' => $m->id, 'reviewer_email' => 'b@example.edu', 'reviewer_name' => 'B',
            'status' => 'completed', 'invited_at' => now(), 'due_date' => now()->addDays(14),
        ]);

        $this->withToken($this->key)
            ->deleteJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers/{$pending->id}")
            ->assertOk();

        $this->withToken($this->key)
            ->deleteJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers/{$done->id}")
            ->assertStatus(422);

        expect(ReviewAssignment::find($pending->id))->toBeNull()
            ->and(ReviewAssignment::find($done->id))->not->toBeNull();
    });
});

describe('reviewers working through the Portal', function () {
    beforeEach(function () {
        $this->iaamId = anIaamId();
        $this->reviewer = reviewerUser($this->iaamId);
        $this->manuscript = reviewManuscript();
        $this->assignment = ReviewAssignment::create([
            'manuscript_id' => $this->manuscript->id,
            'reviewer_email' => $this->reviewer->email,
            'reviewer_name' => 'Dr Reviewer',
            'status' => 'invited',
            'invited_at' => now(),
            'due_date' => now()->addDays(14),
        ]);
    });

    it('lists what the person has been asked to review', function () {
        $this->withToken($this->key)
            ->getJson("/api/service/users/{$this->iaamId}/review-assignments")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('stats.invited', 1)
            ->assertJsonPath('data.0.manuscript.submission_id', $this->manuscript->submission_id);
    });

    it('accepts an invitation', function () {
        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/respond", [
                'decision' => 'accept',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'accepted');

        expect($this->assignment->fresh()->response_date)->not->toBeNull();
    });

    it('declines an invitation', function () {
        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/respond", [
                'decision' => 'decline',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'declined');
    });

    it('submits a review and closes the assignment', function () {
        $this->assignment->update(['status' => 'accepted']);

        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/review", [
                'recommendation' => 'minor-revisions',
                'comments' => 'Solid work; the dielectric section needs more detail.',
                'quality_score' => 4,
            ])
            ->assertCreated();

        expect($this->assignment->fresh()->status)->toBe('completed')
            ->and(Review::where('review_assignment_id', $this->assignment->id)->first())
            ->recommendation->toBe('minor-revisions')
            ->reviewer_email->toBe($this->reviewer->email);
    });

    it('refuses a second review for the same assignment', function () {
        $this->assignment->update(['status' => 'completed']);

        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/review", [
                'recommendation' => 'accept',
                'comments' => 'Trying again.',
            ])
            ->assertStatus(422);
    });

    it('refuses a review on a declined invitation', function () {
        $this->assignment->update(['status' => 'declined']);

        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/review", [
                'recommendation' => 'accept',
                'comments' => 'Should not be possible.',
            ])
            ->assertStatus(422);
    });

    it('rejects a recommendation outside the allowed set', function () {
        $this->assignment->update(['status' => 'accepted']);

        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$this->assignment->id}/review", [
                'recommendation' => 'publish-immediately',
                'comments' => 'Nope.',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('recommendation');
    });

    it('will not let one reviewer act on another reviewer assignment', function () {
        $other = ReviewAssignment::create([
            'manuscript_id' => $this->manuscript->id,
            'reviewer_email' => 'someone.else@example.edu',
            'reviewer_name' => 'Someone Else',
            'status' => 'invited',
            'invited_at' => now(),
            'due_date' => now()->addDays(14),
        ]);

        $this->withToken($this->key)
            ->postJson("/api/service/users/{$this->iaamId}/review-assignments/{$other->id}/respond", [
                'decision' => 'accept',
            ])
            ->assertNotFound();

        expect($other->fresh()->status)->toBe('invited');
    });

    it('404s for an IAAM ID that belongs to nobody', function () {
        $this->withToken($this->key)
            ->getJson('/api/service/users/'.anIaamId(5999999).'/review-assignments')
            ->assertNotFound();
    });
});

it('surfaces a submitted review to the editor', function () {
    $iaamId = anIaamId();
    $reviewer = reviewerUser($iaamId);
    $m = reviewManuscript();
    $assignment = ReviewAssignment::create([
        'manuscript_id' => $m->id,
        'reviewer_email' => $reviewer->email,
        'reviewer_name' => 'Dr Reviewer',
        'status' => 'accepted',
        'invited_at' => now(),
        'due_date' => now()->addDays(14),
    ]);

    $this->withToken($this->key)
        ->postJson("/api/service/users/{$iaamId}/review-assignments/{$assignment->id}/review", [
            'recommendation' => 'accept',
            'comments' => 'Publishable as it stands.',
            'confidential_comments' => 'For the editor only.',
        ])->assertCreated();

    $this->withToken($this->key)
        ->getJson("/api/service/admin/manuscripts/{$m->submission_id}/reviewers")
        ->assertOk()
        ->assertJsonPath('data.0.status', 'completed')
        ->assertJsonPath('data.0.review.recommendation', 'accept')
        ->assertJsonPath('data.0.review.confidential_comments', 'For the editor only.');
});
