'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Eye, Quote, Search, X } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { FEATURED_ARTICLES, SUBJECTS, JOURNAL_INFO, searchArticles } from '@/lib/realData';
import type { FeaturedArticle } from '@/lib/realData';

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

function getAuthorDisplay(authors: any[]): string {
  return (authors || []).map(getAuthorName).filter(Boolean).join(', ');
}

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
            <p className="text-[#5a6a8a] text-xs mb-2">{getAuthorDisplay(article.authors)}</p>
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

export default function CurrentIssuePage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const articleTypes = ['Research Article', 'Review', 'Letter', 'Communication'];

  const isSearchMode = searchQuery.trim().length >= 2;

  const baseArticles = useMemo(() => {
    if (isSearchMode) {
      return searchArticles(searchQuery);
    }
    return FEATURED_ARTICLES.filter(article =>
      article.volume === JOURNAL_INFO.currentVolume &&
      article.issue === JOURNAL_INFO.currentIssue
    );
  }, [searchQuery, isSearchMode]);

  const filteredArticles = useMemo(() => {
    return baseArticles.filter(article => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(article.type)) return false;
      if (selectedSubjects.length > 0 && !selectedSubjects.includes(article.subject)) return false;
      return true;
    });
  }, [baseArticles, selectedTypes, selectedSubjects]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  function clearSearch() {
    setSearchQuery('');
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-border">
            <Link
              href="/browse/current"
              className="px-4 py-3 text-sm font-semibold text-[#0f2d6b] border-b-2 border-[#0f2d6b]"
            >
              Current Issue
            </Link>
            <Link
              href="/browse/archive"
              className="px-4 py-3 text-sm font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Issue / Archive
            </Link>
            <Link
              href="/browse/subject"
              className="px-4 py-3 text-sm font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Subject
            </Link>
            <Link
              href="/browse/author"
              className="px-4 py-3 text-sm font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Author
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Filter */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Articles
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, author, keyword, DOI..."
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-border text-xs focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-[#5a6a8a] hover:text-[#0f1a2e]" />
                  </button>
                )}
              </div>
            </div>

            {/* Article Types Filter */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Article Types
              </h3>
              <div className="space-y-2">
                {articleTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                      className="rounded border-border text-[#0f2d6b] focus:ring-[#0f2d6b]"
                    />
                    <span className="text-xs text-[#3a4a6a]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subjects Filter */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm font-semibold mb-3">Subjects</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {SUBJECTS.slice(0, 10).map((subject) => (
                  <label key={subject.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.name)}
                      onChange={() => toggleSubject(subject.name)}
                      className="rounded border-border text-[#0f2d6b] focus:ring-[#0f2d6b]"
                    />
                    <span className="text-xs text-[#3a4a6a] flex-1">{subject.name}</span>
                    <span className="text-xs text-[#5a6a8a]">({subject.count})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isSearchMode ? (
                    <>
                      <h1 className="text-[#0f1a2e] text-xl font-bold">Search Results</h1>
                      <p className="text-[#5a6a8a] text-sm">
                        {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-[#0f1a2e] text-xl font-bold">Current Issue</h1>
                      <p className="text-[#5a6a8a] text-sm">
                        Vol. {JOURNAL_INFO.currentVolume}, Issue {JOURNAL_INFO.currentIssue} ({JOURNAL_INFO.currentYear})
                      </p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[#5a6a8a] text-xs">
                    Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedTypes.length > 0 || selectedSubjects.length > 0 || isSearchMode) && (
                <div className="flex flex-wrap gap-2">
                  {isSearchMode && (
                    <span
                      onClick={clearSearch}
                      className="px-2 py-1 bg-[#0f2d6b] text-white text-xs rounded cursor-pointer hover:bg-[#0d2560] transition-colors"
                    >
                      Search: {searchQuery} ×
                    </span>
                  )}
                  {selectedTypes.map((type) => (
                    <span
                      key={type}
                      onClick={() => toggleType(type)}
                      className="px-2 py-1 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded border border-[#0f2d6b]/20 cursor-pointer hover:bg-[#0f2d6b] hover:text-white transition-colors"
                    >
                      {type} ×
                    </span>
                  ))}
                  {selectedSubjects.map((subject) => (
                    <span
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className="px-2 py-1 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded border border-[#0f2d6b]/20 cursor-pointer hover:bg-[#0f2d6b] hover:text-white transition-colors"
                    >
                      {subject} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Articles List */}
            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.slice(0, 50).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-border p-10 text-center">
                  <p className="text-[#5a6a8a] text-sm">
                    {isSearchMode
                      ? `No articles found for "${searchQuery}".`
                      : 'No articles found matching your filters.'
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedSubjects([]);
                      setSearchQuery('');
                    }}
                    className="mt-3 text-[#0f2d6b] text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              {filteredArticles.length > 50 && (
                <div className="text-center py-4">
                  <p className="text-[#5a6a8a] text-sm">
                    Showing 50 of {filteredArticles.length} results. Refine your search for more specific results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
