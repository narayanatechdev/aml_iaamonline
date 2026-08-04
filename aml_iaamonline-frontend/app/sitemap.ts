import type { MetadataRoute } from 'next';
import { FEATURED_ARTICLES } from '@/lib/realData';

const BASE_URL = 'https://amljournal.iaamonline.org';

const STATIC_ROUTES = [
  '',
  '/about',
  '/access-model',
  '/browse',
  '/news',
  '/author-resources',
  '/editorial-board',
  '/aims-scope',
  '/indexing',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  '/cookie-policy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = FEATURED_ARTICLES.map((article) => ({
    url: `${BASE_URL}/article/${article.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
