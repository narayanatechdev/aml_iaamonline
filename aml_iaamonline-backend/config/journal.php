<?php

/*
 * Identity of the journal this deployment serves.
 *
 * One codebase runs both Advanced Materials Letters and Advanced Materials
 * Proceedings, so anything that names or numbers the journal belongs here
 * rather than in a class constant. Defaults are AML's; the AMP deployment
 * overrides them in its own .env.
 */
return [
    'title' => env('JOURNAL_TITLE', 'Advanced Materials Letters'),

    /*
     * A journal may hold both a print and an electronic ISSN, and Crossref
     * records carry whichever exist. AMP's existing 385 registrations list
     * both, so a deposit that sent only one would contradict them.
     */
    'issn' => env('JOURNAL_ISSN', '0976-397X'),
    'issn_type' => env('JOURNAL_ISSN_TYPE', 'print'),
    'issn_electronic' => env('JOURNAL_ISSN_ELECTRONIC'),

    /* Where a DOI should send a reader — the article's public landing page. */
    'article_url' => env(
        'JOURNAL_ARTICLE_URL',
        'https://pubs.iaamonline.org/advanced-materials-letters/article'
    ),
];
