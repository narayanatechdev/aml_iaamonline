<?php

use App\Models\AuditLog;
use App\Models\Manuscript;
use App\Models\Review;
use App\Models\ReviewAssignment;
use App\Models\ServiceClient;
use App\Models\SustainableDevelopmentGoal;
use App\Models\User;
use App\Services\IaamIdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('local');
    Storage::fake('public');

    [$this->client, $this->key] = ServiceClient::issue('IAAM Portal');
    $this->client->update(['abilities' => ['manuscripts.write']]);

    // A Portal member: has an IAAM ID, has no AML account.
    $this->iaamId = app(IaamIdService::class)->format(26, 5000009);
});

function portalPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Graphene lattices for flexible sensors',
        'authors' => 'Portal Author',
        'author_email' => 'member@portal.test',
        'author_affiliation' => 'Linköping University, Sweden',
        'abstract' => str_repeat('A sufficiently long abstract for validation to pass. ', 5),
        'keywords' => 'graphene, sensors',
        'category' => 'nanotechnology',
        'cover_letter' => 'Please consider this manuscript for AML.',
        'funding_information' => 'Vinnova grant 42',
        'co_authors' => json_encode([['name' => 'Co Author', 'email' => 'co@portal.test']]),
        'sdgs' => json_encode([7]),
        'trl' => 4,
        'division' => 'Sustainable Materials',
        'pdf' => UploadedFile::fake()->create('paper.pdf', 100, 'application/pdf'),
        'image' => UploadedFile::fake()->image('cover.png', 1600, 900),
        'graphical_abstract' => UploadedFile::fake()->image('ga.png', 800, 600),
    ], $overrides);
}

function makeManuscript(array $attributes = []): Manuscript
{
    return Manuscript::create(array_merge([
        'submission_id' => 'SUB-'.fake()->unique()->bothify('????????????'),
        'title' => 'Existing paper',
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

test('every service route needs a valid key', function () {
    $this->getJson("/api/service/users/{$this->iaamId}/manuscripts")->assertUnauthorized();
    $this->withToken('aml_svc_wrong')->getJson('/api/service/manuscript-options')->assertUnauthorized();
});

test('a read-only key can list but cannot submit or revise', function () {
    $this->client->update(['abilities' => null]);

    $this->withToken($this->key)->getJson("/api/service/users/{$this->iaamId}/manuscripts")->assertOk();

    $this->withToken($this->key)->postJson("/api/service/users/{$this->iaamId}/manuscripts", portalPayload())
        ->assertForbidden();
    $this->withToken($this->key)->postJson("/api/service/users/{$this->iaamId}/manuscripts/SUB-x/revise", [])
        ->assertForbidden();

    expect(Manuscript::count())->toBe(0);
});

test('the portal submits for a person with no AML account, stamped with their IAAM ID', function () {
    SustainableDevelopmentGoal::create(['sdg_number' => 7, 'name' => 'Affordable and Clean Energy', 'description' => 'x']);

    $response = $this->withToken($this->key)
        ->postJson("/api/service/users/{$this->iaamId}/manuscripts", portalPayload())
        ->assertCreated()
        ->assertJsonPath('data.journal', 'aml')
        ->assertJsonPath('data.status', 'submitted')
        ->assertJsonPath('data.stage', 'in_progress')
        ->assertJsonPath('data.submitted_via', 'portal')
        ->assertJsonPath('data.sdgs.0.value', 7)
        ->assertJsonPath('data.co_authors.0.name', 'Co Author');

    $manuscript = Manuscript::firstOrFail();

    expect($manuscript->iaam_id)->toBe($this->iaamId)
        ->and($manuscript->submitted_via)->toBe('portal')
        ->and($manuscript->funding_information)->toBe('Vinnova grant 42')
        ->and($manuscript->files)->toHaveCount(3)
        ->and(User::count())->toBe(0);

    Storage::disk('local')->assertExists($manuscript->file_path);

    // Storage paths never leave AML.
    expect(json_encode($response->json()))->not->toContain('manuscripts/SUB-');

    expect(AuditLog::where('action', 'submission_created')->value('description'))
        ->toContain('via service:IAAM Portal');
});

test('portal submissions get the same validation as AML\'s own form', function () {
    $this->withToken($this->key)
        ->postJson("/api/service/users/{$this->iaamId}/manuscripts", portalPayload([
            'abstract' => 'too short',
            'image' => UploadedFile::fake()->image('square.png', 800, 800),
        ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['abstract', 'image']);
});

test('a malformed IAAM ID is rejected before anything is stored', function () {
    $this->withToken($this->key)
        ->postJson('/api/service/users/IAAM2650000000/manuscripts', portalPayload())
        ->assertUnprocessable()
        ->assertJsonPath('message', 'Malformed IAAM ID.');

    expect(Manuscript::count())->toBe(0);
});

test('listing returns only this person\'s papers, including older ones matched by their AML email', function () {
    $amlUser = User::factory()->create(['email' => 'Veteran@Example.com']);
    $amlId = $amlUser->iaam_id;

    makeManuscript(['title' => 'Stamped', 'iaam_id' => $amlId, 'status' => 'revision_required']);
    makeManuscript(['title' => 'Legacy by email', 'author_email' => 'veteran@example.com', 'status' => 'accepted']);
    makeManuscript(['title' => 'Someone else', 'iaam_id' => $this->iaamId]);
    makeManuscript(['title' => 'Stamped for another person, same email', 'author_email' => 'veteran@example.com', 'iaam_id' => $this->iaamId]);

    $this->withToken($this->key)->getJson("/api/service/users/{$amlId}/manuscripts")
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('stats.total', 2)
        ->assertJsonPath('stats.awaiting_revision', 1)
        ->assertJsonPath('stats.decided', 1)
        ->assertJsonMissing(['title' => 'Someone else']);
});

test('detail hides reviewer identity, confidential comments and editor notes', function () {
    $manuscript = makeManuscript([
        'iaam_id' => $this->iaamId,
        'status' => 'revision_required',
        'final_decision' => 'revision-requested',
        'decision_date' => now(),
        'decision_notes' => 'Please address reviewer 1.',
        'editor_notes' => 'INTERNAL: author is slow',
    ]);
    $assignment = ReviewAssignment::create(['manuscript_id' => $manuscript->id, 'reviewer_email' => 'secret.reviewer@example.com', 'invited_at' => now()]);
    Review::create([
        'review_assignment_id' => $assignment->id,
        'manuscript_id' => $manuscript->id,
        'reviewer_email' => 'secret.reviewer@example.com',
        'recommendation' => 'minor-revisions',
        'comments' => 'Tighten the methods section.',
        'confidential_comments' => 'CONFIDENTIAL: borderline',
        'is_submitted' => true,
    ]);

    $response = $this->withToken($this->key)
        ->getJson("/api/service/users/{$this->iaamId}/manuscripts/{$manuscript->submission_id}")
        ->assertOk()
        ->assertJsonPath('data.stage', 'awaiting_revision')
        ->assertJsonPath('data.decision_notes', 'Please address reviewer 1.')
        ->assertJsonPath('data.reviews.0.reviewer', 'Reviewer 1')
        ->assertJsonPath('data.reviews.0.comments', 'Tighten the methods section.');

    $body = json_encode($response->json());
    expect($body)->not->toContain('secret.reviewer')
        ->and($body)->not->toContain('CONFIDENTIAL')
        ->and($body)->not->toContain('INTERNAL');

    $events = collect($response->json('data.timeline'))->pluck('event');
    expect($events)->toContain('submitted', 'decision');
});

test('someone else\'s submission is a 404, not a leak', function () {
    $manuscript = makeManuscript(['iaam_id' => app(IaamIdService::class)->format(26, 5000017)]);

    $this->withToken($this->key)
        ->getJson("/api/service/users/{$this->iaamId}/manuscripts/{$manuscript->submission_id}")
        ->assertNotFound();

    $this->withToken($this->key)
        ->postJson("/api/service/users/{$this->iaamId}/manuscripts/{$manuscript->submission_id}/revise", ['response' => 'Hijack attempt here'])
        ->assertNotFound();
});

test('the portal submits a revision for an author with no AML login', function () {
    $manuscript = makeManuscript(['iaam_id' => $this->iaamId, 'status' => 'revision_required']);

    $this->withToken($this->key)
        ->post("/api/service/users/{$this->iaamId}/manuscripts/{$manuscript->submission_id}/revise", [
            'response' => 'We tightened the methods section as asked.',
            'files' => [UploadedFile::fake()->create('revised.pdf', 50, 'application/pdf')],
        ], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.status', 'under_review')
        ->assertJsonPath('data.revision_round', 1)
        ->assertJsonPath('data.timeline.1.event', 'revision_submitted');

    expect($manuscript->fresh()->files()->where('file_type_category', 'revision')->count())->toBe(1);
});

test('a revision is refused unless the editor asked for one', function () {
    $manuscript = makeManuscript(['iaam_id' => $this->iaamId, 'status' => 'under_review']);

    $this->withToken($this->key)
        ->postJson("/api/service/users/{$this->iaamId}/manuscripts/{$manuscript->submission_id}/revise", ['response' => 'Unprompted revision text'])
        ->assertUnprocessable();
});

test('options expose the lists the submission form needs', function () {
    SustainableDevelopmentGoal::create(['sdg_number' => 3, 'name' => 'Good Health', 'description' => 'x']);

    $this->withToken($this->key)->getJson('/api/service/manuscript-options')
        ->assertOk()
        ->assertJsonPath('data.categories.0.value', 'nanotechnology')
        ->assertJsonPath('data.divisions.0', 'Materials for Human Health')
        ->assertJsonPath('data.sdgs.0.label', 'Good Health')
        ->assertJsonPath('data.max_sdgs', 5);
});

test('abilities are granted and withdrawn from the command line', function () {
    $client = ServiceClient::issue('Reader')[0];

    $this->artisan('service-clients:grant', ['id' => $client->id, 'ability' => 'manuscripts.write'])->assertSuccessful();
    expect($client->fresh()->hasAbility('manuscripts.write'))->toBeTrue();

    $this->artisan('service-clients:grant', ['id' => $client->id, 'ability' => 'manuscripts.write', '--remove' => true])->assertSuccessful();
    expect($client->fresh()->hasAbility('manuscripts.write'))->toBeFalse();

    $this->artisan('service-clients:grant', ['id' => $client->id, 'ability' => 'everything'])->assertFailed();
    $this->artisan('service-clients:list')->assertSuccessful();
});

test('a long author list is accepted', function () {
    // sqlite ignores varchar lengths, so check the type Postgres will enforce.
    expect(Schema::getColumnType('manuscripts', 'authors'))->toBe('text');

    $authors = implode(', ', array_fill(0, 30, 'Professor Firstname Lastname-Longername'));

    $this->withToken($this->key)
        ->postJson("/api/service/users/{$this->iaamId}/manuscripts", portalPayload(['authors' => $authors]))
        ->assertCreated();

    expect(Manuscript::sole()->authors)->toBe($authors);
});

test('the migration rolls back cleanly', function () {
    $this->artisan('migrate:rollback', ['--path' => 'database/migrations/2026_09_16_000000_add_portal_submission_support.php'])->assertSuccessful();

    expect(Schema::hasColumn('manuscripts', 'iaam_id'))->toBeFalse()
        ->and(Schema::hasColumn('service_clients', 'abilities'))->toBeFalse();
});
