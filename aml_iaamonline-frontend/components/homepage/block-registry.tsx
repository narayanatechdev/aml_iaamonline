import type { ComponentType } from 'react';

import { FeaturedArticle } from '@/components/layout/featured-hero';
import { FeaturedArticles } from '@/components/homepage/featured-articles';
import { OnTheCover } from '@/components/homepage/on-the-cover';
import { ChallengeDivisions } from '@/components/homepage/challenge-divisions';
import { Announcements } from '@/components/homepage/announcements';
import { IAAMFellowship } from '@/components/homepage/iaam-fellowship';
import { ArticleCategories } from '@/components/homepage/article-categories';
import { JournalInfoHeader } from '@/components/homepage/journal-info-header';
import { HeroSection } from '@/components/homepage/hero-section';
import { ContentLayout } from '@/components/homepage/content-layout';
import { CTASection } from '@/components/homepage/cta-section';
import { RichTextBlock } from '@/components/homepage/rich-text-block';
import { ImageBannerBlock } from '@/components/homepage/image-banner-block';

/** A homepage block coming from the CMS API. */
export interface HomeSectionBlock {
  id: number;
  block_type: string;
  content?: Record<string, unknown>;
}

/** Metadata used by the admin builder to describe each block type. */
export interface BlockTypeMeta {
  type: string;
  label: string;
  description: string;
  /** Whether this block has editable content fields in the builder. */
  editable: boolean;
}

export type BlockComponent = ComponentType<{ content?: Record<string, unknown> }>;

/**
 * Maps a block_type to its renderer. Components that accept editable content
 * receive a `content` prop; the fixed marketing sections ignore it. Component
 * prop shapes vary (some take `className`, some take nothing), so the map is
 * cast through `unknown` — every renderer is invoked with only an optional
 * `content` prop, which any of them can safely ignore.
 */
export const BLOCK_COMPONENTS: Record<string, BlockComponent> = {
  featured_hero: FeaturedArticle,
  featured_articles: FeaturedArticles,
  on_the_cover: OnTheCover,
  challenge_divisions: ChallengeDivisions,
  announcements: Announcements,
  iaam_fellowship: IAAMFellowship,
  article_categories: ArticleCategories,
  journal_info_header: JournalInfoHeader,
  hero_section: HeroSection,
  content_layout: ContentLayout,
  cta_section: CTASection,
  rich_text: RichTextBlock,
  image_banner: ImageBannerBlock,
} as unknown as Record<string, BlockComponent>;

/** Catalogue shown in the "Add block" picker of the admin builder. */
export const BLOCK_CATALOGUE: BlockTypeMeta[] = [
  { type: 'featured_hero', label: 'Featured Article (Hero)', description: 'Large hero — latest article automatically, or pick your own.', editable: true },
  { type: 'featured_articles', label: 'Featured Articles', description: 'Carousel of featured/recent articles.', editable: true },
  { type: 'on_the_cover', label: 'On the Cover', description: 'Current issue cover spotlight — image, title, description, volume/issue.', editable: true },
  { type: 'challenge_divisions', label: 'Challenge Divisions', description: 'Grid of research challenge divisions.', editable: false },
  { type: 'announcements', label: 'Announcements', description: 'Latest journal announcements.', editable: true },
  { type: 'iaam_fellowship', label: 'IAAM Fellowship', description: 'Fellowship promo section.', editable: false },
  { type: 'article_categories', label: 'Article Categories', description: 'Browse-by-category grid.', editable: false },
  { type: 'journal_info_header', label: 'Journal Info Header', description: 'Journal metadata / cover strip.', editable: false },
  { type: 'hero_section', label: 'Hero Section', description: 'Secondary hero banner.', editable: false },
  { type: 'content_layout', label: 'Content Layout', description: 'Main content + sidebar layout.', editable: false },
  { type: 'cta_section', label: 'Call To Action', description: 'Closing call-to-action band.', editable: false },
  { type: 'rich_text', label: 'Rich Text', description: 'Custom heading + paragraph block.', editable: true },
  { type: 'image_banner', label: 'Image Banner', description: 'Full-width image with title and CTA.', editable: true },
];

export function getBlockComponent(type: string): BlockComponent | null {
  return BLOCK_COMPONENTS[type] ?? null;
}

export function getBlockMeta(type: string): BlockTypeMeta | undefined {
  return BLOCK_CATALOGUE.find((b) => b.type === type);
}
