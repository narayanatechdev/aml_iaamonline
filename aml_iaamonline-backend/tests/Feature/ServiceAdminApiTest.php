<?php

use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\Role;
use App\Models\ServiceClient;
use App\Models\User;
use App\Services\IaamIdService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

beforeEach(function () {
    [$this->client, $this->key] = ServiceClient::issue('IAAM Portal');
    $this->client->update(['abilities' => ['manuscripts.write', 'journal.admin']]);

    foreach (['author', 'reviewer', 'editor', 'managing-editor', 'admin'] as $name) {
        Role::create(['name' => $name, 'display_name' => ucfirst($name), 'type' => 'system', 'is_active' => true]);
    }

    $this->iaamId = app(IaamIdService::class)->format(26, 5000009);
});

function adminManuscript(array $attributes = []): Manuscript
{
    return Manuscript::create(array_merge([
        'submission_id' => 'SUB-'.fake()->unique()->bothify('????????????'),
        'title' => 'A paper',
        'authors' => 'Someone',
        'author_email' => 'someone@example.com',
        'author_affiliation' => 'Somewhere',
        'abstract' => 'Abstract',
        'keywords' => 'k',
        'category' => 'other',
        'status' => 'submitted',
        'submitted_at' => now(),
    ], $attributes));
}

function editorUser(string $role = 'editor'): User
{
    $user = User::factory()->create();
    $user->assignRole(Role::where('name', $role)->first());

    return $user;
}

test('admin routes need the journal.admin ability', function () {
    $this->client->update(['abilities' => ['manuscripts.write']]);

    $this->withToken($this->key)->getJson('/api/service/admin/manuscripts')->assertForbidden();
    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", [])->assertForbidden();
    $this->withoutToken()->getJson('/api/service/admin/manuscripts')->assertUnauthorized();
});

test('admins list every manuscript with filters, search and stats', function () {
    adminManuscript(['title' => 'Graphene sensors', 'status' => 'submitted', 'iaam_id' => $this->iaamId]);
    adminManuscript(['title' => 'Old hyphen status', 'status' => 'revision-requested']);
    adminManuscript(['title' => 'Accepted one', 'status' => 'accepted']);

    $this->withToken($this->key)->getJson('/api/service/admin/manuscripts')
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('meta.total', 3)
        ->assertJsonPath('stats.total', 3)
        ->assertJsonPath('stats.awaiting_revision', 1)
        ->assertJsonPath('stats.decided', 1);

    $this->withToken($this->key)->getJson('/api/service/admin/manuscripts?status=revision_required')
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Old hyphen status')
        ->assertJsonPath('data.0.stage', 'awaiting_revision');

    $this->withToken($this->key)->getJson('/api/service/admin/manuscripts?search='.$this->iaamId)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.iaam_id', $this->iaamId);
});

test('admin detail shows the editor and reviewers but not confidential comments', function () {
    $editor = editorUser();
    $m = adminManuscript(['assigned_editor_id' => $editor->id, 'status' => 'under_review', 'editor_notes' => 'internal note']);
    $a = ReviewAssignment::create(['manuscript_id' => $m->id, 'reviewer_email' => 'rev@example.com', 'reviewer_name' => 'Dr Rev', 'invited_at' => now()]);
    Review::create(['review_assignment_id' => $a->id, 'manuscript_id' => $m->id, 'reviewer_email' => 'rev@example.com',
        'recommendation' => 'accept', 'comments' => 'Fine', 'confidential_comments' => 'SECRET', 'is_submitted' => true]);

    $response = $this->withToken($this->key)->getJson("/api/service/admin/manuscripts/{$m->submission_id}")
        ->assertOk()
        ->assertJsonPath('data.editor.email', $editor->email)
        ->assertJsonPath('data.editor_notes', 'internal note')
        ->assertJsonPath('data.reviewers.0.email', 'rev@example.com')
        ->assertJsonPath('data.allowed_statuses', ['decision', 'revision_required', 'accepted', 'rejected']);

    expect(json_encode($response->json()))->not->toContain('SECRET');
});

test('assigning an editor follows AML\'s managing-editor rules', function () {
    $editor = editorUser('managing-editor');
    $notEditor = editorUser('reviewer');
    $m = adminManuscript(['status' => 'editor-review']);

    $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/assign-editor", ['editor_id' => $notEditor->id])
        ->assertUnprocessable()->assertJsonValidationErrors('editor_id');

    $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/assign-editor", ['editor_id' => $editor->id, 'notes' => 'Handle quickly'])
        ->assertOk()
        ->assertJsonPath('data.editor.id', $editor->id)
        ->assertJsonPath('data.status', 'under_review')
        ->assertJsonPath('data.can_assign_editor', false);

    $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/assign-editor", ['editor_id' => $editor->id])
        ->assertUnprocessable()->assertJsonValidationErrors('status');

    expect(AuditLog::where('action', 'decision_made')->value('actor_email'))->toBe('service:IAAM Portal');
});

test('status changes follow the allowed transitions and record decisions', function () {
    $m = adminManuscript(['status' => 'under-review']);

    $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/status", ['status' => 'published'])
        ->assertUnprocessable()->assertJsonValidationErrors('status');

    $this->withToken($this->key)->postJson("/api/service/admin/manuscripts/{$m->submission_id}/status", [
        'status' => 'revision_required',
        'decision_letter' => 'Please add cycling data.',
    ])->assertOk()
        ->assertJsonPath('data.status', 'revision_required')
        ->assertJsonPath('data.stage', 'awaiting_revision')
        ->assertJsonPath('data.decision_notes', 'Please add cycling data.');

    expect($m->fresh()->final_decision)->toBe('revision-requested');

    // The author can now revise it through the Portal.
    $m->update(['iaam_id' => $this->iaamId]);
    $this->withToken($this->key)->postJson("/api/service/users/{$this->iaamId}/manuscripts/{$m->submission_id}/revise", ['response' => 'Added the cycling data.'])
        ->assertOk();
});

test('roles are listed and created with AML\'s naming rules', function () {
    $this->withToken($this->key)->postJson('/api/service/admin/roles', ['name' => 'Guest Editor'])
        ->assertUnprocessable()->assertJsonValidationErrors('name');

    $this->withToken($this->key)->postJson('/api/service/admin/roles', ['name' => 'guest-editor', 'description' => 'Special issues'])
        ->assertCreated()->assertJsonPath('data.display_name', 'Guest Editor');

    $this->withToken($this->key)->getJson('/api/service/admin/roles')
        ->assertOk()
        ->assertJsonFragment(['name' => 'guest-editor', 'description' => 'Special issues', 'holders' => 0]);
});

test('giving roles to a Portal member creates a linked account and emails a setup link', function () {
    Notification::fake();

    $payload = ['roles' => ['reviewer', 'editor'], 'email' => 'Portal.Member@Example.com', 'name' => 'Portal Member', 'affiliation' => 'KTH'];

    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", $payload)
        ->assertOk()
        ->assertJsonPath('data.created', true)
        ->assertJsonPath('data.setup_email', 'sent')
        ->assertJsonPath('data.roles', ['editor', 'reviewer']);

    $user = User::where('iaam_id', $this->iaamId)->sole();
    expect($user->is_reviewer)->toBeTrue();

    Notification::assertSentTo($user, ResetPassword::class, function ($n) use ($user) {
        $url = (new ReflectionFunction(ResetPassword::$createUrlCallback))->invoke($user, $n->token);

        return str_starts_with($url, rtrim(config('app.frontend_url'), '/').'/account/reset-password?token=');
    });

    // Changing roles later: revokes what's gone, no second account, no second email.
    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", ['roles' => ['editor']] + $payload)
        ->assertOk()
        ->assertJsonPath('data.created', false)
        ->assertJsonPath('data.setup_email', 'skipped')
        ->assertJsonPath('data.roles', ['editor']);

    expect(User::count())->toBe(1)
        ->and($user->fresh()->is_reviewer)->toBeFalse()
        ->and($user->roles()->where('name', 'reviewer')->first()->pivot->revoked_by)->toBe('service:IAAM Portal');

    Notification::assertSentToTimes($user, ResetPassword::class, 1);

    $this->withToken($this->key)->getJson("/api/service/admin/users/{$this->iaamId}/roles")
        ->assertJsonPath('data.has_account', true)
        ->assertJsonPath('data.roles', ['editor']);

    $this->withToken($this->key)->getJson('/api/service/admin/staff')
        ->assertJsonPath('data.0.iaam_id', $this->iaamId);
    $this->withToken($this->key)->getJson('/api/service/admin/editors')
        ->assertJsonPath('data.0.iaam_id', $this->iaamId);
});

test('an existing AML account with the same email is linked, not duplicated', function () {
    Notification::fake();
    $existing = User::factory()->create(['email' => 'veteran@example.com', 'iaam_id' => null]);
    $existing->forceFill(['iaam_id' => null])->save();

    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", ['roles' => ['reviewer'], 'email' => 'Veteran@example.com', 'name' => 'V'])
        ->assertOk()
        ->assertJsonPath('data.created', false);

    expect($existing->fresh()->iaam_id)->toBe($this->iaamId)->and(User::count())->toBe(1);
    Notification::assertNothingSent();
});

test('an email already tied to another IAAM ID is a conflict', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", ['roles' => ['reviewer'], 'email' => 'taken@example.com', 'name' => 'T'])
        ->assertStatus(409)->assertJsonPath('code', 'iaam_id_conflict');

    expect(User::where('iaam_id', $this->iaamId)->exists())->toBeFalse();
});

test('clearing roles for someone without an account creates nothing', function () {
    $this->withToken($this->key)->putJson("/api/service/admin/users/{$this->iaamId}/roles", ['roles' => [], 'email' => 'x@example.com', 'name' => 'X'])
        ->assertOk()->assertJsonPath('data.has_account', false);

    expect(User::count())->toBe(0);
});

test('a setup link sets the password and signs out old tokens', function () {
    $user = User::factory()->create(['email' => 'new.editor@example.com']);
    $user->createToken('old');
    $token = Password::createToken($user);

    $this->postJson('/api/password/reset', ['token' => 'wrong', 'email' => $user->email, 'password' => 'N3w-password!', 'password_confirmation' => 'N3w-password!'])
        ->assertUnprocessable();

    $this->postJson('/api/password/reset', ['token' => $token, 'email' => $user->email, 'password' => 'N3w-password!', 'password_confirmation' => 'N3w-password!'])
        ->assertOk();

    expect(Hash::check('N3w-password!', $user->fresh()->password))->toBeTrue()
        ->and($user->tokens()->count())->toBe(0);
});
