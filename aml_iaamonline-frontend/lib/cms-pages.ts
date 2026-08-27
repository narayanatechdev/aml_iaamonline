export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  /** 'prose' = free HTML; otherwise a designed layout key from lib/page-layouts.ts */
  layout: string;
  placement: string;
  position: number;
  is_published: boolean;
  updated_at: string;
}

/**
 * Fetch a published CMS page by slug (server-side). Returns null when the
 * page doesn't exist or the API is unreachable — callers fall back to their
 * built-in content in that case.
 */
export async function fetchCmsPage(slug: string): Promise<CmsPage | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as CmsPage) ?? null;
  } catch {
    return null;
  }
}
