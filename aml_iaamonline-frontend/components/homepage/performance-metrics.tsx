'use client';

import { TrendingUp, Award, ExternalLink, Globe } from 'lucide-react';

export function PerformanceMetrics() {
  const metrics = [
    { label: 'Impact Factor (2025)', value: '3.82', icon: TrendingUp, color: 'text-[#0f2d6b]' },
    { label: 'h-Index', value: '32', icon: Award, color: 'text-[#0f2d6b]' },
    { label: 'Total Citations', value: '8.5K+', icon: ExternalLink, color: 'text-[#0f2d6b]' },
    { label: 'Global Downloads', value: '2.8M+', icon: Globe, color: 'text-[#0f2d6b]' },
  ];

  return (
    <section className="py-12 bg-[#f0f4fb]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-[#0f2d6b] mb-8 text-center font-semibold" style={{ fontSize: '1.4rem' }}>
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
