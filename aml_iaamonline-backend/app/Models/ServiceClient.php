<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ServiceClient extends Model
{
    /** Abilities a client can be granted on top of the read-only fetch API. */
    public const ABILITIES = ['manuscripts.write'];

    protected $fillable = ['name', 'api_key_hash', 'is_active', 'last_used_at', 'abilities'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_used_at' => 'datetime',
            'abilities' => 'array',
        ];
    }

    /** Every client can read; anything more has to be granted (service-clients:grant). */
    public function hasAbility(string $ability): bool
    {
        return in_array($ability, $this->abilities ?? [], true);
    }

    /**
     * Create a new service client and return the ONE-TIME plaintext key
     * alongside it — only the hash is ever stored, same principle as
     * Sanctum personal access tokens. Show the plaintext to the operator
     * once; it cannot be recovered afterward.
     */
    public static function issue(string $name): array
    {
        $plainKey = 'aml_svc_'.Str::random(40);

        $client = self::create([
            'name' => $name,
            'api_key_hash' => Hash::make($plainKey),
            'is_active' => true,
        ]);

        return [$client, $plainKey];
    }

    /** Find the active client that owns $plainKey, or null. */
    public static function findByPlainKey(string $plainKey): ?self
    {
        // api_key_hash is bcrypt (not a lookup index), so check active
        // clients individually — the table is small (a handful of
        // integrating systems), not per-request user traffic.
        return self::where('is_active', true)
            ->get()
            ->first(fn (self $client) => Hash::check($plainKey, $client->api_key_hash));
    }
}
