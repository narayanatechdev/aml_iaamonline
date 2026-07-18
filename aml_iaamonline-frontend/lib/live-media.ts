'use client';

import { useEffect, useState } from 'react';

export interface ArticleMedia {
  graphical_abstract_url: string | null;
  pdf_url: string | null;
}

export type ArticleMediaMap = Record<string, ArticleMedia>;

// Shared per-session cache so every component on a page reuses one request.
let cache: ArticleMediaMap | null = null;
let pending: Promise<ArticleMediaMap | null> | null = null;

async function fetchMediaMap(): Promise<ArticleMediaMap | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/media-map`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.media ?? null;
  } catch {
    return null;
  }
}

/**
 * Live image/PDF URLs for all published articles, keyed by article id.
 * Lets pages built from the static articles_data.json snapshot show
 * admin edits (graphical-abstract uploads etc.) without a rebuild.
 */
export function useArticleMedia(): ArticleMediaMap | null {
  const [media, setMedia] = useState<ArticleMediaMap | null>(cache);

  useEffect(() => {
    if (cache) return;
    pending = pending ?? fetchMediaMap();
    let cancelled = false;
    pending.then((map) => {
      if (map) cache = map;
      if (!cancelled && map) setMedia(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return media;
}

/**
 * Overlay live media onto articles from the static snapshot. The database is
 * the source of truth for graphical abstracts (it covers every image the
 * snapshot has), so its value wins even when cleared; PDFs fall back to the
 * snapshot when the database has none.
 */
export function withLiveMedia<
  T extends { id: string; graphical_abstract_url?: string; pdf_url?: string },
>(articles: T[], media: ArticleMediaMap | null): T[] {
  if (!media) return articles;
  return articles.map((article) => {
    const live = media[String(article.id)];
    if (!live) return article;
    return {
      ...article,
      graphical_abstract_url: live.graphical_abstract_url ?? undefined,
      pdf_url: live.pdf_url ?? article.pdf_url,
    };
  });
}
