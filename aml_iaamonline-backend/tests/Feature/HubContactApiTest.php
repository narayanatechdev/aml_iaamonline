<?php

use App\Mail\HubContactConfirmationMail;
use App\Models\HubContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

function hubContactPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Priya Nair',
        'email' => 'priya@university.edu',
        'organisation' => 'IIT Delhi',
        'subject' => 'Collaboration & joint publication',
        'message' => 'We would like to discuss a joint special issue with IAAM Publications.',
    ], $overrides);
}

test('a valid message is stored and a confirmation is sent', function () {
    Mail::fake();

    $this->postJson('/api/hub/contact', hubContactPayload())
        ->assertOk()
        ->assertJsonPath('message', 'Thank you, Priya Nair. Your message is on its way and a copy has been sent to your email.');

    $stored = HubContactMessage::sole();
    expect($stored->email)->toBe('priya@university.edu')
        ->and($stored->subject)->toBe('Collaboration & joint publication')
        ->and($stored->ip_address)->not->toBeNull();

    Mail::assertQueued(HubContactConfirmationMail::class, fn ($mail) => $mail->hasTo('priya@university.edu'));
});

test('organisation is optional', function () {
    $payload = hubContactPayload();
    unset($payload['organisation']);

    $this->postJson('/api/hub/contact', $payload)->assertOk();

    expect(HubContactMessage::sole()->organisation)->toBeNull();
});

test('subject must be one of the fixed list', function () {
    $this->postJson('/api/hub/contact', hubContactPayload(['subject' => 'Something else']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('subject');
});

test('message must be at least 20 characters', function () {
    $this->postJson('/api/hub/contact', hubContactPayload(['message' => 'Too short']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.message.0', 'Please tell us a little more, at least 20 characters.');
});

test('email must be valid', function () {
    $this->postJson('/api/hub/contact', hubContactPayload(['email' => 'not-an-email']))
        ->assertUnprocessable()
        ->assertJsonPath('errors.email.0', 'Please enter a valid email address, such as name@university.edu.');
});
