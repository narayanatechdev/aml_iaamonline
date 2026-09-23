<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
     * Crossref DOI registration. Deposits are irreversible and globally
     * visible, so `endpoint` stays on the sandbox until it is deliberately
     * pointed at https://doi.crossref.org/servlet/deposit.
     */
    'crossref' => [
        'username' => env('CROSSREF_USERNAME'),
        'password' => env('CROSSREF_PASSWORD'),
        /*
         * Crossref authenticates as "user/role" and the role is case-sensitive.
         * It is still the legacy "vbri" (VBRI Sverige AB) even though the
         * membership now reads International Association of Advanced Materials;
         * "iaam" is rejected with "cannot assume specified role".
         */
        'role' => env('CROSSREF_ROLE', 'vbri'),
        'endpoint' => env('CROSSREF_ENDPOINT', 'https://test.crossref.org/servlet/deposit'),
        'depositor_name' => env('CROSSREF_DEPOSITOR_NAME', 'IAAM Publications'),
        'depositor_email' => env('CROSSREF_DEPOSITOR_EMAIL'),
        'registrant' => env('CROSSREF_REGISTRANT', 'International Association of Advanced Materials'),
    ],

    'stripe' => [
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'success_url' => env('STRIPE_SUCCESS_URL'),
        'cancel_url' => env('STRIPE_CANCEL_URL'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
