'use client';

import { getRecentArticles } from '@/lib/realData';

function formatAuthor(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    const { firstName = '', lastName = '' } = author;
    return `${firstName} ${lastName}`.trim();
  }
  return '';
}

export function FeaturedArticle() {
  // Get the latest article
  const recentArticles = getRecentArticles(1);
  const latest = recentArticles[0];

  if (!latest) return null;

  const authorList = (latest.authors as any[])
    .slice(0, 3)
    .map(formatAuthor)
    .filter(Boolean)
    .join(', ');

  const abstractExcerpt = latest.abstract
    ? latest.abstract.substring(0, 180) + (latest.abstract.length > 180 ? '...' : '')
    : '';

  const imageUrl =
    latest.graphical_abstract_url ||
    'https://images.unsplash.com/photo-1578926078328-123456789012?w=800&h=500&fit=crop';

  return (
    <section className="bg-white border-b border-gray-200 pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 min-h-[380px]">
          {/* Left Panel - Dark Background with Text (40%) */}
          <div
            className="flex flex-col justify-between p-8 md:p-10 md:col-span-2"
            style={{
              backgroundColor: '#2d3a47',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
            }}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ lineHeight: '1.15', textDecoration: 'underline', textDecorationThickness: '3px', textUnderlineOffset: '0.1em' }}>
                {latest.title}
              </h2>

              <p className="text-base text-white mb-6" style={{ lineHeight: '1.5' }}>
                {authorList} report{latest.authors.length > 1 ? '' : 's'} the findings of this
                research. {abstractExcerpt}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <a
                  href={latest.pdf_url || '#'}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Read article
                </a>
                <a
                  href={latest.pdf_url || '#'}
                  className="px-4 py-2 border border-white text-white text-sm font-semibold rounded hover:bg-white hover:text-gray-800 transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Download PDF
                </a>
                <button
                  className="px-4 py-2 border border-white text-white text-sm font-semibold rounded hover:bg-white hover:text-gray-800 transition-colors"
                  style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif' }}
                >
                  Cite
                </button>
              </div>

              <div className="text-white">
                <div className="text-sm font-semibold mb-1">{authorList}</div>
                <div className="text-xs font-medium">
                  <span className="font-bold">Article</span> | {latest.published}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Image (60%) */}
          <div className="hidden md:block bg-gray-100 overflow-hidden md:col-span-3">
            <img
              src={imageUrl}
              alt={latest.title}
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
              alt={latest.title}
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
