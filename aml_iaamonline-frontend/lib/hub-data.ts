/** Live article data the pubs.iaamonline.org hub pulls from AML's and AMP's own APIs. */

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
