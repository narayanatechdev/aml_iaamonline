import type { HomeSectionBlock } from '@/components/homepage/block-registry';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Default homepage layout, used when the CMS API is unavailable or has no
 * sections yet. Mirrors the original hard-coded order so the page never breaks.
 */
export const DEFAULT_LAYOUT: HomeSectionBlock[] = [
  { id: -1, block_type: 'featured_hero' },
  { id: -2, block_type: 'featured_articles' },
  { id: -3, block_type: 'challenge_divisions' },
  { id: -4, block_type: 'announcements' },
  { id: -5, block_type: 'iaam_fellowship' },
  { id: -6, block_type: 'article_categories' },
  { id: -7, block_type: 'journal_info_header' },
  { id: -8, block_type: 'hero_section' },
  { id: -9, block_type: 'content_layout' },
  { id: -10, block_type: 'cta_section' },
];

/**
 * Fetch the published homepage layout from the CMS. Falls back to
 * DEFAULT_LAYOUT on any error or empty response so the homepage is resilient.
 */
export async function getHomeSections(): Promise<HomeSectionBlock[]> {
  try {
    const res = await fetch(`${API_URL}/home/sections`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return DEFAULT_LAYOUT;

    const json = await res.json();
    const data = json?.data as HomeSectionBlock[] | undefined;

    if (!Array.isArray(data) || data.length === 0) return DEFAULT_LAYOUT;
    return data;
  } catch {
    return DEFAULT_LAYOUT;
  }
}
