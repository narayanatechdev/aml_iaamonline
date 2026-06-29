<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Minimal OAI-PMH endpoint exposing published articles as Dublin Core, for
 * harvesters (DOAJ, indexers). Supports Identify and ListRecords.
 */
class OaiController extends Controller
{
    public function handle(Request $request): Response
    {
        $verb = $request->query('verb', 'Identify');
        $now = now()->toIso8601String();

        if ($verb === 'ListRecords') {
            $records = '';
            Article::published()->limit(100)->get()->each(function ($a) use (&$records) {
                $records .= '<record><header><identifier>oai:amlett:'.$a->id.'</identifier>'
                    .'<datestamp>'.optional($a->publish_date)->toDateString().'</datestamp></header>'
                    .'<metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/">'
                    .'<dc:title>'.htmlspecialchars((string) $a->title).'</dc:title>'
                    .'<dc:identifier>'.htmlspecialchars((string) $a->doi).'</dc:identifier>'
                    .'<dc:date>'.htmlspecialchars((string) $a->publish_year).'</dc:date>'
                    .'<dc:type>'.htmlspecialchars((string) $a->document_type).'</dc:type>'
                    .'<dc:publisher>International Association of Advanced Materials</dc:publisher>'
                    .'</oai_dc:dc></metadata></record>';
            });
            $body = '<ListRecords>'.$records.'</ListRecords>';
        } else {
            $body = '<Identify><repositoryName>Advanced Materials Letters</repositoryName>'
                .'<baseURL>'.url('/api/oai').'</baseURL><protocolVersion>2.0</protocolVersion>'
                .'<adminEmail>editor@iaamonline.org</adminEmail></Identify>';
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">'
            .'<responseDate>'.$now.'</responseDate>'
            .'<request verb="'.htmlspecialchars($verb).'">'.url('/api/oai').'</request>'
            .$body.'</OAI-PMH>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    /**
     * Minimal JATS-XML export for a single published article (for indexers).
     */
    public function jats(int $id): Response
    {
        $a = Article::published()->where('id', $id)->orWhere('legacy_id', $id)->firstOrFail();
        $esc = fn ($v) => htmlspecialchars((string) $v, ENT_XML1);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'
            .'<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.2 20190208//EN" "JATS-journalpublishing1.dtd">'
            .'<article xmlns:xlink="http://www.w3.org/1999/xlink" article-type="research-article">'
            .'<front><journal-meta><journal-id journal-id-type="publisher">amlett</journal-id>'
            .'<journal-title-group><journal-title>Advanced Materials Letters</journal-title></journal-title-group>'
            .'<publisher><publisher-name>International Association of Advanced Materials</publisher-name></publisher></journal-meta>'
            .'<article-meta>'
            .'<article-id pub-id-type="doi">'.$esc($a->doi).'</article-id>'
            .'<title-group><article-title>'.$esc($a->title).'</article-title></title-group>'
            .'<pub-date><year>'.$esc($a->publish_year).'</year></pub-date>'
            .'<volume>'.$esc($a->volume).'</volume><issue>'.$esc($a->issue).'</issue>'
            .'<fpage>'.$esc($a->pages_from).'</fpage><lpage>'.$esc($a->pages_to).'</lpage>'
            .'<abstract><p>'.$esc($a->abstract).'</p></abstract>'
            .'<kwd-group>'.implode('', array_map(fn ($k) => '<kwd>'.$esc(trim($k)).'</kwd>', array_filter(explode(';', (string) $a->keywords)))).'</kwd-group>'
            .'</article-meta></front></article>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
