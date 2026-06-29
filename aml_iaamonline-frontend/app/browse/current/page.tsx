'use client';

import { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Eye, Quote, Search, X } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
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
    <article className="border-b border-gray-200 py-6 fade-in-up">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1 text-[#8c7220] text-xs">
          <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>
          Open Access
        </div>
        <div className="text-sm text-[#5a6a8a] font-mono">
          Vol. {article.volume}, Issue {article.issue} • {article.year}
          {article.pages && ` • Pages: ${article.pages}`}
        </div>
      </div>

      {/* Article Type */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[#0f2d6b] text-sm">
          {article.type}
        </span>
        <span className="text-[#5a6a8a] text-sm ml-auto">{article.published}</span>
      </div>

      {/* Article Title */}
      <Link
        href={`/article/${article.id}`}
        className="block hover:text-[#0f2d6b] transition-colors"
      >
        <h3 className="text-xl text-[#0f1a2e] leading-snug mb-3">
          {article.title}
        </h3>
      </Link>

      {/* Authors */}
      <div className="text-sm text-[#0f2d6b] mb-3 font-medium">
        {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
        {(article.authors || []).length > 3 ? ' et al.' : ''}
      </div>

      {/* DOI */}
      <div className="text-sm text-[#5a6a8a] font-mono mb-4">
        DOI:{' '}
        <a
          href={`https://doi.org/${article.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0f2d6b] hover:underline"
        >
          {article.doi}
        </a>
      </div>

      {/* Graphical Abstract Thumbnail */}
      {article.graphical_abstract_url && (
        <div className="mb-4">
          <div className="w-full h-auto bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden rounded">
            <img 
              src={article.graphical_abstract_url}
              alt={`Graphical abstract for ${article.title}`}
              className="w-full h-auto object-contain max-h-48"
            />
          </div>
        </div>
      )}

      {/* Abstract Snippet */}
      <p className="text-base text-gray-700 line-clamp-3 leading-relaxed mb-4">
        {article.abstract || 'Abstract not available.'}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-[#5a6a8a] mb-4">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {article.views.toLocaleString()} View
        </span>
        <span className="flex items-center gap-1">
          <Quote className="w-3 h-3" />
          Cited: {article.cited}
        </span>
        <span>pp. {article.pages}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={article.pdf_url || `#`}
          className="inline-flex items-center gap-1 text-[#0f2d6b] text-sm hover:underline"
          {...(article.pdf_url ? {} : { onClick: (e) => e.preventDefault() })}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          PDF
        </Link>
        <Link
          href={`/article/${article.id}`}
          className="inline-flex items-center gap-1 text-[#0f2d6b] text-sm hover:underline"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Full Text
        </Link>
      </div>
    </article>
  );
}

function CurrentIssueContent() {
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
    <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[{ label: 'Browse', href: '/browse' }, { label: 'Current Issue' }]} 
          className="mb-6"
        />
        
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-border">
            <Link
              href="/browse/current"
              className="px-4 py-3 text-base font-semibold text-[#0f2d6b] border-b-2 border-[#0f2d6b]"
            >
              Current Issue
            </Link>
            <Link
              href="/browse/archive"
              className="px-4 py-3 text-base font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Issue / Archive
            </Link>
            <Link
              href="/browse/subject"
              className="px-4 py-3 text-base font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Subject
            </Link>
            <Link
              href="/browse/author"
              className="px-4 py-3 text-base font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Author
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Filter */}
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-[#0f2d6b] text-base font-semibold mb-4 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Articles
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, author, keyword, DOI..."
                  className="w-full pl-3 pr-8 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-[#5a6a8a] hover:text-[#0f1a2e]" />
                  </button>
                )}
              </div>
            </div>

            {/* Article Types Filter */}
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-[#0f2d6b] text-base font-semibold mb-4 flex items-center gap-2">
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
                    <span className="text-sm text-[#3a4a6a]">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subjects Filter */}
            <div className="pb-2">
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
                    <span className="text-sm text-[#3a4a6a] flex-1">{subject.name}</span>
                    <span className="text-sm text-[#5a6a8a]">({subject.count})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isSearchMode ? (
                    <>
                      <h1 className="text-[#0f1a2e] text-3xl font-bold">Search Results</h1>
                      <p className="text-[#5a6a8a] text-lg">
                        {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-[#0f1a2e] text-3xl font-bold">Current Issue</h1>
                      <p className="text-[#5a6a8a] text-lg">
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
                      className="px-2 py-1 bg-[#0f2d6b] text-white text-sm rounded cursor-pointer hover:bg-[#0d2560] transition-colors"
                    >
                      Search: {searchQuery} ×
                    </span>
                  )}
                  {selectedTypes.map((type) => (
                    <span
                      key={type}
                      onClick={() => toggleType(type)}
                      className="px-2 py-1 bg-[#f0f4fb] text-[#0f2d6b] text-sm rounded border border-[#0f2d6b]/20 cursor-pointer hover:bg-[#0f2d6b] hover:text-white transition-colors"
                    >
                      {type} ×
                    </span>
                  ))}
                  {selectedSubjects.map((subject) => (
                    <span
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className="px-2 py-1 bg-[#f0f4fb] text-[#0f2d6b] text-sm rounded border border-[#0f2d6b]/20 cursor-pointer hover:bg-[#0f2d6b] hover:text-white transition-colors"
                    >
                      {subject} ×
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Articles List */}
            <div className="scroll-optimized">
              {filteredArticles.length > 0 ? (
                filteredArticles.slice(0, 50).map((article) => (
                  <div key={article.id} className="scroll-stable">
                    <ArticleCard article={article} />
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border-b border-gray-200">
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
                    className="mt-3 text-[#0f2d6b] text-base hover:underline"
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
  );
}

export default function CurrentIssuePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <CurrentIssueContent />
      </Suspense>
    </MainLayout>
  );
}
