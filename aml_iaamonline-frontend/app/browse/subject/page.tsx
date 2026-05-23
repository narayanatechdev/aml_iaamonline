'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { FEATURED_ARTICLES, SUBJECTS } from '@/lib/realData';
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
    <article className="border-b border-gray-200 py-6">
      {/* Open Access Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="inline-flex items-center gap-1 text-[#8c7220] text-xs">
          <span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>
          Open Access
        </div>
        <div className="text-sm text-[#5a6a8a] font-mono">
          Vol. {article.volume}, Issue {article.issue} • {article.year}{article.pages && ` • Pages: ${article.pages}`}
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
        <h3 className="text-xl font-semibold text-[#0f1a2e] line-clamp-2 mb-4">
          {article.title}
        </h3>
      </Link>

      {/* Authors */}
      <div className="text-sm text-[#0f2d6b] mb-4 font-medium">
        {(article.authors || []).slice(0, 3).map(getAuthorName).filter(Boolean).join(', ')}
        {(article.authors || []).length > 3 ? ' et al.' : ''}
      </div>

      {/* DOI */}
      <div className="text-sm text-[#5a6a8a] font-mono mb-4">
        DOI: {article.doi}
      </div>

      {/* Graphical Abstract Thumbnail */}
      {article.graphical_abstract_url && (
        <div className="mb-3">
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
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[{ label: 'Browse', href: '/browse' }, { label: 'By Subject' }]} 
          className="mb-6"
        />
        
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex items-center gap-6 border-b border-border">
            <Link 
              href="/browse/current" 
              className="px-4 py-3 text-base font-medium text-[#5a6a8a] hover:text-[#0f2d6b] transition-colors"
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
              className="px-4 py-3 text-base font-semibold text-[#0f2d6b] border-b-2 border-[#0f2d6b]"
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
          {/* Sidebar Subject Navigation */}
          <div className="lg:col-span-1">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-[#0f2d6b] text-base font-semibold mb-4">Browse by Subject</h3>
              
              {/* Search Subjects */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
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
                        <span className="text-sm font-medium">{subject.name}</span>
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
              <div className="py-10 text-center border-b border-gray-200">
                <h1 className="text-[#0f1a2e] text-2xl font-bold mb-4">Browse by Subject</h1>
                <p className="text-[#5a6a8a] text-base mb-6">
                  Select a subject from the sidebar to explore articles in that research area.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {SUBJECTS.slice(0, 9).map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.name)}
                      className="p-4 border-b border-gray-200 text-center group hover:border-[#0f2d6b]"
                    >
                      <h3 className="text-[#0f2d6b] font-semibold mb-1 text-base group-hover:text-[#0f2d6b]">
                        {subject.name}
                      </h3>
                      <p className="text-[#5a6a8a] text-sm">
                        {subject.count} article{subject.count !== 1 ? 's' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-[#0f1a2e] text-2xl font-bold">{selectedSubject}</h1>
                      <p className="text-[#5a6a8a] text-base">
                        Research articles in {selectedSubject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5a6a8a] text-sm">
                        {selectedArticles.length} article{selectedArticles.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedSubject(null);
                          setExpandedSubject(null);
                        }}
                        className="text-[#0f2d6b] text-sm hover:underline mt-1"
                      >
                        ← Browse subjects
                      </button>
                    </div>
                  </div>
                </div>

                {/* Articles List */}
                <div className="">
                  {selectedArticles.length > 0 ? (
                    selectedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="py-10 text-center border-b border-gray-200">
                      <p className="text-[#5a6a8a] text-base">No articles found for this subject.</p>
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