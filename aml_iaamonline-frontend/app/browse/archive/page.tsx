'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { FEATURED_ARTICLES, ARCHIVE_VOLUMES } from '@/lib/realData';
import type { FeaturedArticle } from '@/lib/realData';

function getAuthorName(author: any): string {
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
  }
  return '';
}

interface ArticleCardProps {
  article: FeaturedArticle;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
      {/* Open Access Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#c9a227] text-xs rounded-full font-semibold">
          <span className="w-2 h-2 bg-[#c9a227] rounded-full"></span>
          Open Access
        </div>
        <div className="text-xs text-[#5a6a8a] font-mono">
          Vol. {article.volume}, Issue {article.issue} • {article.year}
        </div>
      </div>

      {/* Article Type */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="px-2 py-0.5 bg-[#f0f4fb] text-[#0f2d6b] text-xs rounded border border-[#0f2d6b]/10 font-semibold">
          {article.type}
        </span>
        <span className="text-[#5a6a8a] text-xs ml-auto">{article.published}</span>
      </div>

      {/* Article Title */}
      <Link
        href={`/article/${article.id}`}
        className="block hover:text-[#0f2d6b] transition-colors"
      >
        <h3 className="text-sm font-semibold text-[#0f1a2e] line-clamp-2 mb-2">
          {article.title}
        </h3>
      </Link>

      {/* Authors */}
      <div className="text-xs text-[#0f2d6b] mb-2 font-medium">
        {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
        {(article.authors || []).length > 3 ? ' et al.' : ''}
      </div>

      {/* DOI */}
      <div className="text-xs text-[#5a6a8a] font-mono mb-3">
        DOI: {article.doi}
      </div>

      {/* Graphical Abstract Thumbnail */}
      {article.graphical_abstract_url && (
        <div className="mb-3">
          <div className="w-full max-w-xs h-32 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
            <img 
              src={article.graphical_abstract_url}
              alt={`Graphical abstract for ${article.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Abstract Snippet */}
      <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed mb-3">
        {article.abstract || 'Abstract not available.'}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-[#5a6a8a] mb-3">
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={article.pdf_url || `#`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
          {...(article.pdf_url ? {} : { onClick: (e) => e.preventDefault() })}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          PDF
        </Link>
        <Link
          href={`/article/${article.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 bg-[#0f2d6b] hover:bg-[#0d2560] text-white text-xs font-medium rounded transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Full Text
        </Link>
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const [expandedYear, setExpandedYear] = useState<number | null>(2025);
  const [selectedVolumeIssue, setSelectedVolumeIssue] = useState<string | null>(null);

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
    setSelectedVolumeIssue(null);
  };

  const getArticlesForVolumeIssue = (volume: string, issue: string) => {
    return FEATURED_ARTICLES.filter(article => 
      article.volume === volume && article.issue === issue
    );
  };

  const getArticlesForVolume = (volume: string) => {
    return FEATURED_ARTICLES.filter(article => article.volume === volume);
  };

  const [selectedVolume, selectedIssue] = selectedVolumeIssue 
    ? selectedVolumeIssue.split('-') 
    : [null, null];
    
  const selectedArticles = selectedVolumeIssue 
    ? getArticlesForVolumeIssue(selectedVolume!, selectedIssue!) 
    : [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-border">
            <Link 
              href="/browse/current" 
              className="px-4 py-3 text-sm font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              Current Issue
            </Link>
            <Link 
              href="/browse/archive" 
              className="px-4 py-3 text-sm font-semibold text-[#0f2d6b] border-b-2 border-[#0f2d6b]"
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
          {/* Sidebar Archive Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm font-semibold mb-4">Browse by Year & Volume</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ARCHIVE_VOLUMES.map((yearData) => (
                  <div key={yearData.year}>
                    <button
                      onClick={() => toggleYear(yearData.year)}
                      className="flex items-center justify-between w-full p-2 text-left hover:bg-[#f0f4fb] rounded"
                    >
                      <span className="text-[#0f2d6b] text-sm font-medium">{yearData.year}</span>
                      {expandedYear === yearData.year ? (
                        <ChevronDown className="w-4 h-4 text-[#5a6a8a]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#5a6a8a]" />
                      )}
                    </button>
                    
                    {expandedYear === yearData.year && (
                      <div className="ml-4 mt-2 space-y-1">
                        {yearData.volumes.map((volumeData) => (
                          <div key={volumeData.vol} className="space-y-1">
                            {volumeData.issues.map((issue) => {
                              const volumeIssueKey = `${volumeData.vol}-${issue}`;
                              const articlesCount = getArticlesForVolumeIssue(String(volumeData.vol), String(issue)).length;
                              
                              return (
                                <button
                                  key={volumeIssueKey}
                                  onClick={() => setSelectedVolumeIssue(volumeIssueKey)}
                                  className={`block w-full text-left p-2 text-xs rounded transition-colors ${
                                    selectedVolumeIssue === volumeIssueKey
                                      ? 'bg-[#0f2d6b] text-white'
                                      : 'text-[#5a6a8a] hover:bg-[#f0f4fb] hover:text-[#0f2d6b]'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>Vol. {volumeData.vol}, Issue {issue}</span>
                                    {articlesCount > 0 && (
                                      <span className={`text-[10px] ${selectedVolumeIssue === volumeIssueKey ? 'text-white/80' : 'text-[#5a6a8a]'}`}>
                                        ({articlesCount})
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedVolumeIssue ? (
              <div className="bg-white rounded-xl border border-border p-10 text-center">
                <h1 className="text-[#0f1a2e] text-xl font-bold mb-4">Browse Journal Archive</h1>
                <p className="text-[#5a6a8a] text-sm mb-6">
                  Select a year and issue from the sidebar to browse articles from our archive.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {ARCHIVE_VOLUMES.slice(0, 6).map((yearData) => (
                    <button
                      key={yearData.year}
                      onClick={() => toggleYear(yearData.year)}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <h3 className="text-[#0f2d6b] font-semibold mb-1">{yearData.year}</h3>
                      <p className="text-[#5a6a8a] text-xs">
                        {yearData.volumes.length} volume{yearData.volumes.length !== 1 ? 's' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="bg-white rounded-xl border border-border p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-[#0f1a2e] text-xl font-bold">
                        Volume {selectedVolume}, Issue {selectedIssue} Articles
                      </h1>
                      <p className="text-[#5a6a8a] text-sm">
                        Advanced Materials Letters Archive
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5a6a8a] text-xs">
                        {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={() => setSelectedVolumeIssue(null)}
                        className="text-[#0f2d6b] text-xs hover:underline mt-1"
                      >
                        ← Back to archive
                      </button>
                    </div>
                  </div>
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                  {selectedArticles.length > 0 ? (
                    selectedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="bg-white rounded-xl border border-border p-10 text-center">
                      <p className="text-[#5a6a8a] text-sm">No articles found for this volume.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}