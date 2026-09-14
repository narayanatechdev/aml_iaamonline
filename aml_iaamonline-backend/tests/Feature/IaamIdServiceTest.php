<?php

use App\Models\IaamIdSequence;
use App\Services\IaamIdService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('generate mints a well-formed, checksum-valid id and increments the per-year sequence', function () {
    $service = app(IaamIdService::class);

    $first = $service->generate(new DateTime('2026-01-01'));
    $second = $service->generate(new DateTime('2026-06-01'));

    expect($first)->toMatch('/^IAAM26\d{8}$/')
        ->and($second)->toMatch('/^IAAM26\d{8}$/')
        ->and($service->isValid($first))->toBeTrue()
        ->and($service->isValid($second))->toBeTrue()
        ->and(substr($second, 4, 9))->toBeGreaterThan(substr($first, 4, 9));
});

test('generate refuses to cross into the portal\'s reserved sequence range', function () {
    $service = app(IaamIdService::class);

    IaamIdSequence::create(['year' => 26, 'next_sequence' => 5_000_000]);

    $service->generate(new DateTime('2026-01-01'));
})->throws(RuntimeException::class, "would collide with the Portal's range");

test('isValid rejects malformed and checksum-invalid ids', function (string $iaamId) {
    expect(app(IaamIdService::class)->isValid($iaamId))->toBeFalse();
})->with([
    'too few digits' => 'IAAM123',
    'wrong prefix' => 'FOOO2600001172',
    'valid-length but bad checksum' => 'IAAM2600000118',
]);
