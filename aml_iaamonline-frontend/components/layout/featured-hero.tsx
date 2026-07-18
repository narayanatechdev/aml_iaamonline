'use client';

import { getRecentArticles, getArticleById } from '@/lib/realData';
import { useArticleMedia, withLiveMedia } from '@/lib/live-media';

function formatAuthor(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    const { firstName = '', lastName = '' } = author;
    return `${firstName} ${lastName}`.trim();
  }
  return '';
}

interface HeroContent {
  /** 'auto' = latest published article (default); 'article' = the picked articleId. */
  mode?: 'auto' | 'article';
  articleId?: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1578926078328-123456789012?w=800&h=500&fit=crop';

export function FeaturedArticle({ content = {} }: { content?: HeroContent } = {}) {
  // Pick the article to feature: a specific one if chosen, else the latest.
  const media = useArticleMedia();
  const picked = content.mode === 'article' && content.articleId
    ? getArticleById(content.articleId)
    : undefined;
  const latest = getRecentArticles(1)[0];
  const base = picked ?? latest;
  const article = base ? withLiveMedia([base], media)[0] : undefined;

  if (!article) return null;

  const authorList = (article.authors as any[])
    .slice(0, 3)
    .map(formatAuthor)
    .filter(Boolean)
    .join(', ');

  const abstractExcerpt = article.abstract
    ? article.abstract.substring(0, 180) + (article.abstract.length > 180 ? '...' : '')
    : '';

  const title = article.title || '';
  const description = `${authorList} report${(article.authors as any[]).length > 1 ? '' : 's'} the findings of this research. ${abstractExcerpt}`;
  const readUrl = article.pdf_url || '#';
  const pdfUrl = article.pdf_url || '#';
  const dateLabel = article.published || '';

  const imageUrl = article.graphical_abstract_url || FALLBACK_IMAGE;

  return (
    <section className="bg-white border-b border-gray-200 pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 min-h-[380px]">
          {/* Left Panel - Light Grey Background with Text (40%) */}
          <div
            className="flex flex-col justify-between p-8 md:p-10 md:col-span-2"
            style={{
              backgroundColor: '#eceef0',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
            }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4" style={{ lineHeight: '1.15' }}>
                {title}
              </h2>

              <p className="text-base text-gray-700 mb-6" style={{ lineHeight: '1.5' }}>
                {description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <a
                  href={readUrl}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Read article
                </a>
                <a
                  href={pdfUrl}
                  className="px-4 py-2 border border-gray-700 text-gray-800 text-sm font-semibold rounded hover:bg-gray-800 hover:text-white transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Download PDF
                </a>
                <button
                  className="px-4 py-2 border border-gray-700 text-gray-800 text-sm font-semibold rounded hover:bg-gray-800 hover:text-white transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Cite
                </button>
              </div>

              <div className="text-gray-800">
                <div className="text-sm font-semibold mb-1">{authorList}</div>
                <div className="text-xs font-medium">
                  <span className="font-bold">Article</span>{dateLabel ? ` | ${dateLabel}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Image (60%) */}
          <div className="hidden md:block bg-gray-100 overflow-hidden md:col-span-3">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1578926078328-123456789012?w=800&h=500&fit=crop';
              }}
            />
          </div>

          {/* Mobile Image - appears below text on mobile */}
          <div className="md:hidden bg-gray-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1578926078328-123456789012?w=800&h=500&fit=crop';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
