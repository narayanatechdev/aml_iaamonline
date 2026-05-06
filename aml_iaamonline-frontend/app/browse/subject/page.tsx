'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { FEATURED_ARTICLES, SUBJECTS } from '@/lib/realData';
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

export default function SubjectPage() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSubject = (subjectName: string) => {
    if (expandedSubject === subjectName) {
      setExpandedSubject(null);
      setSelectedSubject(null);
    } else {
      setExpandedSubject(subjectName);
      setSelectedSubject(subjectName);
    }
  };

  const getArticlesForSubject = (subjectName: string) => {
    return FEATURED_ARTICLES.filter(article => article.subject === subjectName);
  };

  const selectedArticles = selectedSubject ? getArticlesForSubject(selectedSubject) : [];

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
              className="px-4 py-3 text-sm font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
            >
              By Issue / Archive
            </Link>
            <Link 
              href="/browse/subject" 
              className="px-4 py-3 text-sm font-semibold text-[#0f2d6b] border-b-2 border-[#0f2d6b]"
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
          {/* Sidebar Subject Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-[#0f2d6b] text-sm font-semibold mb-4">Browse by Subject</h3>
              
              {/* Search Subjects */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                />
                <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a8a]" />
              </div>

              {/* Subjects List */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredSubjects.map((subject) => (
                  <div key={subject.id}>
                    <button
                      onClick={() => toggleSubject(subject.name)}
                      className={`flex items-center justify-between w-full p-3 text-left rounded transition-colors ${
                        selectedSubject === subject.name
                          ? 'bg-[#0f2d6b] text-white'
                          : 'hover:bg-[#f0f4fb] text-[#0f2d6b]'
                      }`}
                    >
                      <div className="flex-1">
                        <span className="text-xs font-medium">{subject.name}</span>
                        <p className={`text-[10px] mt-0.5 ${
                          selectedSubject === subject.name ? 'text-white/80' : 'text-[#5a6a8a]'
                        }`}>
                          {subject.count} article{subject.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {expandedSubject === subject.name ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedSubject ? (
              <div className="bg-white rounded-xl border border-border p-10 text-center">
                <h1 className="text-[#0f1a2e] text-xl font-bold mb-4">Browse by Subject</h1>
                <p className="text-[#5a6a8a] text-sm mb-6">
                  Select a subject from the sidebar to explore articles in that research area.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {SUBJECTS.slice(0, 9).map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.name)}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow text-center group hover:border-[#0f2d6b]"
                    >
                      <h3 className="text-[#0f2d6b] font-semibold mb-1 text-sm group-hover:text-[#0f2d6b]">
                        {subject.name}
                      </h3>
                      <p className="text-[#5a6a8a] text-xs">
                        {subject.count} article{subject.count !== 1 ? 's' : ''}
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
                      <h1 className="text-[#0f1a2e] text-xl font-bold">{selectedSubject}</h1>
                      <p className="text-[#5a6a8a] text-sm">
                        Research articles in {selectedSubject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5a6a8a] text-xs">
                        {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedSubject(null);
                          setExpandedSubject(null);
                        }}
                        className="text-[#0f2d6b] text-xs hover:underline mt-1"
                      >
                        ← Browse subjects
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
                      <p className="text-[#5a6a8a] text-sm">No articles found for this subject.</p>
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