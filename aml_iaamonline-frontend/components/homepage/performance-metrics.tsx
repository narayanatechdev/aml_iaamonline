'use client';

import { TrendingUp, Award, ExternalLink, Globe } from 'lucide-react';
import { ARTICLE_STATS } from '@/lib/realData';

export function PerformanceMetrics() {
  const metrics = [
    { label: 'Impact Factor (2025)', value: '3.82', icon: TrendingUp, color: 'text-[#0f2d6b]' },
    { label: 'h-Index', value: '32', icon: Award, color: 'text-[#0f2d6b]' },
    {
      label: 'Total Citations',
      value: ARTICLE_STATS.totalCitations > 1000
        ? (ARTICLE_STATS.totalCitations / 1000).toFixed(1) + 'K+'
        : ARTICLE_STATS.totalCitations.toLocaleString(),
      icon: ExternalLink,
      color: 'text-[#0f2d6b]',
    },
    {
      label: 'Total Views',
      value: ARTICLE_STATS.totalViews > 1000000
        ? (ARTICLE_STATS.totalViews / 1000000).toFixed(1) + 'M+'
        : ARTICLE_STATS.totalViews > 1000
          ? Math.round(ARTICLE_STATS.totalViews / 1000).toLocaleString() + 'K+'
          : ARTICLE_STATS.totalViews.toLocaleString(),
      icon: Globe,
      color: 'text-[#0f2d6b]',
    },
  ];

  return (
    <section className="py-12 bg-[#f0f4fb]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-black mb-8 text-center font-semibold" style={{ fontSize: '1.4rem' }}>
          Journal Performance & Metrics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-white rounded-xl p-6 border border-border text-center shadow-sm">
                <div className={`flex justify-center mb-3 ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`mb-1 ${m.color} font-bold`} style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div className="text-[#5a6a8a] text-xs">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
