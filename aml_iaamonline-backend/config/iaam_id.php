<?php

return [

    /*
    |--------------------------------------------------------------------------
    | IAAM ID sequence range
    |--------------------------------------------------------------------------
    |
    | AML, AMP, and the IAAM Portal each mint IDs independently, in the same
    | "IAAM" + 10-digit format, from their own per-year counter. Since none
    | of them coordinate with each other live, the 7-digit sequence is split
    | into non-overlapping ranges so two systems can never hand out the same
    | ID. Set per deployment via .env — do not change an already-deployed
    | app's range without checking what it's already issued.
    |
    */

    'range_start' => (int) env('IAAM_ID_RANGE_START', 1),
    'range_end' => (int) env('IAAM_ID_RANGE_END', 2_499_999),

];
