'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, FileText, Award } from 'lucide-react';
import { searchArticles } from '@/lib/realData';
import Link from 'next/link';

const HERO_IMAGE = "https://images.unsplash.com/photo-1770320742319-6aa889b3130b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRlcmlhbHMlMjBzY2llbmNlJTIwcmVzZWFyY2glMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MjcxMDI3OHww&ixlib=rb-4.0.3&q=80&w=1080";

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length >= 2) {
      const found = searchArticles(value).slice(0, 6);
      setResults(found);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/browse/current?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#0f2d6b]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d6b]/95 via-[#0f2d6b]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs mb-6 font-semibold">
            <Award className="w-3.5 h-3.5" />
            Diamond Open Access · No Article Processing Charges
          </div>

          <h1 className="text-white mb-3 font-serif" style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.2 }}>
            Advanced Materials Letters
          </h1>

          <p className="text-white/80 text-lg mb-2">
            International Diamond Open Access Journal in Materials Science
          </p>
          <p className="text-white/60 text-sm mb-8">
            ISSN: 0976-3961 | eISSN: 1998-0140 | Impact Factor: 3.82
          </p>

          {/* Functional search box */}
          <form onSubmit={handleSubmit} className="relative mb-8 max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search by article title, author, keyword, or DOI..."
              className="w-full pl-5 pr-14 py-3.5 rounded-xl bg-white text-[#0f1a2e] text-sm placeholder:text-[#9aabcc] focus:outline-none shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-[#0f2d6b] flex items-center justify-center hover:bg-[#0d2560] transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
            </button>

            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {results.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    className="block px-4 py-3 hover:bg-[#f0f4fb] border-b border-gray-50 last:border-b-0 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="text-[#0f1a2e] text-sm font-semibold line-clamp-1">{article.title}</div>
                    <div className="text-[#5a6a8a] text-xs mt-1">
                      {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
                      {(article.authors || []).length > 3 ? ' et al.' : ''}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-[#5a6a8a]">
                      <span>Vol. {article.volume}, Issue {article.issue}</span>
                      <span>{article.year}</span>
                      {article.doi && <span className="font-mono">{article.doi}</span>}
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/browse/current?q=${encodeURIComponent(query)}`}
                  className="block px-4 py-3 text-center text-[#0f2d6b] text-sm font-semibold hover:bg-[#f0f4fb] bg-gray-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  View all results for &quot;{query}&quot;
                </Link>
              </div>
            )}

            {showDropdown && query.trim().length >= 2 && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 text-center z-50">
                <div className="text-[#5a6a8a] text-sm">No articles found for &quot;{query}&quot;</div>
                <Link
                  href="/browse/current"
                  className="text-[#0f2d6b] text-sm font-semibold mt-2 inline-block hover:underline"
                >
                  Browse all articles
                </Link>
              </div>
            )}
          </form>

          <div className="flex flex-wrap gap-3">
            <a
              href="/browse/current"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f2d6b] rounded-lg text-sm hover:bg-[#f0f4fb] transition-colors shadow font-semibold"
            >
              <BookOpen className="w-4 h-4" />
              Current Issue
            </a>
            <a
              href="/submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a227] text-white rounded-lg text-sm hover:bg-[#b8911f] transition-colors shadow font-semibold"
            >
              <FileText className="w-4 h-4" />
              Submit Manuscript
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-colors font-medium"
            >
              Author Guidelines
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
