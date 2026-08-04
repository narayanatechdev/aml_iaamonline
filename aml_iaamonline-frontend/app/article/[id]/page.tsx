import type { Metadata } from 'next';
import { FEATURED_ARTICLES } from '@/lib/realData';
import { richTextToPlain } from '@/lib/rich-text';
import ArticleClient from './article-client';

const BASE_URL = 'https://amljournal.iaamonline.org';

async function fetchArticleData(id: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/articles/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAuthorsData(id: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/articles/${id}/authors`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function authorObjectToName(a: any): string {
  if (typeof a === 'string') return a;
  if (typeof a === 'object' && a !== null) {
    if (a.name) return a.name;
    const parts = [a.firstName, a.lastName].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
    if (a.first_name) return a.first_name;
  }
  return '';
}

function resolveAuthorNames(authorsData: any, staticAuthors: any[]): string[] {
  if (authorsData?.authors && Array.isArray(authorsData.authors)) {
    const names = (authorsData.authors as any[]).map(authorObjectToName).filter(Boolean);
    if (names.length > 0) return names;
  }
  return (staticAuthors || []).map(authorObjectToName).filter(Boolean);
}

function resolvePages(articleData: any, staticPages: string | undefined): { firstPage?: string; lastPage?: string } {
  if (articleData?.pages_from != null) {
    return {
      firstPage: String(articleData.pages_from),
      lastPage: articleData.pages_to != null ? String(articleData.pages_to) : undefined,
    };
  }
  const pagesStr = staticPages ?? '';
  const parts = pagesStr.split('-');
  return {
    firstPage: parts[0] || undefined,
    lastPage: parts[1] || undefined,
  };
}

function resolvePubDate(articleData: any, staticPublished: string | undefined): string | undefined {
  const raw = articleData?.publish_date ?? staticPublished;
  if (!raw || typeof raw !== 'string') return undefined;
  const parts = raw.slice(0, 10).split('-');
  if (parts.length === 3) return parts.join('/');
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const [articleData, authorsData] = await Promise.all([
    fetchArticleData(id),
    fetchAuthorsData(id),
  ]);

  const staticArticle = FEATURED_ARTICLES.find((a) => a.id === id);

  const rawTitle = articleData?.title ?? staticArticle?.title ?? '';
  const rawAbstract = articleData?.abstract ?? staticArticle?.abstract ?? '';
  const title = richTextToPlain(rawTitle);
  const abstractPlain = richTextToPlain(rawAbstract);
  const description = abstractPlain.length > 200
    ? abstractPlain.slice(0, 197) + '...'
    : abstractPlain || undefined;

  const volume: string | undefined = articleData?.volume ?? staticArticle?.volume;
  const issue: string | undefined = articleData?.issue ?? staticArticle?.issue;
  const doi: string | undefined = articleData?.doi ?? staticArticle?.doi;
  const pdfUrl: string | undefined = articleData?.pdf_url ?? staticArticle?.pdf_url;
  const graphicalAbstractUrl: string | undefined =
    articleData?.graphical_abstract_url ?? staticArticle?.graphical_abstract_url;

  const { firstPage, lastPage } = resolvePages(articleData, staticArticle?.pages);
  const pubDate = resolvePubDate(articleData, staticArticle?.published);
  const authorNames = resolveAuthorNames(authorsData, staticArticle?.authors ?? []);

  const canonicalUrl = `${BASE_URL}/article/${id}`;

  // Build Google Scholar citation_* meta tags — omit any whose value is unknown.
  const other: Record<string, string | number | (string | number)[]> = {};
  if (title) other['citation_title'] = title;
  other['citation_journal_title'] = 'Advanced Materials Letters';
  other['citation_issn'] = '0976-397X';
  if (volume) other['citation_volume'] = volume;
  if (issue) other['citation_issue'] = issue;
  if (firstPage) other['citation_firstpage'] = firstPage;
  if (lastPage) other['citation_lastpage'] = lastPage;
  if (pubDate) other['citation_publication_date'] = pubDate;
  if (doi) other['citation_doi'] = doi;
  if (pdfUrl) other['citation_pdf_url'] = pdfUrl;
  if (authorNames.length > 0) other['citation_author'] = authorNames;

  const ogImages = graphicalAbstractUrl ? [{ url: graphicalAbstractUrl }] : [];

  return {
    title: title || 'Article',
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: title || undefined,
      description,
      url: canonicalUrl,
      ...(ogImages.length > 0 ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length > 0 ? 'summary_large_image' : 'summary',
      title: title || undefined,
      description,
    },
    other,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [articleData, authorsData] = await Promise.all([
    fetchArticleData(id),
    fetchAuthorsData(id),
  ]);

  const staticArticle = FEATURED_ARTICLES.find((a) => a.id === id);

  if (!articleData && !staticArticle) {
    return <ArticleClient />;
  }

  const rawTitle = articleData?.title ?? staticArticle?.title ?? '';
  const title = richTextToPlain(rawTitle);
  const doi: string | undefined = articleData?.doi ?? staticArticle?.doi;
  const volume: string | undefined = articleData?.volume ?? staticArticle?.volume;
  const issue: string | undefined = articleData?.issue ?? staticArticle?.issue;
  const canonicalUrl = `${BASE_URL}/article/${id}`;

  const pubDate = (() => {
    const raw = articleData?.publish_date ?? staticArticle?.published;
    if (!raw || typeof raw !== 'string') return undefined;
    return raw.slice(0, 10);
  })();

  const authorNames = resolveAuthorNames(authorsData, staticArticle?.authors ?? []);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    ...(title ? { headline: title } : {}),
    ...(authorNames.length > 0
      ? { author: authorNames.map((name) => ({ '@type': 'Person', name })) }
      : {}),
    ...(pubDate ? { datePublished: pubDate } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'International Association of Advanced Materials (IAAM)',
    },
    isPartOf: {
      '@type': 'PublicationVolume',
      name: 'Advanced Materials Letters',
      issn: '0976-397X',
      ...(volume ? { volumeNumber: volume } : {}),
      ...(issue ? { issueNumber: issue } : {}),
    },
    ...(doi
      ? { identifier: { '@type': 'PropertyValue', propertyID: 'doi', value: doi } }
      : {}),
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleClient />
    </>
  );
}
