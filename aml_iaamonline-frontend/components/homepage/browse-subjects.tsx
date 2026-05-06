'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SUBJECTS = [
  { id: 1, name: 'Nanotechnology', count: 245 },
  { id: 2, name: 'Energy Materials', count: 189 },
  { id: 3, name: 'Biomaterials', count: 167 },
  { id: 4, name: 'Composites', count: 134 },
  { id: 5, name: '2D Materials', count: 98 },
];

export function BrowseSubjects() {
  return (
    <section className="py-12 bg-[#f0f4fb]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[#0f2d6b] font-semibold" style={{ fontSize: '1.4rem' }}>
            Browse by Subject
          </h2>
          <Link href="/browse" className="flex items-center gap-1 text-[#0f2d6b] text-sm hover:underline font-semibold">
            All subjects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={`/browse?subject=${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white rounded-xl p-4 border border-border hover:border-[#0f2d6b]/30 hover:shadow-sm transition-all text-center group"
            >
              <div className="text-[#0f1a2e] text-sm mb-1 group-hover:text-[#0f2d6b] transition-colors font-semibold">
                {subject.name}
              </div>
              <div className="text-[#5a6a8a] text-xs">{subject.count} articles</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
