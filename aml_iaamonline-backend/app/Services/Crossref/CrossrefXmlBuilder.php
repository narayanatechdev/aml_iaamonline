<?php

namespace App\Services\Crossref;

use App\Models\Article;
use DOMDocument;
use DOMElement;
use Illuminate\Support\Collection;

/**
 * Builds a Crossref deposit (schema 5.5.0) from published articles.
 *
 * Element order inside <journal_article> is fixed by the schema — titles,
 * contributors, abstract, publication_date, pages, doi_data — so the private
 * methods below are called in that order and should stay that way.
 *
 * Built with DOMDocument rather than string concatenation: article titles
 * carry ampersands, quotes and markup, and a single unescaped character
 * fails the whole batch at Crossref rather than at the offending record.
 */
class CrossrefXmlBuilder
{
    public const SCHEMA_VERSION = '5.5.0';

    private const NS = 'http://www.crossref.org/schema/5.5.0';

    private const NS_XSI = 'http://www.w3.org/2001/XMLSchema-instance';

    private const NS_JATS = 'http://www.ncbi.nlm.nih.gov/JATS1';

    public function __construct(private readonly array $journal) {}

    /** Journal identity for the deployment this backend serves. */
    public static function forCurrentJournal(): self
    {
        return new self([
            'title' => config('journal.title'),
            'issn' => config('journal.issn'),
            'issn_type' => config('journal.issn_type'),
            'article_url' => rtrim((string) config('journal.article_url'), '/'),
        ]);
    }

    /**
     * @param  Collection<int, Article>  $articles
     */
    public function build(Collection $articles, ?string $batchId = null): string
    {
        $doc = new DOMDocument('1.0', 'UTF-8');
        $doc->formatOutput = true;

        $batch = $doc->createElementNS(self::NS, 'doi_batch');
        $batch->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xsi', self::NS_XSI);
        $batch->setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:jats', self::NS_JATS);
        $batch->setAttribute('version', self::SCHEMA_VERSION);
        $batch->setAttributeNS(
            self::NS_XSI,
            'xsi:schemaLocation',
            self::NS.' https://www.crossref.org/schemas/crossref'.self::SCHEMA_VERSION.'.xsd'
        );
        $doc->appendChild($batch);

        $batch->appendChild($this->head($doc, $batchId ?? $this->generateBatchId()));

        $body = $doc->createElement('body');
        $batch->appendChild($body);

        // Crossref groups articles under the issue they belong to, so one
        // <journal> block per volume/issue rather than one per article.
        foreach ($articles->groupBy(fn (Article $a) => $a->volume.'|'.$a->issue) as $issueArticles) {
            $body->appendChild($this->journal($doc, $issueArticles));
        }

        return $doc->saveXML();
    }

    public function generateBatchId(): string
    {
        return 'iaam-'.now()->format('Ymd-His').'-'.bin2hex(random_bytes(3));
    }

    private function head(DOMDocument $doc, string $batchId): DOMElement
    {
        $head = $doc->createElement('head');
        $head->appendChild($this->text($doc, 'doi_batch_id', $batchId));
        $head->appendChild($this->text($doc, 'timestamp', now()->format('YmdHis')));

        $depositor = $doc->createElement('depositor');
        $depositor->appendChild($this->text($doc, 'depositor_name', (string) config('services.crossref.depositor_name')));
        $depositor->appendChild($this->text($doc, 'email_address', (string) config('services.crossref.depositor_email')));
        $head->appendChild($depositor);

        $head->appendChild($this->text($doc, 'registrant', (string) config('services.crossref.registrant')));

        return $head;
    }

    /** @param  Collection<int, Article>  $articles */
    private function journal(DOMDocument $doc, Collection $articles): DOMElement
    {
        $first = $articles->first();

        $journal = $doc->createElement('journal');

        $metadata = $doc->createElement('journal_metadata');
        $metadata->setAttribute('language', 'en');
        $metadata->appendChild($this->text($doc, 'full_title', (string) $this->journal['title']));
        if (filled($this->journal['issn'])) {
            $issn = $this->text($doc, 'issn', (string) $this->journal['issn']);
            $issn->setAttribute('media_type', (string) ($this->journal['issn_type'] ?: 'print'));
            $metadata->appendChild($issn);
        }
        $journal->appendChild($metadata);

        $issue = $doc->createElement('journal_issue');
        if ($date = $this->publicationDate($doc, $first)) {
            $issue->appendChild($date);
        }
        if (filled($first->volume)) {
            $volume = $doc->createElement('journal_volume');
            $volume->appendChild($this->text($doc, 'volume', (string) $first->volume));
            $issue->appendChild($volume);
        }
        if (filled($first->issue)) {
            $issue->appendChild($this->text($doc, 'issue', (string) $first->issue));
        }
        $journal->appendChild($issue);

        foreach ($articles as $article) {
            $journal->appendChild($this->article($doc, $article));
        }

        return $journal;
    }

    private function article(DOMDocument $doc, Article $article): DOMElement
    {
        $node = $doc->createElement('journal_article');
        $node->setAttribute('publication_type', 'full_text');

        $titles = $doc->createElement('titles');
        $titles->appendChild($this->text($doc, 'title', $this->plain($article->title)));
        $node->appendChild($titles);

        if ($contributors = $this->contributors($doc, $article)) {
            $node->appendChild($contributors);
        }

        if ($abstract = $this->abstract($doc, $article)) {
            $node->appendChild($abstract);
        }

        if ($date = $this->publicationDate($doc, $article)) {
            $node->appendChild($date);
        }

        if ($pages = $this->pages($doc, $article)) {
            $node->appendChild($pages);
        }

        $doiData = $doc->createElement('doi_data');
        $doiData->appendChild($this->text($doc, 'doi', $this->normaliseDoi((string) $article->doi)));
        $doiData->appendChild($this->text($doc, 'resource', $this->resourceUrl($article)));
        $node->appendChild($doiData);

        return $node;
    }

    /**
     * Some records hold an article-numbering scheme in the page columns rather
     * than real pages — pages_from 2601 with pages_to 1780, where 1780 is the
     * DOI suffix. A descending range is bad metadata, so the closing page is
     * dropped unless it genuinely follows the opening one.
     */
    private function pages(DOMDocument $doc, Article $article): ?DOMElement
    {
        $from = trim((string) $article->pages_from);

        if ($from === '') {
            return null;
        }

        $pages = $doc->createElement('pages');
        $pages->appendChild($this->text($doc, 'first_page', $from));

        $to = trim((string) $article->pages_to);
        $bothNumeric = is_numeric($from) && is_numeric($to);

        if ($to !== '' && (! $bothNumeric || (float) $to >= (float) $from)) {
            $pages->appendChild($this->text($doc, 'last_page', $to));
        }

        return $pages;
    }

    private function contributors(DOMDocument $doc, Article $article): ?DOMElement
    {
        $authors = $article->authors;

        if ($authors->isEmpty()) {
            return null;
        }

        $contributors = $doc->createElement('contributors');
        $sequence = 'first';

        foreach ($authors as $author) {
            [$given, $surname] = $this->splitName($author);

            // Crossref requires a surname; a person with no usable name is
            // skipped rather than deposited as an empty contributor.
            if (blank($surname)) {
                continue;
            }

            $person = $doc->createElement('person_name');
            $person->setAttribute('sequence', $sequence);
            $person->setAttribute('contributor_role', 'author');

            if (filled($given)) {
                $person->appendChild($this->text($doc, 'given_name', $given));
            }
            $person->appendChild($this->text($doc, 'surname', $surname));

            if ($affiliation = $this->affiliationName($author)) {
                $affiliations = $doc->createElement('affiliations');
                $institution = $doc->createElement('institution');
                $institution->appendChild($this->text($doc, 'institution_name', $affiliation));
                $affiliations->appendChild($institution);
                $person->appendChild($affiliations);
            }

            if ($orcid = $this->normaliseOrcid($author->orcid)) {
                $person->appendChild($this->text($doc, 'ORCID', $orcid));
            }

            $contributors->appendChild($person);
            $sequence = 'additional';
        }

        return $contributors->hasChildNodes() ? $contributors : null;
    }

    private function abstract(DOMDocument $doc, Article $article): ?DOMElement
    {
        $text = $this->plain($article->abstract);

        if (blank($text)) {
            return null;
        }

        $abstract = $doc->createElementNS(self::NS_JATS, 'jats:abstract');
        $abstract->appendChild($doc->createElementNS(self::NS_JATS, 'jats:p', htmlspecialchars($text, ENT_XML1)));

        return $abstract;
    }

    private function publicationDate(DOMDocument $doc, Article $article): ?DOMElement
    {
        $year = (int) $article->publish_year;

        if ($year <= 0) {
            return null;
        }

        $date = $doc->createElement('publication_date');
        $date->setAttribute('media_type', 'online');

        /*
         * publish_month is empty on every row, so the month comes from
         * publish_date. The day deliberately does not: it is the 1st on 1,632
         * of 1,662 articles, so it is a placeholder rather than a real
         * publication day, and depositing it would be false precision.
         */
        $month = (int) $article->publish_month;
        if ($month < 1 || $month > 12) {
            $month = (int) optional($article->publish_date)->month;
        }

        if ($month >= 1 && $month <= 12) {
            $date->appendChild($this->text($doc, 'month', str_pad((string) $month, 2, '0', STR_PAD_LEFT)));
        }

        $date->appendChild($this->text($doc, 'year', (string) $year));

        return $date;
    }

    private function resourceUrl(Article $article): string
    {
        return $this->journal['article_url'].'/'.($article->legacy_id ?: $article->id);
    }

    /** @return array{0: string, 1: string} given name, surname */
    private function splitName(object $author): array
    {
        $given = trim((string) $author->first_name);
        $surname = trim((string) $author->last_name);

        if (filled($surname)) {
            return [$given, $surname];
        }

        // Fall back to splitting the display name on its final space.
        $full = trim((string) $author->name);
        if (blank($full)) {
            return ['', ''];
        }

        $parts = preg_split('/\s+/', $full) ?: [];
        if (count($parts) === 1) {
            return ['', $parts[0]];
        }

        $surname = array_pop($parts);

        return [implode(' ', $parts), $surname];
    }

    /**
     * Placeholders that stand in for a real institution on imported records.
     * "Research Institution" alone accounts for 6,159 author rows, so
     * depositing it would publish a fabricated affiliation for most AML
     * authors. Crossref treats affiliations as optional; omitting one is
     * honest, inventing one is not.
     */
    private const PLACEHOLDER_AFFILIATIONS = [
        'research institution',
        'n/a',
        'na',
        'unknown',
        'not available',
        'none',
        '-',
    ];

    private function affiliationName(object $author): ?string
    {
        $pivot = $author->pivot ?? null;
        $text = trim((string) ($pivot->affiliation_text ?? ''));

        if (blank($text)) {
            $text = trim((string) ($author->affiliation ?? ''));
        }

        if (blank($text)) {
            return null;
        }

        $text = $this->plain($text);

        return in_array(mb_strtolower($text), self::PLACEHOLDER_AFFILIATIONS, true) ? null : $text;
    }

    private function normaliseOrcid(?string $orcid): ?string
    {
        $orcid = trim((string) $orcid);

        if (blank($orcid)) {
            return null;
        }

        if (! preg_match('/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i', $orcid, $m)) {
            return null;
        }

        return 'https://orcid.org/'.strtoupper($m[1]);
    }

    private function normaliseDoi(string $doi): string
    {
        $doi = trim($doi);
        $doi = preg_replace('#^https?://(dx\.)?doi\.org/#i', '', $doi) ?? $doi;

        return trim(preg_replace('#^doi:\s*#i', '', $doi) ?? $doi);
    }

    /** Strips markup and collapses whitespace; titles and abstracts carry HTML. */
    private function plain(?string $value): string
    {
        $value = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = strip_tags($value);

        return trim(preg_replace('/\s+/u', ' ', $value) ?? $value);
    }

    private function text(DOMDocument $doc, string $name, string $value): DOMElement
    {
        $node = $doc->createElement($name);
        $node->appendChild($doc->createTextNode($value));

        return $node;
    }
}
