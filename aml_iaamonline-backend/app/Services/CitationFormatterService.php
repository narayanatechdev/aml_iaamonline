<?php

namespace App\Services;

use App\Models\Article;

class CitationFormatterService
{
    public const FORMAT_APA = 'apa';

    public const FORMAT_MLA = 'mla';

    public const FORMAT_BIBTEX = 'bibtex';

    public const FORMAT_RIS = 'ris';

    public const FORMAT_ENDONOTE = 'endonote';

    private const SUPPORTED_FORMATS = [
        self::FORMAT_APA,
        self::FORMAT_MLA,
        self::FORMAT_BIBTEX,
        self::FORMAT_RIS,
        self::FORMAT_ENDONOTE,
    ];

    /**
     * Format article citation in specified format
     */
    public static function format(Article $article, string $format): string
    {
        if (! in_array($format, self::SUPPORTED_FORMATS)) {
            throw new \InvalidArgumentException("Unsupported citation format: {$format}");
        }

        return match ($format) {
            self::FORMAT_APA => self::formatAPA($article),
            self::FORMAT_MLA => self::formatMLA($article),
            self::FORMAT_BIBTEX => self::formatBibTeX($article),
            self::FORMAT_RIS => self::formatRIS($article),
            self::FORMAT_ENDONOTE => self::formatEndNote($article),
        };
    }

    /**
     * Format as APA citation
     * Example: Author(s). (Year). Title. Journal Name, Volume(Issue), pages. DOI
     */
    private static function formatAPA(Article $article): string
    {
        $authors = self::getFormattedAuthors($article, 'apa');
        $year = $article->publish_year ?? 'n.d.';
        $title = $article->title;
        $journal = 'Advanced Materials Letters';
        $volume = $article->volume ?? 'Volume Unknown';
        $issue = $article->issue ? "({$article->issue})" : '';
        $pages = $article->pages ?? 'pp. unknown';
        $doi = $article->doi ? "https://doi.org/{$article->doi}" : '';

        $citation = "{$authors} ({$year}). {$title}. {$journal}, {$volume}{$issue}, {$pages}.";

        if ($doi) {
            $citation .= " {$doi}";
        }

        return trim($citation);
    }

    /**
     * Format as MLA citation
     * Example: Author(s). "Title." Journal Name, Volume.Issue, Year, pages.
     */
    private static function formatMLA(Article $article): string
    {
        $authors = self::getFormattedAuthors($article, 'mla');
        $title = "\"{$article->title}\"";
        $journal = 'Advanced Materials Letters';
        $volume = $article->volume ?? 'vol. unknown';
        $issue = $article->issue ?? 'no. unknown';
        $year = $article->publish_year ?? 'n.d.';
        $pages = $article->pages ?? 'pp. unknown';

        $citation = "{$authors}. {$title}. {$journal}, vol. {$volume}, no. {$issue}, {$year}, {$pages}.";

        if ($article->doi) {
            $citation .= " Web. {$article->doi}";
        }

        return trim($citation);
    }

    /**
     * Format as BibTeX citation
     */
    private static function formatBibTeX(Article $article): string
    {
        $authors = self::getFormattedAuthors($article, 'bibtex');
        $title = $article->title;
        $journal = 'Advanced Materials Letters';
        $year = $article->publish_year ?? 'n.d.';
        $volume = $article->volume ?? '0';
        $issue = $article->issue ?? '0';
        $pages = self::getPagesRange($article);
        $doi = $article->doi ?? '';

        $bibtex = "@article{AML{$article->legacy_id},\n";
        $bibtex .= "  author = {{$authors}},\n";
        $bibtex .= "  title = {{$title}},\n";
        $bibtex .= "  journal = {{$journal}},\n";
        $bibtex .= "  year = {{$year}},\n";
        $bibtex .= "  volume = {{$volume}},\n";
        $bibtex .= "  number = {{$issue}},\n";

        if ($pages !== 'unknown') {
            $bibtex .= "  pages = {{$pages}},\n";
        }

        if ($doi) {
            $bibtex .= "  doi = {{$doi}},\n";
        }

        $bibtex .= "  url = {https://aml.iaamonline.org/article/{$article->legacy_id}}\n";
        $bibtex .= '}';

        return $bibtex;
    }

    /**
     * Format as RIS (Research Information Systems) citation
     */
    private static function formatRIS(Article $article): string
    {
        $authorLines = self::getRISAuthors($article);
        $ris = "TY  - JOUR\n";
        $ris .= $authorLines;
        $ris .= "TI  - {$article->title}\n";
        $ris .= "JO  - Advanced Materials Letters\n";

        if ($article->publish_year) {
            $ris .= "PY  - {$article->publish_year}\n";
        }

        if ($article->volume) {
            $ris .= "VL  - {$article->volume}\n";
        }

        if ($article->issue) {
            $ris .= "IS  - {$article->issue}\n";
        }

        if ($article->pages_from && $article->pages_to) {
            $ris .= "SP  - {$article->pages_from}\n";
            $ris .= "EP  - {$article->pages_to}\n";
        }

        if ($article->doi) {
            $ris .= "DO  - {$article->doi}\n";
        }

        $ris .= "UR  - https://aml.iaamonline.org/article/{$article->legacy_id}\n";
        $ris .= "ER  - \n";

        return $ris;
    }

    /**
     * Format as EndNote citation
     */
    private static function formatEndNote(Article $article): string
    {
        $authorLines = self::getEndNoteAuthors($article);
        $enw = "%0 Journal Article\n";
        $enw .= $authorLines;
        $enw .= "%T {$article->title}\n";
        $enw .= "%J Advanced Materials Letters\n";

        if ($article->publish_year) {
            $enw .= "%D {$article->publish_year}\n";
        }

        if ($article->volume) {
            $enw .= "%V {$article->volume}\n";
        }

        if ($article->issue) {
            $enw .= "%N {$article->issue}\n";
        }

        if ($article->pages_from && $article->pages_to) {
            $enw .= "%P {$article->pages_from}-{$article->pages_to}\n";
        }

        if ($article->doi) {
            $enw .= "%R {$article->doi}\n";
        }

        $enw .= "%U https://aml.iaamonline.org/article/{$article->legacy_id}\n";

        return $enw;
    }

    /**
     * Get formatted author list
     */
    private static function getFormattedAuthors(Article $article, string $format): string
    {
        $authors = $article->authors ?? [];

        if (empty($authors)) {
            return 'Anonymous';
        }

        $authorNames = $authors->map(function ($author) {
            return $author->first_name.' '.$author->last_name;
        })->toArray();

        return match ($format) {
            'apa' => self::formatAuthorsAPA($authorNames),
            'mla' => self::formatAuthorsMLA($authorNames),
            'bibtex' => self::formatAuthorsBibTeX($authorNames),
            default => implode(', ', $authorNames),
        };
    }

    private static function formatAuthorsAPA(array $names): string
    {
        if (count($names) === 0) {
            return 'Anonymous';
        }

        if (count($names) === 1) {
            return $names[0];
        }

        if (count($names) <= 6) {
            return implode(', ', array_slice($names, 0, -1)).' & '.$names[count($names) - 1];
        }

        return implode(', ', array_slice($names, 0, 6)).' et al.';
    }

    private static function formatAuthorsMLA(array $names): string
    {
        if (count($names) === 0) {
            return 'Anonymous';
        }

        if (count($names) === 1) {
            return $names[0];
        }

        if (count($names) === 2) {
            return "{$names[0]}, and {$names[1]}";
        }

        return $names[0].' et al.';
    }

    private static function formatAuthorsBibTeX(array $names): string
    {
        return implode(' and ', $names);
    }

    private static function getRISAuthors(Article $article): string
    {
        $authors = $article->authors ?? [];

        if (empty($authors)) {
            return '';
        }

        return $authors->map(function ($author) {
            return 'AU  - '.$author->first_name.' '.$author->last_name."\n";
        })->implode('');
    }

    private static function getEndNoteAuthors(Article $article): string
    {
        $authors = $article->authors ?? [];

        if (empty($authors)) {
            return '';
        }

        return $authors->map(function ($author) {
            return '%A '.$author->first_name.' '.$author->last_name."\n";
        })->implode('');
    }

    private static function getPagesRange(Article $article): string
    {
        if ($article->pages_from && $article->pages_to) {
            return $article->pages_from.'-'.$article->pages_to;
        }

        if ($article->pages_from) {
            return $article->pages_from;
        }

        return 'unknown';
    }

    /**
     * Get list of supported formats
     */
    public static function getSupportedFormats(): array
    {
        return [
            self::FORMAT_APA => 'APA',
            self::FORMAT_MLA => 'MLA',
            self::FORMAT_BIBTEX => 'BibTeX',
            self::FORMAT_RIS => 'RIS',
            self::FORMAT_ENDONOTE => 'EndNote',
        ];
    }
}
