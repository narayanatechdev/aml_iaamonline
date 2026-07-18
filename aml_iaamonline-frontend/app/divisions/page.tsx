import type { Metadata } from 'next';

import { MainLayout } from '@/components/layout/main-layout';
import { getHomeSections } from '@/lib/homeSections';
import { divisionHref, resolveChallengeDivisions } from '@/components/homepage/challenge-divisions-data';

export const metadata: Metadata = {
  title: 'Challenge Divisions | Advanced Materials Letters',
  description:
    'The grand-challenge streams that organise content in Advanced Materials Letters.',
};

/**
 * Public "All divisions" page. Shows the same divisions the homepage
 * Challenge Divisions block does, so admin edits in the homepage builder
 * appear here too.
 */
export default async function DivisionsPage() {
  const sections = await getHomeSections();
  const block = sections.find((s) => s.block_type === 'challenge_divisions');
  const { heading, intro, divisions } = resolveChallengeDivisions(block?.content);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold text-black mb-2"
          style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
        >
          {heading}
        </h1>
        <div className="border-b-2 border-black mb-6"></div>
        {intro && <p className="text-gray-700 max-w-2xl mb-10">{intro}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division) => (
            <a
              key={division.name}
              href={divisionHref(division)}
              className="block border border-gray-300 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
            >
              {division.image && (
                <div className="w-full h-44 overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={division.image}
                    alt={division.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2 text-black">{division.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{division.description}</p>
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
    </MainLayout>
  );
}
