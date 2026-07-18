import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MainLayout } from '@/components/layout/main-layout';
import { getHomeSections } from '@/lib/homeSections';
import {
  divisionSlug,
  resolveChallengeDivisions,
  type DivisionData,
} from '@/components/homepage/challenge-divisions-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MappedArticle {
  id: number;
  legacy_id?: string | null;
  title: string;
  publish_year?: number | null;
  document_type?: string | null;
  volume?: number | string | null;
  issue?: number | string | null;
}

async function findDivision(slug: string): Promise<DivisionData | undefined> {
  const sections = await getHomeSections();
  const block = sections.find((s) => s.block_type === 'challenge_divisions');
  const { divisions } = resolveChallengeDivisions(block?.content);
  return divisions.find((d) => divisionSlug(d.name) === slug);
}

/** Published articles mapped to this division in the admin articles screen. */
async function getMappedArticles(divisionName: string): Promise<MappedArticle[]> {
  try {
    const params = new URLSearchParams({ division: divisionName, per_page: '50' });
    const res = await fetch(`${API_URL}/articles?${params}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const division = await findDivision(slug);
  if (!division) return { title: 'Division not found | Advanced Materials Letters' };
  return {
    title: `${division.name} | Advanced Materials Letters`,
    description: division.description || `The ${division.name} challenge division.`,
  };
}

/** Public page for one challenge division, driven by the same CMS content. */
export default async function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const division = await findDivision(slug);
  if (!division) notFound();
  const articles = await getMappedArticles(division.name);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <a
          href="/divisions"
          className="inline-flex items-center gap-1.5 text-sm text-amber-700 font-semibold hover:text-amber-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All divisions
        </a>

        <h1
          className="text-4xl font-bold text-black mb-2"
          style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
        >
          {division.name}
        </h1>
        <div className="border-b-2 border-black mb-6"></div>

        {division.image && (
          <div className="w-full h-64 sm:h-80 overflow-hidden rounded-lg bg-gray-100 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={division.image}
              alt={division.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {division.description && (
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-6">
            {division.description}
          </p>
        )}

        {division.articles && (
          <p className="text-sm font-semibold mb-10" style={{ color: '#c97706' }}>
            {division.articles} articles in this division
          </p>
        )}

        <div className="mb-10">
          <h2
            className="text-2xl font-bold text-black mb-2"
            style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}
          >
            Articles in this division
          </h2>
          <div className="border-b border-gray-300 mb-4"></div>
          {articles.length === 0 ? (
            <p className="text-sm text-gray-500">
              No articles have been mapped to this division yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {articles.map((a) => (
                <li key={a.id}>
                  <a
                    href={`/article/${a.legacy_id ?? a.id}`}
                    className="block py-3 group"
                  >
                    <p className="text-sm font-medium text-gray-900 group-hover:text-[#0f2d6b] transition-colors">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[
                        a.document_type,
                        a.volume != null && a.issue != null ? `Vol. ${a.volume}, Issue ${a.issue}` : null,
                        a.publish_year,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/browse/current"
            className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]"
          >
            Browse latest articles
          </a>
          <a
            href="/submit"
            className="px-4 py-2 text-sm font-medium text-[#0f2d6b] border border-[#0f2d6b]/30 rounded-lg hover:bg-[#f0f4fb]"
          >
            Submit to this division
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
