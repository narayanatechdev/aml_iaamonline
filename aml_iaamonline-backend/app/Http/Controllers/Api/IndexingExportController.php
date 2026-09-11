<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\CitationFormatterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

/**
 * Per-issue metadata exports for indexing databases, discovery services, and
 * reference managers. Public (unauthenticated) like the OAI-PMH endpoint:
 * these files exist to be pulled by an indexer or handed to a librarian, not
 * gated behind a login.
 *
 * Coverage, and what each target actually needs:
 * - DOAJ: has its own article XML schema; can also harvest via /api/oai.
 * - PubMed/MEDLINE: NLM does not accept a self-submitted XML from arbitrary
 *   journals — indexing follows an application + review by NLM, and only
 *   then (or via PMC deposit) does citation data reach PubMed. The export
 *   here approximates NLM's PubmedArticleSet structure so it's ready if/when
 *   a submission channel is granted; it is not itself a path to indexing.
 * - AGRIS (FAO): Dublin-Core-based AGRIS Application Profile.
 * - Agricola (US NAL): no public self-submission XML schema exists; NAL
 *   indexes via its own cataloging process. Deliberately not implemented —
 *   see the admin page copy.
 * - Summon / J-Gate / library discovery: these ingest holdings via OAI-PMH
 *   harvesting or a KBART holdings list, not a bespoke per-target XML.
 *   kbart() below is the real, standards-based file for that purpose.
 */
class IndexingExportController extends Controller
{
    private const JOURNAL_NAME = 'Advanced Materials Letters';

    private const PUBLISHER = 'International Association of Advanced Materials';

    private const ISSN = '0976-397X';

    /** List volume/issue combinations with article counts, for the admin export picker. */
    public function issues(): JsonResponse
    {
        $issues = Article::published()
            ->whereNotNull('volume')->where('volume', '!=', '')
            ->whereNotNull('issue')->where('issue', '!=', '')
            ->selectRaw('volume, issue, count(*) as article_count, min(publish_date) as publish_date')
            ->groupBy('volume', 'issue')
            ->orderByDesc('volume')
            ->orderByDesc('issue')
            ->get();

        return response()->json(['data' => $issues]);
    }

    private function issueArticles(string $volume, string $issue): Collection
    {
        return Article::published()
            ->where('volume', $volume)
            ->where('issue', $issue)
            ->with('authors')
            ->orderBy('pages_from')
            ->get();
    }

    private function xml(string $body, string $filename): Response
    {
        return response($body, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function text(string $body, string $filename, string $contentType = 'text/plain; charset=UTF-8'): Response
    {
        return response($body, 200, [
            'Content-Type' => $contentType,
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    private function e(?string $value): string
    {
        return htmlspecialchars((string) $value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }

    /** Bundle every article in an issue as RIS entries (EndNote/Zotero/Mendeley import). */
    public function ris(string $volume, string $issue): Response
    {
        $articles = $this->issueArticles($volume, $issue);
        $body = $articles->map(fn (Article $a) => CitationFormatterService::format($a, 'ris'))->implode("\n\n");

        return $this->text($body, "amlett-v{$volume}i{$issue}.ris", 'application/x-research-info-systems');
    }

    /** Bundle every article in an issue as BibTeX entries (LaTeX import). */
    public function bibtex(string $volume, string $issue): Response
    {
        $articles = $this->issueArticles($volume, $issue);
        $body = $articles->map(fn (Article $a) => CitationFormatterService::format($a, 'bibtex'))->implode("\n\n");

        return $this->text($body, "amlett-v{$volume}i{$issue}.bib", 'application/x-bibtex');
    }

    /** DOAJ article XML (https://doaj.org/apps/static/doaj/doajArticles.xsd, approximated). */
    public function doaj(string $volume, string $issue): Response
    {
        $articles = $this->issueArticles($volume, $issue);

        $records = $articles->map(function (Article $a) {
            $authorsXml = $a->authors->map(fn ($author) => '<author><name>'.$this->e(trim($author->first_name.' '.$author->last_name)).'</name></author>')->implode('');

            $keywords = collect(explode(',', (string) $a->keywords))->map(fn ($k) => trim($k))->filter();
            $keywordsXml = $keywords->map(fn ($k) => '<keyword>'.$this->e($k).'</keyword>')->implode('');

            return '<record>'
                .'<language>'.$this->e($a->language ?: 'EN').'</language>'
                .'<publisher>'.$this->e(self::PUBLISHER).'</publisher>'
                .'<journalTitle>'.$this->e(self::JOURNAL_NAME).'</journalTitle>'
                .'<issn>'.$this->e(self::ISSN).'</issn>'
                .'<publicationDate>'.$this->e(optional($a->publish_date)->toDateString()).'</publicationDate>'
                .'<volume>'.$this->e($a->volume).'</volume>'
                .'<issue>'.$this->e($a->issue).'</issue>'
                .($a->pages_from ? '<startPage>'.$this->e($a->pages_from).'</startPage>' : '')
                .($a->pages_to ? '<endPage>'.$this->e($a->pages_to).'</endPage>' : '')
                .($a->doi ? '<doi>'.$this->e($a->doi).'</doi>' : '')
                .'<publisherRecordId>'.$this->e($a->legacy_id ?? (string) $a->id).'</publisherRecordId>'
                .'<documentType>'.$this->e($a->document_type ?: 'Research Article').'</documentType>'
                .'<title language="'.$this->e($a->language ?: 'EN').'">'.$this->e($a->title).'</title>'
                .'<authors>'.$authorsXml.'</authors>'
                .'<abstract language="'.$this->e($a->language ?: 'EN').'">'.$this->e($a->abstract).'</abstract>'
                .($a->pdf_url ? '<fullTextUrl format="pdf">'.$this->e($a->pdf_url).'</fullTextUrl>' : '')
                .'<keywords language="'.$this->e($a->language ?: 'EN').'">'.$keywordsXml.'</keywords>'
                .'</record>';
        })->implode('');

        $xml = '<?xml version="1.0" encoding="UTF-8"?><records xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'.$records.'</records>';

        return $this->xml($xml, "doaj-v{$volume}i{$issue}.xml");
    }

    /** Approximated NLM PubmedArticleSet structure — see class docblock for what this does and doesn't achieve. */
    public function pubmed(string $volume, string $issue): Response
    {
        $articles = $this->issueArticles($volume, $issue);

        $records = $articles->map(function (Article $a) {
            $authorsXml = $a->authors->map(function ($author) {
                return '<Author>'
                    .'<LastName>'.$this->e($author->last_name).'</LastName>'
                    .'<ForeName>'.$this->e($author->first_name).'</ForeName>'
                    .($author->email ? '<AffiliationInfo><Affiliation>'.$this->e($author->email).'</Affiliation></AffiliationInfo>' : '')
                    .'</Author>';
            })->implode('');

            return '<PubmedArticle><MedlineCitation><Article>'
                .'<Journal><Title>'.$this->e(self::JOURNAL_NAME).'</Title>'
                .'<ISSN>'.$this->e(self::ISSN).'</ISSN>'
                .'<JournalIssue><Volume>'.$this->e($a->volume).'</Volume><Issue>'.$this->e($a->issue).'</Issue>'
                .'<PubDate><Year>'.$this->e((string) $a->publish_year).'</Year></PubDate></JournalIssue></Journal>'
                .'<ArticleTitle>'.$this->e($a->title).'</ArticleTitle>'
                .($a->pages_from ? '<Pagination><MedlinePgn>'.$this->e($a->pages_from.'-'.$a->pages_to).'</MedlinePgn></Pagination>' : '')
                .'<Abstract><AbstractText>'.$this->e($a->abstract).'</AbstractText></Abstract>'
                .'<AuthorList>'.$authorsXml.'</AuthorList>'
                .($a->doi ? '<ELocationID EIdType="doi">'.$this->e($a->doi).'</ELocationID>' : '')
                .'</Article></MedlineCitation></PubmedArticle>';
        })->implode('');

        $xml = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE PubmedArticleSet><PubmedArticleSet>'.$records.'</PubmedArticleSet>';

        return $this->xml($xml, "pubmed-v{$volume}i{$issue}.xml");
    }

    /** AGRIS Application Profile (Dublin Core-based, FAO agricultural sciences index). */
    public function agris(string $volume, string $issue): Response
    {
        $articles = $this->issueArticles($volume, $issue);

        $records = $articles->map(function (Article $a) {
            $creatorsXml = $a->authors->map(fn ($author) => '<dc:creator>'.$this->e(trim($author->first_name.' '.$author->last_name)).'</dc:creator>')->implode('');
            $keywords = collect(explode(',', (string) $a->keywords))->map(fn ($k) => trim($k))->filter();
            $subjectsXml = $keywords->map(fn ($k) => '<dc:subject>'.$this->e($k).'</dc:subject>')->implode('');

            return '<ags:resource>'
                .'<dc:title>'.$this->e($a->title).'</dc:title>'
                .$creatorsXml
                .'<dc:date>'.$this->e((string) $a->publish_year).'</dc:date>'
                .'<dc:type>Journal Article</dc:type>'
                .($a->doi ? '<dc:identifier>doi:'.$this->e($a->doi).'</dc:identifier>' : '')
                .'<dc:description>'.$this->e($a->abstract).'</dc:description>'
                .$subjectsXml
                .'<dc:publisher>'.$this->e(self::PUBLISHER).'</dc:publisher>'
                .'<dc:language>'.$this->e($a->language ?: 'en').'</dc:language>'
                .'</ags:resource>';
        })->implode('');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<ags:resources xmlns:ags="http://purl.org/agmes/1.1/" xmlns:dc="http://purl.org/dc/elements/1.1/">'
            .$records.'</ags:resources>';

        return $this->xml($xml, "agris-v{$volume}i{$issue}.xml");
    }

    /**
     * KBART holdings list (NISO RP-9) — the standard tab-separated format
     * library discovery layers (Summon, J-Gate, Primo, EDS…) actually
     * ingest to know what a journal holds. Whole-journal, not per-issue.
     */
    public function kbart(): Response
    {
        $rows = Article::published()
            ->whereNotNull('volume')->where('volume', '!=', '')
            ->selectRaw('min(publish_date) as start_date, max(publish_date) as end_date, min(volume) as start_volume, max(volume) as end_volume')
            ->first();

        $header = implode("\t", [
            'publication_title', 'print_identifier', 'online_identifier', 'date_first_issue_online',
            'num_first_vol_online', 'num_first_issue_online', 'date_last_issue_online',
            'num_last_vol_online', 'num_last_issue_online', 'title_url', 'first_author',
            'title_id', 'embargo_info', 'coverage_depth', 'coverage_notes', 'publisher_name',
        ]);

        $line = implode("\t", [
            self::JOURNAL_NAME, self::ISSN, self::ISSN,
            optional($rows?->start_date)->toDateString() ?? '',
            $rows?->start_volume ?? '', '1',
            optional($rows?->end_date)->toDateString() ?? '',
            $rows?->end_volume ?? '', '',
            url('/'), '', 'amlett', '', 'fulltext', '', self::PUBLISHER,
        ]);

        return $this->text($header."\n".$line, 'amlett-kbart.txt', 'text/tab-separated-values');
    }
}
