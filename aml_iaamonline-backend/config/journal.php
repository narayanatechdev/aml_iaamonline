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
    'issn' => env('JOURNAL_ISSN', '0976-397X'),
    'issn_type' => env('JOURNAL_ISSN_TYPE', 'print'),

    /* Where a DOI should send a reader — the article's public landing page. */
    'article_url' => env(
        'JOURNAL_ARTICLE_URL',
        'https://pubs.iaamonline.org/advanced-materials-letters/article'
    ),
];
