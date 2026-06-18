'use client';

import { useRef, useState } from 'react';
import { getRecentArticles } from '@/lib/realData';
import { FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';

function formatAuthor(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    const { firstName = '', lastName = '' } = author;
    return `${firstName} ${lastName}`.trim();
  }
  return '';
}

export function FeaturedArticles() {
  const articles = getRecentArticles(10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newPosition = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            Featured Articles
          </h2>
          <div className="flex items-center gap-4">
            <a href="/articles" className="text-amber-700 font-semibold hover:text-amber-800 transition">
              All articles →
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-black mb-8"></div>

        <div ref={scrollContainerRef} className="overflow-x-hidden pb-4" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex gap-6 min-w-max">
          {articles.map((article) => (
            <a
              key={article.id}
              href={`/article/${article.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-80 flex flex-col"
            >
              {/* Image */}
              <div className="bg-gray-100 aspect-[4/3] overflow-hidden flex-shrink-0">
                <img
                  src={article.graphical_abstract_url || 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400&h=300&fit=crop'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578926078328-123456789012?w=400&h=300&fit=crop';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col">
                <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-[3rem] text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-1 min-h-[1.25rem]">
                  {(article.authors as any[])
                    .slice(0, 2)
                    .map(formatAuthor)
                    .filter(Boolean)
                    .join(', ')}
                  {(article.authors as any[]).length > 2 ? ' et al.' : ''}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-700 mb-4">
                  {article.volume && (
                    <span><span className="font-semibold">Vol.</span> {article.volume}</span>
                  )}
                  {article.issue && (
                    <span><span className="font-semibold">Issue</span> {article.issue}</span>
                  )}
                  {article.pages && (
                    <span><span className="font-semibold">pp.</span> {article.pages}</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  {article.pdf_url && (
                    <a
                      href={article.pdf_url}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </a>
                  )}
                  <a
                    href={`/article/${article.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    Full text
                  </a>
                </div>
              </div>
            </a>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
