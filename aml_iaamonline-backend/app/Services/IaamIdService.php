<?php

namespace App\Services;

use App\Models\IaamIdSequence;
use Illuminate\Support\Facades\DB;

/**
 * Mints and validates IAAM identifiers: "IAAM" + 10 digits.
 *
 *   YY       2-digit cohort year — when the identity was first created,
 *            not when the ID happened to be generated (join_date drives
 *            this for backfilled accounts, so history stays meaningful).
 *   NNNNNNN  7-digit, zero-padded, strictly increasing within that year.
 *   C        Luhn check digit over the 9 digits before it, so any system
 *            can validate an ID with arithmetic alone — no DB round trip.
 *
 * Central identity is meant to be owned by the IAAM portal long-term (see
 * the portal restructure plan). Until that system exists, AML mints its
 * own IDs here — real, correctly-formatted, ready to be adopted as-is
 * once a central issuer is built, rather than left as a placeholder.
 */
class IaamIdService
{
    private const PREFIX = 'IAAM';

    /** Mint the next IAAM ID for a person whose identity dates to $cohortDate. */
    public function generate(\DateTimeInterface $cohortDate): string
    {
        $year = (int) $cohortDate->format('y');

        $sequence = DB::transaction(function () use ($year) {
            $row = IaamIdSequence::lockForUpdate()->find($year);
            if (! $row) {
                $row = IaamIdSequence::create(['year' => $year, 'next_sequence' => 1]);
            }
            $next = $row->next_sequence;
            $row->update(['next_sequence' => $next + 1]);

            return $next;
        });

        return $this->format($year, $sequence);
    }

    /** Build the full ID from an already-known year + sequence (used by the backfill command). */
    public function format(int $year, int $sequence): string
    {
        $base = sprintf('%02d%07d', $year, $sequence);
        $check = $this->luhnCheckDigit($base);

        return self::PREFIX.$base.$check;
    }

    /** True if $iaamId is a well-formed, checksum-valid IAAM ID. */
    public function isValid(string $iaamId): bool
    {
        if (! preg_match('/^IAAM(\d{10})$/', $iaamId, $m)) {
            return false;
        }

        return $this->luhnValidate($m[1]);
    }

    private function luhnCheckDigit(string $digits): int
    {
        $total = 0;
        $values = array_reverse(array_map('intval', str_split($digits)));
        foreach ($values as $i => $d) {
            if ($i % 2 === 0) {
                $d *= 2;
                if ($d > 9) {
                    $d -= 9;
                }
            }
            $total += $d;
        }

        return (10 - ($total % 10)) % 10;
    }

    private function luhnValidate(string $digits): bool
    {
        $total = 0;
        $values = array_reverse(array_map('intval', str_split($digits)));
        foreach ($values as $i => $d) {
            if ($i % 2 === 1) {
                $d *= 2;
                if ($d > 9) {
                    $d -= 9;
                }
            }
            $total += $d;
        }

        return $total % 10 === 0;
    }
}
