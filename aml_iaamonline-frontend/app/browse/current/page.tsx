'use client';

import { useState } from 'react';
import { Filter, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { FEATURED_ARTICLES, SUBJECTS, JOURNAL_INFO } from '@/lib/realData';
import type { FeaturedArticle } from '@/lib/realData';

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

export default function CurrentIssuePage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const articleTypes = ['Research Article', 'Review', 'Letter', 'Communication'];

  // Filter current issue articles (latest volume and issue)
  const currentArticles = FEATURED_ARTICLES.filter(article => 
    article.volume === JOURNAL_INFO.currentVolume && 
    article.issue === JOURNAL_INFO.currentIssue
  ).slice(0, 20);

  const filteredArticles = currentArticles.filter(article => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(article.type)) {
      return false;
    }
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(article.subject)) {
      return false;
    }
    return true;
  });

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
                  <h1 className="text-[#0f1a2e] text-xl font-bold">Current Issue</h1>
                  <p className="text-[#5a6a8a] text-sm">
                    Vol. {JOURNAL_INFO.currentVolume}, Issue {JOURNAL_INFO.currentIssue} ({JOURNAL_INFO.currentYear})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#5a6a8a] text-xs">
                    Showing {filteredArticles.length} of {currentArticles.length} articles
                  </p>
                </div>
              </div>
              
              {/* Active Filters */}
              {(selectedTypes.length > 0 || selectedSubjects.length > 0) && (
                <div className="flex flex-wrap gap-2">
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
                filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="bg-white rounded-xl border border-border p-10 text-center">
                  <p className="text-[#5a6a8a] text-sm">No articles found matching your filters.</p>
                  <button 
                    onClick={() => {
                      setSelectedTypes([]);
                      setSelectedSubjects([]);
                    }}
                    className="mt-3 text-[#0f2d6b] text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}