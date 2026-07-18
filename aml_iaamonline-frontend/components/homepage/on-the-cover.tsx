import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const ON_THE_COVER_DEFAULTS = {
  title: 'Microwave-Assisted Synthesis of Platinum-Nickel Nanoalloys',
  description:
    'This cover visualizes the microwave-assisted synthesis of platinum-nickel nanoalloys on nitrogen-doped graphene and their practical applications such as water electrolysis and fuel cell. This research concentrates on the fast and facile synthetic procedure using microwave heating with reducing the amount of platinum and enhancing the catalytic performance by the control of lattice strain and nitrogen doping.',
  volume: '17',
  issue: '1',
  year: '2026',
  imageUrl: 'https://aml.iaamonline.org/data/aml/coversheet/cover_en.jpg',
};

export interface OnTheCoverContent {
  title?: string;
  description?: string;
  volume?: string;
  issue?: string;
  year?: string;
  imageUrl?: string;
}

/** Use the CMS value when it is a non-empty string; otherwise fall back. */
function pick(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

export function OnTheCover({ content = {} }: { content?: OnTheCoverContent } = {}) {
  const coverPage = {
    title: pick(content.title, ON_THE_COVER_DEFAULTS.title),
    description: pick(content.description, ON_THE_COVER_DEFAULTS.description),
    volume: pick(content.volume, ON_THE_COVER_DEFAULTS.volume),
    issue: pick(content.issue, ON_THE_COVER_DEFAULTS.issue),
    year: pick(content.year, ON_THE_COVER_DEFAULTS.year),
    imageUrl: pick(content.imageUrl, ON_THE_COVER_DEFAULTS.imageUrl),
  };

  return (
    <section className="bg-white py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-4xl font-bold text-black" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
            Cover Page
          </h2>
        </div>

        <div className="border-b-2 border-black mb-8"></div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-8 shadow-sm">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Cover image - left side */}
            <div className="md:w-72 md:flex-shrink-0">
              <div className="mx-auto w-full max-w-72 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-[#2E8B57] to-[#1E5F3F] shadow-md">
                <img
                  src={coverPage.imageUrl}
                  alt={`Advanced Materials Letters Volume ${coverPage.volume}, Issue ${coverPage.issue} Cover Page`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Cover details - right side */}
            <div className="flex-1 min-w-0">
              <div className="mb-3 inline-flex items-center rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a7a18]">
                Volume {coverPage.volume}, Issue {coverPage.issue} • {coverPage.year}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight" style={{ fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif" }}>
                {coverPage.title}
              </h3>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                {coverPage.description}
              </p>

              <Link
                href={`/browse/archive?volume=${coverPage.volume}&issue=${coverPage.issue}`}
                className="inline-flex items-center gap-2 rounded-md bg-[#0f2d6b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d2560]"
              >
                Browse issue {coverPage.issue} (Vol. {coverPage.volume})
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
