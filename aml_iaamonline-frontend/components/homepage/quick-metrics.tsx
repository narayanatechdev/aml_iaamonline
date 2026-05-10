'use client';

import { ARTICLE_STATS, FEATURED_ARTICLES, SUBJECTS } from '@/lib/realData';

export function QuickMetrics() {
  const metrics = [
    { label: 'Published Articles', value: ARTICLE_STATS.total.toLocaleString() + '+' },
    { label: 'Total Downloads', value: ARTICLE_STATS.totalDownloads > 1000 ? Math.round(ARTICLE_STATS.totalDownloads / 1000).toLocaleString() + 'K+' : ARTICLE_STATS.totalDownloads.toLocaleString() },
    { label: 'Journal Volumes', value: String(ARTICLE_STATS.totalVolumes) },
    { label: 'Countries', value: ARTICLE_STATS.totalCountries + '+' },
  ];

  return (
    <section className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="text-[#0f2d6b] font-bold" style={{ fontSize: "1.8rem", lineHeight: 1.2 }}>
                {metric.value}
              </div>
              <div className="text-[#5a6a8a] text-xs mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
