'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface SDG {
  id: number;
  sdg_number: number;
  name: string;
  description: string;
  color_code: string;
}

interface SDGDisplayProps {
  sdgs?: SDG[] | null;
}

export function SDGDisplay({ sdgs }: SDGDisplayProps) {
  const [expandedSDG, setExpandedSDG] = useState<number | null>(null);

  if (!sdgs || sdgs.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-4xl">
        <h2
          className="text-2xl font-bold text-black mb-6"
          style={{
            fontFamily: "'Linux Libertine', 'Georgia', 'Times', 'Source Serif 4', serif",
          }}
        >
          Sustainable Development Goals
        </h2>

        <p className="text-sm text-gray-600 mb-8">
          This article contributes to the following United Nations Sustainable Development Goals:
        </p>

        {/* SDG Pills */}
        <div className="space-y-3">
          {sdgs.map((sdg) => (
            <div key={sdg.id} className="space-y-2">
              {/* Pill Button */}
              <button
                onClick={() => setExpandedSDG(expandedSDG === sdg.id ? null : sdg.id)}
                className="w-full flex items-center justify-between gap-4 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                style={{
                  borderColor: sdg.color_code,
                  backgroundColor: sdg.color_code + '08', // 8% opacity
                }}
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  {/* SDG Number Badge */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      backgroundColor: sdg.color_code,
                    }}
                  >
                    {sdg.sdg_number}
                  </div>

                  {/* SDG Info */}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-black">{sdg.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{sdg.description}</p>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-600 transition-transform ${
                    expandedSDG === sdg.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expanded Description */}
              {expandedSDG === sdg.id && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Goal Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{sdg.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Learn More</h4>
                    <a
                      href={`https://sdgs.un.org/goals/goal${sdg.sdg_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Visit UN SDG Goal {sdg.sdg_number} →
                    </a>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-black mb-2">Related Articles</h4>
                    <Link
                      href={`/browse/current?sdg=${sdg.sdg_number}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      See all articles for Goal {sdg.sdg_number} →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200 space-y-2">
          <h4 className="text-xs font-semibold text-blue-900">About SDG Mapping</h4>
          <p className="text-xs text-blue-800">
            The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet,
            and ensure peace and prosperity. Mapping research to SDGs helps identify how scientific contributions support
            global sustainability priorities.
          </p>
        </div>
      </div>
    </section>
  );
}
