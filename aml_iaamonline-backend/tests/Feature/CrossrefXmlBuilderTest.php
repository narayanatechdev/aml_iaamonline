<?php

use App\Models\Article;
use App\Models\Author;
use App\Services\Crossref\CrossrefXmlBuilder;

/*
 * Built entirely in memory: the builder only reads attributes and the authors
 * relation, so these need no database and stay fast.
 */

function crossrefAuthor(array $attributes = [], ?string $affiliationText = null): Author
{
    $author = new Author(array_merge([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ], $attributes));

    $author->setRelation('pivot', (object) ['affiliation_text' => $affiliationText]);

    return $author;
}

function crossrefArticle(array $attributes = [], array $authors = []): Article
{
    $article = new Article(array_merge([
        'legacy_id' => '25039',
        'title' => 'A Perfectly Ordinary Title',
        'doi' => '10.5185/amlett.2026.011780',
        'volume' => '17',
        'issue' => '1',
        'publish_year' => 2026,
        'publish_month' => 1,
        'status' => 'published',
    ], $attributes));

    $article->setRelation('authors', collect($authors));

    return $article;
}

function buildXml(Article ...$articles): string
{
    return CrossrefXmlBuilder::forCurrentJournal()->build(collect($articles), 'test-batch');
}

it('produces a well-formed 5.5.0 batch', function () {
    $xml = buildXml(crossrefArticle());

    $doc = new DOMDocument;
    expect($doc->loadXML($xml))->toBeTrue()
        ->and($doc->documentElement->getAttribute('version'))->toBe('5.5.0')
        ->and($doc->documentElement->namespaceURI)->toBe('http://www.crossref.org/schema/5.5.0');
});

it('carries the batch id and depositor through to the head', function () {
    $xml = buildXml(crossrefArticle());

    expect($xml)->toContain('<doi_batch_id>test-batch</doi_batch_id>')
        ->toContain('<registrant>International Association of Advanced Materials</registrant>');
});

it('escapes ampersands rather than breaking the batch', function () {
    $xml = buildXml(crossrefArticle(['title' => 'Tin & Lead: A Study']));

    expect($xml)->toContain('Tin &amp; Lead: A Study')
        ->and((new DOMDocument)->loadXML($xml))->toBeTrue();
});

it('strips markup out of titles and abstracts', function () {
    $xml = buildXml(crossrefArticle([
        'title' => 'Dielectric <i>Studies</i> on PbTe',
        'abstract' => '<p>An abstract with <b>markup</b>.</p>',
    ]));

    expect($xml)->toContain('<title>Dielectric Studies on PbTe</title>')
        ->toContain('An abstract with markup.')
        ->not->toContain('<i>');
});

it('points the resource at the article landing page', function () {
    $xml = buildXml(crossrefArticle(['legacy_id' => '25039']));

    expect($xml)->toContain('<resource>https://pubs.iaamonline.org/advanced-materials-letters/article/25039</resource>');
});

it('normalises a DOI that arrives as a URL', function () {
    $xml = buildXml(crossrefArticle(['doi' => 'https://doi.org/10.5185/amlett.2026.011780']));

    expect($xml)->toContain('<doi>10.5185/amlett.2026.011780</doi>');
});

describe('pages', function () {
    it('keeps a genuine range', function () {
        $xml = buildXml(crossrefArticle(['pages_from' => '10', 'pages_to' => '24']));

        expect($xml)->toContain('<first_page>10</first_page>')
            ->toContain('<last_page>24</last_page>');
    });

    it('drops a closing page that precedes the opening one', function () {
        // Real data: pages_from 2601 with pages_to 1780, an article number.
        $xml = buildXml(crossrefArticle(['pages_from' => '2601', 'pages_to' => '1780']));

        expect($xml)->toContain('<first_page>2601</first_page>')
            ->not->toContain('<last_page>');
    });

    it('omits pages entirely when there is no opening page', function () {
        $xml = buildXml(crossrefArticle(['pages_from' => null, 'pages_to' => null]));

        expect($xml)->not->toContain('<pages>');
    });
});

describe('contributors', function () {
    it('marks the first author first and the rest additional', function () {
        $xml = buildXml(crossrefArticle([], [
            crossrefAuthor(['first_name' => 'Ada', 'last_name' => 'Lovelace']),
            crossrefAuthor(['first_name' => 'Alan', 'last_name' => 'Turing']),
        ]));

        expect(substr_count($xml, 'sequence="first"'))->toBe(1)
            ->and(substr_count($xml, 'sequence="additional"'))->toBe(1)
            ->and($xml)->toContain('<surname>Lovelace</surname>');
    });

    it('omits contributors when the article has no authors', function () {
        expect(buildXml(crossrefArticle()))->not->toContain('<contributors>');
    });

    it('splits a display name when first and last are missing', function () {
        $xml = buildXml(crossrefArticle([], [
            crossrefAuthor(['first_name' => null, 'last_name' => null, 'name' => 'Marie Sklodowska Curie']),
        ]));

        expect($xml)->toContain('<given_name>Marie Sklodowska</given_name>')
            ->toContain('<surname>Curie</surname>');
    });

    it('skips an author with no usable name rather than sending an empty one', function () {
        $xml = buildXml(crossrefArticle([], [
            crossrefAuthor(['first_name' => null, 'last_name' => null, 'name' => null]),
        ]));

        expect($xml)->not->toContain('<person_name');
    });

    it('expands a bare ORCID into its full URI', function () {
        $xml = buildXml(crossrefArticle([], [
            crossrefAuthor(['orcid' => '0000-0002-1825-0097']),
        ]));

        expect($xml)->toContain('<ORCID>https://orcid.org/0000-0002-1825-0097</ORCID>');
    });

    it('drops an ORCID that is not a valid identifier', function () {
        $xml = buildXml(crossrefArticle([], [crossrefAuthor(['orcid' => 'not-an-orcid'])]));

        expect($xml)->not->toContain('<ORCID>');
    });

    it('prefers the per-article affiliation over the author default', function () {
        $xml = buildXml(crossrefArticle([], [
            crossrefAuthor(['affiliation' => 'Default University'], 'Madurai Kamaraj University, India'),
        ]));

        expect($xml)->toContain('<institution_name>Madurai Kamaraj University, India</institution_name>')
            ->not->toContain('Default University');
    });
});

it('groups articles by volume and issue into one journal block each', function () {
    $xml = buildXml(
        crossrefArticle(['volume' => '17', 'issue' => '1', 'doi' => '10.5185/a']),
        crossrefArticle(['volume' => '17', 'issue' => '1', 'doi' => '10.5185/b']),
        crossrefArticle(['volume' => '16', 'issue' => '2', 'doi' => '10.5185/c']),
    );

    expect(substr_count($xml, '<journal>'))->toBe(2)
        ->and(substr_count($xml, '<journal_article'))->toBe(3);
});

it('omits the publication date when the year is unknown', function () {
    $xml = buildXml(crossrefArticle(['publish_year' => null, 'publish_month' => null]));

    expect($xml)->not->toContain('<publication_date');
});
