'use client';

import { useRef } from 'react';
import { SUBJECTS } from '@/lib/realData';
import { ChevronLeft, ChevronRight, Heart, Zap, Shield, Wand2, Cpu } from 'lucide-react';

const DIVISION_ICONS = [Heart, Zap, Shield, Wand2, Cpu];
const DIVISION_COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#a78bfa', '#ffa500'];

interface DivisionData {
  name: string;
  description: string;
  icon: string;
  image: string;
  articles: number;
}

const DIVISIONS: DivisionData[] = [
  {
    name: 'Materials for Human Health',
    description: 'Clinical translation, decentralized diagnostics, nanomedicine.',
    icon: 'heart',
    image: 'https://picsum.photos/500/300?random=1',
    articles: 412,
  },
  {
    name: 'Intelligent Functional Materials',
    description: 'Responsive, sensing and bioelectronic systems.',
    icon: 'zap',
    image: 'https://picsum.photos/500/300?random=2',
    articles: 368,
  },
  {
    name: 'Sustainable Materials',
    description: 'Climate adaptation, circularity, scalable low-cost tech.',
    icon: 'shield',
    image: 'https://picsum.photos/500/300?random=3',
    articles: 503,
  },
  {
    name: 'Translational Biomaterials',
    description: 'Lab-to-clinic biomaterials & regulatory pathways.',
    icon: 'wand2',
    image: 'https://picsum.photos/500/300?random=4',
    articles: 287,
  },
  {
    name: 'Digital & AI-Designed Materials',
    description: 'AI-guided discovery, dynamic datasets, simulation.',
    icon: 'cpu',
    image: 'https://picsum.photos/500/300?random=5',
    articles: 331,
  },
];

export function ChallengeDivisions() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const getIcon = (index: number) => {
    const Icon = DIVISION_ICONS[index % DIVISION_ICONS.length];
    return <Icon className="w-8 h-8" style={{ color: DIVISION_COLORS[index] }} />;
  };

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            Challenge Divisions
          </h2>
          <a href="/divisions" className="text-amber-700 font-semibold hover:text-amber-800 transition">
            All divisions →
          </a>
        </div>

        {/* Divider */}
        <div className="border-b-2 border-black mb-6"></div>

        {/* Description */}
        <p className="text-gray-700 max-w-2xl mb-8">
          Content is organised around five grand-challenge streams rather than conventional materials sub-disciplines – owning the interdisciplinary edge between materials science, medicine, AI, climate and regulation.
        </p>

        {/* Cards Scroll */}
        <div ref={scrollContainerRef} className="overflow-x-hidden pb-4">
          <div className="flex gap-6 min-w-max">
            {DIVISIONS.map((division, index) => (
              <div
                key={division.name}
                className="flex-shrink-0 w-80 border border-gray-300 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image */}
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
                  <div className="text-sm font-semibold" style={{ color: '#c97706' }}>
                    {division.articles} articles
                  </div>
                </div>
              </div>
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
