'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedArticles } from '@/lib/realData';

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

const STATUS_TAG_COLORS: Record<string, string> = {
  "Editor's Pick": 'bg-[#0f2d6b]  text-white',
  'Most Viewed': 'bg-[#0f2d6b] text-white',
  'Latest': 'bg-[#0f2d6b] text-white',
  'Most Cited': 'bg-[#0f2d6b] text-white',
};

export function FeaturedContent() {
  const articlesToDisplay = getFeaturedArticles(3).map((a, i) => ({
    ...a,
    tag: i === 0 ? "Editor's Pick" : (i === 1 ? 'Most Viewed' : 'Most Viewed')
  }));

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[#0f2d6b] font-semibold" style={{ fontSize: '1.4rem' }}>
            Featured Articles
          </h2>
          <Link href="/browse/current" className="flex items-center gap-1 text-[#0f2d6b] text-sm hover:underline font-semibold transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articlesToDisplay.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#0f2d6b]/30 hover:shadow-xl transition-all p-6 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                    STATUS_TAG_COLORS[article.tag] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {article.tag}
                </span>
                <span className="text-[#5a6a8a] text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Vol. {article.volume}, No. {article.issue}
                </span>
              </div>
              <h3
                className="text-[#0f1a2e] text-base leading-snug mb-3 group-hover:text-[#0f2d6b] transition-colors line-clamp-3 font-bold"
              >
                {article.title}
              </h3>
              <p className="text-[#5a6a8a] text-xs mb-4 line-clamp-2 leading-relaxed">{article.abstract}</p>
              
              <div className="text-[#0f2d6b] text-xs mb-4 font-semibold">
                {(article.authors || []).slice(0, 2).map(getAuthorName).filter(Boolean).join(', ')}
                {(article.authors || []).length > 2 ? ' et al.' : ''}
              </div>
              
              <div className="flex items-center justify-between text-[10px] border-t pt-4 border-gray-50">
                <span className="text-[#5a6a8a] font-mono leading-none">{article.doi}</span>
                <div className="flex items-center gap-1 font-bold text-[#0f2d6b]">
                  <span>{article.views.toLocaleString()}</span>
                  <span className="text-[#5a6a8a] font-medium opacity-60">views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
