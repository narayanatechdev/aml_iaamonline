'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { divisionHref, resolveChallengeDivisions } from '@/components/homepage/challenge-divisions-data';

export {
  CHALLENGE_DIVISIONS_DEFAULTS,
  resolveChallengeDivisions,
  type DivisionData,
  type ResolvedChallengeDivisions,
} from '@/components/homepage/challenge-divisions-data';

export function ChallengeDivisions({ content }: { content?: Record<string, unknown> }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { heading, intro, linkLabel, linkHref, divisions } = resolveChallengeDivisions(content);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            {heading}
          </h2>
          {linkHref && linkLabel && (
            <a href={linkHref} className="text-amber-700 font-semibold hover:text-amber-800 transition">
              {linkLabel}
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="border-b-2 border-black mb-6"></div>

        {/* Description */}
        {intro && <p className="text-gray-700 max-w-2xl mb-8">{intro}</p>}

        {/* Cards Scroll */}
        <div ref={scrollContainerRef} className="overflow-x-hidden pb-4">
          <div className="flex gap-6 min-w-max">
            {divisions.map((division) => (
              <a
                key={division.name}
                href={divisionHref(division)}
                className="block flex-shrink-0 w-80 border border-gray-300 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image */}
                {division.image && (
                  <div className="w-full h-40 overflow-hidden bg-gray-100">
                    <img
                      src={division.image}
                      alt={division.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578926078328-123456789012?w=500&h=300&fit=crop';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="pr-6 py-4 pl-0">
                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 text-black">
                    {division.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 min-h-12">
                    {division.description}
                  </p>

                  {/* Article count */}
                  {division.articles && (
                    <div className="text-sm font-semibold" style={{ color: '#c97706' }}>
                      {division.articles} articles
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-2 mt-6 justify-end">
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
    </section>
  );
}
