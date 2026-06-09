'use client';

import { ARTICLE_STATS } from '@/lib/realData';

interface Category {
  name: string;
  type: string; // peer-reviewed, new, invited, etc.
}

const CATEGORIES: Category[] = [
  { name: 'Original Research Articles', type: 'peer-reviewed' },
  { name: 'Reviews & Perspectives', type: 'invited' },
  { name: 'Case Studies in Translational Materials', type: 'new' },
  { name: 'Innovation-to-Industry Reports', type: 'new' },
  { name: 'Science Policy & Research Governance', type: 'new' },
  { name: 'Regulatory & Ethical Perspectives', type: 'new' },
  { name: 'AI in Materials Discovery', type: 'new' },
  { name: 'Commercialization & Start-up Stories', type: 'new' },
  { name: 'Perspectives from Global Leaders', type: 'invited' },
  { name: 'Young Scientist & Emerging Innovator', type: 'new' },
  { name: 'White Papers & Vision Papers', type: 'Fellow-led' },
  { name: 'Global Scientific Roadmaps', type: 'Fellow-led' },
];

const TYPE_COLORS: Record<string, string> = {
  'peer-reviewed': '#6b7280',
  'invited': '#9ca3af',
  'new': '#d1d5db',
  'Fellow-led': '#b45309',
};

export function ArticleCategories() {
  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Article Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-4xl font-bold text-black mb-2" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            Article categories
          </h2>

          {/* Divider */}
          <div className="border-b-2 border-black mb-6"></div>

          {/* Description */}
          <p className="text-gray-700 mb-8">
            Expanding beyond traditional research and reviews to increase readership, policy relevance and translational uptake.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-6">
            {CATEGORIES.map((category, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{category.name}</p>
                </div>
                <span
                  className="px-3 py-1 rounded text-xs font-semibold text-white flex-shrink-0 whitespace-nowrap"
                  style={{ backgroundColor: TYPE_COLORS[category.type] }}
                >
                  {category.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Publishing Excellence Stats */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
              15+ years of publishing excellence
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Published by International Association of Advanced Materials (non-profit) since June 2010 · now in Volume 17 (2026)
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-blue-900">2,000+</div>
                <div className="text-xs text-gray-600 mt-1">peer-reviewed articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">7,000+</div>
                <div className="text-xs text-gray-600 mt-1">authors worldwide</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">5,500+</div>
                <div className="text-xs text-gray-600 mt-1">universities & organizations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">75+</div>
                <div className="text-xs text-gray-600 mt-1">countries contributing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">500K+</div>
                <div className="text-xs text-gray-600 mt-1">annual readers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-900">135+</div>
                <div className="text-xs text-gray-600 mt-1">countries reached</div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <span className="font-bold">A not-for-profit publication</span> — sustained by the IAAM Consortium & cooperation partners; surplus reinvested in science.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
