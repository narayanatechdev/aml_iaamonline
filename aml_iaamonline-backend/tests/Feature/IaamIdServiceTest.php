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

test('generate refuses to cross past this app\'s configured range ceiling', function () {
    $service = app(IaamIdService::class);
    $rangeEnd = config('iaam_id.range_end');

    IaamIdSequence::create(['year' => 26, 'next_sequence' => $rangeEnd + 1]);

    $service->generate(new DateTime('2026-01-01'));
})->throws(RuntimeException::class, 'exhausted this app\'s reserved range');

test('generate starts a fresh year at the configured range floor, not always at 1', function () {
    config(['iaam_id.range_start' => 2_500_000, 'iaam_id.range_end' => 4_999_999]);
    $service = app(IaamIdService::class);

    $id = $service->generate(new DateTime('2026-01-01'));

    expect($id)->toBe($service->format(26, 2_500_000))
        ->and(IaamIdSequence::find(26)->next_sequence)->toBe(2_500_001);
});

test('isValid rejects malformed and checksum-invalid ids', function (string $iaamId) {
    expect(app(IaamIdService::class)->isValid($iaamId))->toBeFalse();
})->with([
    'too few digits' => 'IAAM123',
    'wrong prefix' => 'FOOO2600001172',
    'valid-length but bad checksum' => 'IAAM2600000118',
]);
