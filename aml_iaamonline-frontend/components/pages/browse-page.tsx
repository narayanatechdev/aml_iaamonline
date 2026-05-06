'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Filter, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { FEATURED_ARTICLES, SUBJECTS, ARCHIVE_VOLUMES, JOURNAL_INFO } from '@/lib/realData';
import type { FeaturedArticle } from '@/lib/realData';

type Tab = 'current' | 'archive' | 'subject' | 'author';

interface ArticleCardProps {
  article: FeaturedArticle;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`}>
      <div className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-0.5 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded border border-[#0f2d6b]/10 font-semibold">
                {article.type}
              </span>
              <span className="text-[#5a6a8a] text-xs">{article.subject}</span>
              <span className="text-[#5a6a8a] text-xs ml-auto">{article.published}</span>
            </div>
            <h3 className="text-[#0f1a2e] text-sm leading-snug mb-2 group-hover:text-[#0f2d6b] transition-colors font-semibold">
              {article.title}
            </h3>
            <p className="text-[#5a6a8a] text-xs mb-2">{article.authors.join(', ')}</p>
            <p className="text-[#3a4a6a] text-xs leading-relaxed line-clamp-2 mb-3">{article.abstract}</p>
            <div className="flex items-center gap-4 text-xs text-[#5a6a8a]">
              <span className="font-mono text-[10px] text-[#0f2d6b]">DOI: {article.doi}</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Quote className="w-3 h-3" />
                Cited: {article.cited}
              </span>
              <span>pp. {article.pages}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BrowsePage() {
  const [tab, setTab] = useState<Tab>('current');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const articleTypes = ['Research Article', 'Review', 'Letter', 'Communication'];

  const filtered = FEATURED_ARTICLES.filter((a) => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(a.type);
    const subjectMatch = selectedSubjects.length === 0 || selectedSubjects.includes(a.subject);
    return typeMatch && subjectMatch;
  });

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-[#0f2d6b] mb-1 font-bold" style={{ fontSize: '1.6rem' }}>
          Browse Content
        </h1>
        <p className="text-[#5a6a8a] text-sm">
          Advanced Materials Letters · Vol. {JOURNAL_INFO.currentVolume}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-8 bg-[#f0f4fb] rounded-xl p-1 overflow-x-auto">
        {[
          { key: 'current' as const, label: 'Current Issue' },
          { key: 'archive' as const, label: 'By Issue / Archive' },
          { key: 'subject' as const, label: 'By Subject' },
          { key: 'author' as const, label: 'By Author' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors font-semibold ${
              tab === t.key
                ? 'bg-[#0f2d6b] text-white shadow-sm'
                : 'text-[#5a6a8a] hover:text-[#0f2d6b] hover:bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Current Issue */}
      {tab === 'current' && (
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar filters */}
          <div className="md:col-span-1">
            <div className="bg-[#f0f4fb] rounded-xl p-4 border border-border sticky top-40">
              <h3 className="text-[#0f2d6b] text-sm mb-3 flex items-center gap-2 font-bold">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="mb-4">
                <p className="text-xs text-[#5a6a8a] mb-2 font-semibold">Article Type</p>
                {articleTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="rounded border-border accent-[#0f2d6b]"
                    />
                    <span className="text-xs text-[#3a4a6a]">{type}</span>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs text-[#5a6a8a] mb-2 font-semibold">Subject Area</p>
                {['Nanotechnology', 'Biomaterials', 'Energy Materials', '2D Materials'].map((s) => (
                  <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects.includes(s)}
                      onChange={() => toggleSubject(s)}
                      className="rounded border-border accent-[#0f2d6b]" 
                    />
                    <span className="text-xs text-[#3a4a6a]">{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Article list */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#0f2d6b] font-bold" style={{ fontSize: '1.1rem' }}>
                Volume {JOURNAL_INFO.currentVolume}, Issue {JOURNAL_INFO.currentIssue} (
                {JOURNAL_INFO.currentYear})
              </h2>
              <span className="text-[#5a6a8a] text-xs">{filtered.length} articles</span>
            </div>
            <div className="space-y-4">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Archive */}
      {tab === 'archive' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="bg-[#0f2d6b] px-4 py-3">
                <h3 className="text-white text-sm font-bold">All Volumes & Issues</h3>
              </div>
              {ARCHIVE_VOLUMES.map((yr) => (
                <div key={yr.year} className="border-b border-border last:border-0">
                  <button
                    onClick={() => setExpandedYear(expandedYear === yr.year ? null : yr.year)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f0f4fb] transition-colors"
                  >
                    <span className="text-sm text-[#0f1a2e] font-semibold">{yr.year}</span>
                    {expandedYear === yr.year ? (
                      <ChevronDown className="w-4 h-4 text-[#5a6a8a]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#5a6a8a]" />
                    )}
                  </button>
                  {expandedYear === yr.year && (
                    <div className="px-4 pb-3 space-y-1">
                      {yr.volumes.map((vol) =>
                        vol.issues.map((issue) => (
                          <button
                            key={`${vol.vol}-${issue}`}
                            className="block w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#0f2d6b] hover:bg-[#f0f4fb] transition-colors"
                          >
                            Vol. {vol.vol}, No. {issue}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-[#0f2d6b] mb-4 font-bold" style={{ fontSize: '1.1rem' }}>
              Volume {JOURNAL_INFO.currentVolume}, Issue {JOURNAL_INFO.currentIssue} (
              {JOURNAL_INFO.currentYear})
            </h2>
            <div className="space-y-4">
              {FEATURED_ARTICLES.slice(0, 4).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* By Subject */}
      {tab === 'subject' && (
        <div className="space-y-4">
          {SUBJECTS.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() =>
                  setExpandedSubject(expandedSubject === subject.id ? null : subject.id)
                }
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0f4fb] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedSubject === subject.id ? (
                    <ChevronDown className="w-4 h-4 text-[#0f2d6b]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#5a6a8a]" />
                  )}
                  <span className="text-[#0f1a2e] text-sm font-semibold">{subject.name}</span>
                </div>
                <span className="text-[#5a6a8a] text-xs">{subject.count} articles</span>
              </button>
              {expandedSubject === subject.id && (
                <div className="border-t border-border p-4 space-y-3">
                  {FEATURED_ARTICLES.filter((a) => a.subject === subject.name).length > 0 ? (
                    FEATURED_ARTICLES.filter((a) => a.subject === subject.name).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <p className="text-[#5a6a8a] text-sm text-center py-4">
                      Sample articles for {subject.name} would appear here.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* By Author */}
      {tab === 'author' && (
        <div>
          <div className="bg-[#f0f4fb] rounded-xl p-5 border border-border mb-6">
            <h3 className="text-[#0f2d6b] mb-3 text-sm font-bold">Search by Author Name</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter author name..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
              />
              <button className="px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm hover:bg-[#0d2560] transition-colors font-semibold">
                Search
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {FEATURED_ARTICLES.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
