'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowLeft, Eye, Quote } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { 
  Author,
  AUTHORS,
  getUniqueAffiliations,
  getUniqueCountries,
  getUniqueCities,
  filterAuthors,
  sortAuthors,
  AUTHOR_COUNTS
} from '@/lib/authorsData';
import { FEATURED_ARTICLES } from '@/lib/realData';
import { useArticleMedia, withLiveMedia } from '@/lib/live-media';
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
      <div className="flex flex-col sm:flex-row gap-5">
      {/* Graphical Abstract Thumbnail (left) */}
      {article.graphical_abstract_url && (
        <div className="sm:w-48 md:w-56 flex-shrink-0">
          <div className="bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center">
            <img
              src={article.graphical_abstract_url}
              alt={`Graphical abstract for ${article.title}`}
              className="w-full h-auto object-contain max-h-48"
            />
          </div>
        </div>
      )}

      {/* Content (right) */}
      <div className="flex-1 min-w-0">
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
        <h3 className="text-xl text-[#0f1a2e] leading-snug mb-4">
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
      </div>
      </div>
    </article>
  );
}

export default function AuthorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showAffiliationFilter, setShowAffiliationFilter] = useState(true);
  const [showCountryFilter, setShowCountryFilter] = useState(true);
  const [showCityFilter, setShowCityFilter] = useState(true);
  const [sortBy, setSortBy] = useState('article_count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  // Get filter options from data
  const affiliations = useMemo(() => getUniqueAffiliations(), []);
  const countries = useMemo(() => getUniqueCountries(), []);
  const cities = useMemo(() => getUniqueCities(), []);

  // Filter and sort authors
  const filteredAuthors = useMemo(() => {
    return filterAuthors({
      search: searchTerm,
      affiliation: selectedAffiliation,
      country: selectedCountry,
      city: selectedCity
    });
  }, [searchTerm, selectedAffiliation, selectedCountry, selectedCity]);

  const sortedAuthors = useMemo(() => {
    if (sortBy === 'recent') {
      // Sort by author ID (assuming lower ID = newer author)
      return [...filteredAuthors].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.id - b.id;
        } else {
          return b.id - a.id;
        }
      });
    }
    return sortAuthors(filteredAuthors, sortBy as keyof Author, sortOrder);
  }, [filteredAuthors, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get articles by selected author
  const getArticlesByAuthor = (authorName: string) => {
    return FEATURED_ARTICLES.filter(article => 
      (article.authors || []).some(author => 
        getAuthorName(author).toLowerCase().includes(authorName.toLowerCase())
      )
    );
  };

  const media = useArticleMedia();
  const authorArticles = withLiveMedia(selectedAuthor ? getArticlesByAuthor(selectedAuthor.name) : [], media);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAffiliation('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedAuthor(null);
  };

  const handleAuthorClick = (author: Author) => {
    setSelectedAuthor(author);
  };

  const handleBackToAuthors = () => {
    setSelectedAuthor(null);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <Breadcrumb 
          items={[{ label: 'Browse', href: '/browse' }, { label: 'By Author' }]} 
          className="mb-6"
        />
        
        <div className="mb-8">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>Browse Authors</h1>
          <p className="text-[#5a6a8a] text-base">Discover researchers and their contributions to Advanced Materials Letters</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="border-b border-gray-200 pb-6 sticky top-40">
              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-[#0f2d6b] text-sm mb-3" style={{ fontWeight: 600 }}>Quick Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5a6a8a]">Total Authors:</span>
                    <span className="text-[#0f2d6b] font-semibold">{AUTHOR_COUNTS.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5a6a8a]">Filtered Results:</span>
                    <span className="text-[#0f2d6b] font-semibold">{sortedAuthors.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5a6a8a]">Top Author Articles:</span>
                    <span className="text-[#0f2d6b] font-semibold">{Math.max(...filteredAuthors.map(a => a.article_count), 0)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#0f2d6b] text-base" style={{ fontWeight: 700 }}>Refine Results</h3>
                <button 
                  onClick={clearFilters}
                  className="text-[#c9a227] text-sm hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-[#0f2d6b] text-sm mb-2 block" style={{ fontWeight: 600 }}>Search Authors</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Author name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  />
                  <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a8a]" />
                </div>
              </div>

              {/* Affiliation Filter */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowAffiliationFilter(!showAffiliationFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-sm mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Affiliation
                  {showAffiliationFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showAffiliationFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedAffiliation}
                      onChange={(e) => setSelectedAffiliation(e.target.value)}
                      className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All affiliations</option>
                      {affiliations.map((affiliation, index) => (
                        <option key={index} value={affiliation.name}>{affiliation.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowCountryFilter(!showCountryFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-sm mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Country
                  {showCountryFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCountryFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* City Filter */}
              {/* <div className="mb-6">
                <button 
                  onClick={() => setShowCityFilter(!showCityFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-xs mb-3"
                  style={{ fontWeight: 600 }}
                >
                  City
                  {showCityFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCityFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-2 text-xs border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div> */}

              {/* Sort Options */}
              <div className="mb-6">
                <label className="text-[#0f2d6b] text-sm mb-2 block" style={{ fontWeight: 600 }}>Sort By</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="w-full p-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                >
                  <option value="article_count-desc">Most Articles</option>
                  <option value="article_count-asc">Fewest Articles</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="affiliation-asc">Affiliation (A-Z)</option>
                  <option value="country-asc">Country (A-Z)</option>
                  <option value="recent-desc">Newest Authors</option>
                  <option value="recent-asc">Oldest Authors</option>
                </select>
              </div>

              {/* Results count */}
              <div className="pt-4 border-t border-border">
                <p className="text-[#5a6a8a] text-sm">
                  Showing {sortedAuthors.length} of {AUTHOR_COUNTS.total} authors
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedAuthor ? (
              /* Authors Table */
              <div className="border-b border-gray-200 overflow-hidden">
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[#0f2d6b] text-xl" style={{ fontWeight: 700 }}>Authors Directory</h2>
                    <div className="text-[#5a6a8a] text-base">
                      {sortedAuthors.length} authors found
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                      <thead className="bg-[#f0f4fb]">
                        <tr>
                          <th 
                            onClick={() => handleSort('name')}
                            className="px-6 py-4 text-left text-[#0f2d6b] text-sm cursor-pointer hover:bg-[#e8f1ff]"
                            style={{ fontWeight: 600 }}
                          >
                            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th 
                            onClick={() => handleSort('article_count')}
                            className="px-6 py-4 text-left text-[#0f2d6b] text-sm cursor-pointer hover:bg-[#e8f1ff]"
                            style={{ fontWeight: 600 }}
                          >
                            No. Articles {sortBy === 'article_count' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th 
                            onClick={() => handleSort('affiliation')}
                            className="px-6 py-4 text-left text-[#0f2d6b] text-sm cursor-pointer hover:bg-[#e8f1ff]"
                            style={{ fontWeight: 600 }}
                          >
                            Affiliation {sortBy === 'affiliation' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                          <th 
                            onClick={() => handleSort('country')}
                            className="px-6 py-4 text-left text-[#0f2d6b] text-sm cursor-pointer hover:bg-[#e8f1ff]"
                            style={{ fontWeight: 600 }}
                          >
                            Country {sortBy === 'country' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAuthors.map((author, index) => (
                          <tr 
                            key={author.id}
                            onClick={() => handleAuthorClick(author)}
                            className={`border-b border-border hover:bg-[#fafbff] cursor-pointer ${
                              index % 2 === 0 ? 'bg-white' : 'bg-[#fafbff]'
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="text-[#0f2d6b] text-base hover:underline" style={{ fontWeight: 600 }}>
                                {author.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[#3a4a6a] text-base">{author.article_count}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[#3a4a6a] text-base">{author.affiliation}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[#3a4a6a] text-base">{author.country || '—'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
                
                {sortedAuthors.length === 0 && (
                  <div className="p-10 text-center">
                    <p className="text-[#5a6a8a] text-base">No authors found matching your criteria.</p>
                    <button 
                      onClick={clearFilters}
                      className="text-[#0f2d6b] text-base mt-2 hover:underline"
                    >
                      Clear filters to see all authors
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Author Articles */
              <div>
                {/* Header */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={handleBackToAuthors}
                      className="inline-flex items-center gap-2 text-[#0f2d6b] font-semibold hover:underline text-base"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Authors
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-[#0f1a2e] text-2xl font-bold">{selectedAuthor.name}</h1>
                      <p className="text-[#5a6a8a] text-base">
                        {selectedAuthor.affiliation} • {selectedAuthor.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5a6a8a] text-sm">
                        {authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  </div>
                </div>

                {/* Articles List */}
                <div>
                  {authorArticles.length > 0 ? (
                    authorArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    <div className="py-10 text-center border-b border-gray-200">
                      <p className="text-[#5a6a8a] text-base">No articles found for this author.</p>
                      <button
                        onClick={handleBackToAuthors}
                        className="text-[#0f2d6b] text-base mt-2 hover:underline"
                      >
                        ← Back to authors list
                      </button>
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
