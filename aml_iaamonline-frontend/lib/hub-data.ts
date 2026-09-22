/** Live article data the pubs.iaamonline.org hub pulls from AML's and AMP's own APIs. */

import { HUB_TOPICS, type HubTopic } from './hub-topics';


export interface HubArticle {
  id: string;
  title: string;
  authors: string;
  journal: 'Advanced Materials Letters' | 'Advanced Materials Proceedings';
  journalPath: 'advanced-materials-letters' | 'advanced-materials-proceedings';
  publishDate: string | null;
  views: number;
  citations: number;
  accessLabel: 'Free to read';
}

interface RawArticle {
  id: number;
  legacy_id?: string | null;
  title: string;
  authors?: string | null;
  publish_date?: string | null;
  views_count?: number | null;
  total_views?: number | null;
  cited_count?: number | null;
  total_citations?: number | null;
}

async function fetchJournalArticles(
  apiUrl: string,
  journal: HubArticle['journal'],
  journalPath: HubArticle['journalPath'],
  sort: 'latest' | 'most-cited',
): Promise<HubArticle[]> {
  const params = new URLSearchParams({ per_page: '6' });
  if (sort === 'most-cited') {
    params.set('sort_by', 'total_citations');
    params.set('sort_order', 'desc');
  }

  try {
    const res = await fetch(`${apiUrl}/articles?${params.toString()}`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const body = await res.json();
    const rows: RawArticle[] = body.data ?? [];

    return rows.map((a) => ({
      id: String(a.legacy_id ?? a.id),
      title: a.title,
      authors: a.authors ?? '',
      journal,
      journalPath,
      publishDate: a.publish_date ? a.publish_date.slice(0, 10) : null,
      views: a.total_views ?? a.views_count ?? 0,
      citations: a.total_citations ?? a.cited_count ?? 0,
      accessLabel: 'Free to read',
    }));
  } catch {
    return [];
  }
}

/** Merges AML + AMP, most-recent first across both journals. */
export async function getLatestArticles(limit = 6): Promise<HubArticle[]> {
  const amlUrl = process.env.NEXT_PUBLIC_AML_API_URL!;
  const ampUrl = process.env.NEXT_PUBLIC_AMP_API_URL!;

  const [aml, amp] = await Promise.all([
    fetchJournalArticles(amlUrl, 'Advanced Materials Letters', 'advanced-materials-letters', 'latest'),
    fetchJournalArticles(ampUrl, 'Advanced Materials Proceedings', 'advanced-materials-proceedings', 'latest'),
  ]);

  return [...aml, ...amp]
    .sort((a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''))
    .slice(0, limit);
}

/** Merges AML + AMP, most cited first across both journals. */
export async function getMostCitedArticles(limit = 6): Promise<HubArticle[]> {
  const amlUrl = process.env.NEXT_PUBLIC_AML_API_URL!;
  const ampUrl = process.env.NEXT_PUBLIC_AMP_API_URL!;

  const [aml, amp] = await Promise.all([
    fetchJournalArticles(amlUrl, 'Advanced Materials Letters', 'advanced-materials-letters', 'most-cited'),
    fetchJournalArticles(ampUrl, 'Advanced Materials Proceedings', 'advanced-materials-proceedings', 'most-cited'),
  ]);

  return [...aml, ...amp].sort((a, b) => b.citations - a.citations).slice(0, limit);
}

export interface HubStats {
  articleCount: number;
  journalCount: number;
}

/** Real counts, computed live — not the unverified marketing figures in the design draft. */
export async function getHubStats(): Promise<HubStats> {
  const amlUrl = process.env.NEXT_PUBLIC_AML_API_URL!;
  const ampUrl = process.env.NEXT_PUBLIC_AMP_API_URL!;

  const totals = await Promise.all(
    [amlUrl, ampUrl].map(async (apiUrl) => {
      try {
        const res = await fetch(`${apiUrl}/articles?per_page=1`, { next: { revalidate: 3600 } });
        if (!res.ok) return 0;
        const body = await res.json();
        return Number(body.total ?? 0);
      } catch {
        return 0;
      }
    }),
  );

  return {
    articleCount: totals.reduce((sum, n) => sum + n, 0),
    journalCount: 2,
  };
}

/* ------------------------------------------------------------------ *
 * Shared journal plumbing for the hub's inner pages.
 *
 * Everything below reads AML's and AMP's own public APIs. Nothing here
 * invents a number: counts come from /articles/stats and /reference, and
 * listings come from /articles, which filters on q, volume, year, subject
 * and type. Where a journal has nothing to return, the page says so rather
 * than falling back to a plausible-looking figure.
 * ------------------------------------------------------------------ */

export interface HubJournal {
  key: 'aml' | 'amp';
  name: HubArticle['journal'];
  path: HubArticle['journalPath'];
  short: string;
  apiUrl: string;
}

export function hubJournals(): HubJournal[] {
  return [
    {
      key: 'aml',
      name: 'Advanced Materials Letters',
      path: 'advanced-materials-letters',
      short: 'AML',
      apiUrl: process.env.NEXT_PUBLIC_AML_API_URL || 'https://amljournal.iaamonline.org/api',
    },
    {
      key: 'amp',
      name: 'Advanced Materials Proceedings',
      path: 'advanced-materials-proceedings',
      short: 'AMP',
      apiUrl: process.env.NEXT_PUBLIC_AMP_API_URL || 'https://ampjournal.iaamonline.org/api',
    },
  ];
}

/** The APIs return subject names HTML-escaped ("Environmental &amp; Green Materials"). */
function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

async function getJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toHubArticle(row: RawArticle, journal: HubJournal): HubArticle {
  return {
    id: String(row.legacy_id ?? row.id),
    title: row.title,
    authors: row.authors ?? '',
    journal: journal.name,
    journalPath: journal.path,
    publishDate: row.publish_date ? row.publish_date.slice(0, 10) : null,
    views: row.total_views ?? row.views_count ?? 0,
    citations: row.total_citations ?? row.cited_count ?? 0,
    accessLabel: 'Free to read',
  };
}

interface Paginated {
  data?: RawArticle[];
  total?: number;
}

/** One page of /articles from one journal, with the real total alongside it. */
async function fetchArticlePage(
  journal: HubJournal,
  params: Record<string, string>,
  revalidate = 900,
): Promise<{ articles: HubArticle[]; total: number }> {
  const qs = new URLSearchParams(params).toString();
  const body = await getJson<Paginated>(`${journal.apiUrl}/articles?${qs}`, revalidate);
  if (!body) return { articles: [], total: 0 };
  return {
    articles: (body.data ?? []).map((row) => toHubArticle(row, journal)),
    total: Number(body.total ?? 0),
  };
}

export interface JournalStats {
  total: number;
  totalViews: number;
  totalDownloads: number;
  totalCitations: number;
  totalAuthors: number;
  byYear: Record<string, number>;
  bySubject: Record<string, number>;
  byType: Record<string, number>;
}

interface RawStats {
  total?: number;
  total_views?: number;
  total_downloads?: number;
  total_citations?: number;
  total_authors?: number;
  by_year?: Record<string, number>;
  by_subject?: Record<string, number>;
  by_type?: Record<string, number>;
}

function decodeKeys(input: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(input ?? {})) out[decodeEntities(key)] = value;
  return out;
}

export async function getJournalStats(journal: HubJournal): Promise<JournalStats | null> {
  const raw = await getJson<RawStats>(`${journal.apiUrl}/articles/stats`, 3600);
  if (!raw) return null;
  return {
    total: raw.total ?? 0,
    totalViews: raw.total_views ?? 0,
    totalDownloads: raw.total_downloads ?? 0,
    totalCitations: raw.total_citations ?? 0,
    totalAuthors: raw.total_authors ?? 0,
    byYear: raw.by_year ?? {},
    bySubject: decodeKeys(raw.by_subject),
    byType: raw.by_type ?? {},
  };
}

export async function getAllJournalStats(): Promise<{ journal: HubJournal; stats: JournalStats | null }[]> {
  return Promise.all(
    hubJournals().map(async (journal) => ({ journal, stats: await getJournalStats(journal) })),
  );
}

/** Volume list per journal, newest first, straight from /reference. */
export async function getJournalVolumes(journal: HubJournal): Promise<string[]> {
  const raw = await getJson<{ volumes?: string[] }>(`${journal.apiUrl}/reference`, 3600);
  return (raw?.volumes ?? [])
    .filter((v) => v !== null && v !== '')
    .sort((a, b) => Number(b) - Number(a));
}

/* ---------------------------- Topics ---------------------------- */

/**
 * Mirrors the API's `subject` filter, which is a case-insensitive LIKE
 * "%term%", so the counts shown on /topics match what /topics/[slug] lists.
 */
function subjectMatches(subject: string, terms: string[]): boolean {
  const haystack = subject.toLowerCase();
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

export interface TopicCount {
  topic: HubTopic;
  count: number;
}

/**
 * Article count per topic across both journals, derived from each journal's
 * by_subject breakdown — two API calls rather than one per subject term.
 */
export async function getTopicCounts(): Promise<TopicCount[]> {
  const all = await getAllJournalStats();

  return HUB_TOPICS.map((topic) => {
    if (topic.subjects.length === 0) return { topic, count: 0 };

    const count = all.reduce((sum, { stats }) => {
      if (!stats) return sum;
      return (
        sum +
        Object.entries(stats.bySubject)
          .filter(([subject]) => subjectMatches(subject, topic.subjects))
          .reduce((n, [, value]) => n + value, 0)
      );
    }, 0);

    return { topic, count };
  });
}

export interface TopicArticles {
  articles: HubArticle[];
  total: number;
  /** Subject values that actually returned articles, for the "what's included" note. */
  matchedSubjects: string[];
}

/**
 * Articles for one topic. The API filters on a single subject at a time, so a
 * topic spanning several subjects fans out and merges, newest first.
 */
export async function getTopicArticles(topic: HubTopic, limit = 24): Promise<TopicArticles> {
  if (topic.subjects.length === 0) return { articles: [], total: 0, matchedSubjects: [] };

  const perSubject = Math.max(Math.ceil(limit / topic.subjects.length), 8);

  const results = await Promise.all(
    hubJournals().flatMap((journal) =>
      topic.subjects.map(async (subject) => {
        const page = await fetchArticlePage(journal, {
          subject,
          per_page: String(Math.min(perSubject * 2, 100)),
          sort: 'publish_date',
          dir: 'desc',
        });
        return { subject, ...page };
      }),
    ),
  );

  const seen = new Set<string>();
  const articles: HubArticle[] = [];
  for (const result of results) {
    for (const article of result.articles) {
      const key = `${article.journalPath}-${article.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      articles.push(article);
    }
  }

  articles.sort((a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''));

  return {
    articles: articles.slice(0, limit),
    total: results.reduce((sum, r) => sum + r.total, 0),
    matchedSubjects: [...new Set(results.filter((r) => r.total > 0).map((r) => r.subject))],
  };
}

/* ---------------------------- Search ---------------------------- */

export interface HubSearchResult {
  articles: HubArticle[];
  totalsByJournal: { journal: HubJournal; total: number }[];
  total: number;
}

/** Free-text search across both journals, with the optional filters the API supports. */
export async function searchHubArticles(
  query: string,
  filters: { journal?: string; year?: string; type?: string; subject?: string } = {},
  limit = 30,
): Promise<HubSearchResult> {
  const journals = hubJournals().filter((j) => !filters.journal || filters.journal === j.key);

  const results = await Promise.all(
    journals.map(async (journal) => {
      const params: Record<string, string> = {
        per_page: String(Math.min(limit, 100)),
        sort: 'publish_date',
        dir: 'desc',
      };
      if (query) params.q = query;
      if (filters.year) params.year = filters.year;
      if (filters.type) params.type = filters.type;
      if (filters.subject) params.subject = filters.subject;

      const page = await fetchArticlePage(journal, params, 300);
      return { journal, ...page };
    }),
  );

  const articles = results
    .flatMap((r) => r.articles)
    .sort((a, b) => (b.publishDate ?? '').localeCompare(a.publishDate ?? ''))
    .slice(0, limit);

  return {
    articles,
    totalsByJournal: results.map((r) => ({ journal: r.journal, total: r.total })),
    total: results.reduce((sum, r) => sum + r.total, 0),
  };
}

/* ---------------------------- Archive ---------------------------- */

export interface ArchiveJournal {
  journal: HubJournal;
  volumes: string[];
  stats: JournalStats | null;
}

export async function getArchive(): Promise<ArchiveJournal[]> {
  return Promise.all(
    hubJournals().map(async (journal) => ({
      journal,
      volumes: await getJournalVolumes(journal),
      stats: await getJournalStats(journal),
    })),
  );
}

/** Articles in one volume of one journal, for the archive's volume view. */
export async function getVolumeArticles(
  journalKey: string,
  volume: string,
  limit = 100,
): Promise<{ journal: HubJournal; articles: HubArticle[]; total: number } | null> {
  const journal = hubJournals().find((j) => j.key === journalKey);
  if (!journal) return null;

  const page = await fetchArticlePage(journal, {
    volume,
    per_page: String(Math.min(limit, 100)),
    sort: 'publish_date',
    dir: 'desc',
  });

  return { journal, ...page };
}

/* ------------------------- Access & submission ------------------------- */

export interface AccessPlan {
  key: string;
  name: string;
  audience: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  benefits: string[];
  featured: boolean;
}

export interface AccessModel {
  enabled: boolean;
  preview: string;
  freeUntilVolume: number;
  freeUntilYear: number;
  plans: AccessPlan[];
  articlePrice: number;
  currency: string;
  apc: { enabled: boolean; research: number; review: number } | null;
  contactEmail: string;
}

interface RawAccessModel {
  enabled?: boolean;
  preview?: string;
  free_until_volume?: number;
  free_until_year?: number;
  plans?: AccessPlan[];
  article_price?: number;
  currency?: string;
  apc?: { enabled?: boolean; research?: number; review?: number };
  contact_email?: string;
}

/**
 * The 2027 access model. AML and AMP return the same settings, so the hub
 * reads AML's and treats it as the publisher-wide policy.
 */
export async function getAccessModel(): Promise<AccessModel | null> {
  const [aml] = hubJournals();
  const body = await getJson<{ data?: RawAccessModel }>(`${aml.apiUrl}/access-model`, 600);
  const raw = body?.data;
  if (!raw) return null;

  return {
    enabled: raw.enabled ?? false,
    preview: raw.preview ?? 'abstract',
    freeUntilVolume: raw.free_until_volume ?? 17,
    freeUntilYear: raw.free_until_year ?? 2026,
    plans: raw.plans ?? [],
    articlePrice: raw.article_price ?? 0,
    currency: raw.currency ?? 'EUR',
    apc: raw.apc?.enabled
      ? { enabled: true, research: raw.apc.research ?? 0, review: raw.apc.review ?? 0 }
      : null,
    contactEmail: raw.contact_email ?? 'publishers@iaamonline.org',
  };
}

export interface SubmissionGate {
  invitedOnly: boolean;
  invitedOnlyFrom: string | null;
  message: string | null;
}

/** What the journals tell authors about the invitation-only route. */
export async function getSubmissionGate(): Promise<SubmissionGate | null> {
  const [aml] = hubJournals();
  const body = await getJson<{
    data?: { invited_only?: boolean; invited_only_from?: string | null; message?: string | null };
  }>(`${aml.apiUrl}/submission-gate`, 600);
  const raw = body?.data;
  if (!raw) return null;

  return {
    invitedOnly: raw.invited_only ?? false,
    invitedOnlyFrom: raw.invited_only_from ?? null,
    message: raw.message ?? null,
  };
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency || 'EUR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
