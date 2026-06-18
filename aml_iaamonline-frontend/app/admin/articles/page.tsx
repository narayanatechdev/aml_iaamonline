'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown,
  Eye, Download, BookOpen, X, ArrowUpRight, FileText,
  ChevronDown, ChevronUp, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { AdminBreadcrumb } from '@/components/admin';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Article {
  id: number;
  title: string;
  doi?: string | null;
  volume?: number | null;
  issue?: number | null;
  year?: number | null;
  subject?: string | null;
  article_type?: string | null;
  total_views: number;
  total_downloads: number;
  abstract?: string | null;
  authors_count?: number;
  page_start?: string | null;
  page_end?: string | null;
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface ArticlesResponse {
  data: Article[];
  meta?: PaginationMeta;
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

type SortKey = 'title' | 'year' | 'total_views' | 'total_downloads';
type SortDir = 'asc' | 'desc';

const ARTICLE_TYPE_OPTIONS = ['All Types', 'Research Article', 'Review', 'Letter', 'Editorial', 'Communication'];
const YEAR_OPTIONS = ['All Years', ...Array.from({ length: 17 }, (_, i) => String(2026 - i))];

function TypeBadge({ type }: { type: string | null | undefined }) {
  const t = type || 'Article';
  const colors: Record<string, string> = {
    'Research Article': 'bg-blue-100 text-blue-800',
    'Review': 'bg-amber-100 text-amber-800',
    'Letter': 'bg-indigo-100 text-indigo-800',
    'Editorial': 'bg-green-100 text-green-800',
    'Communication': 'bg-purple-100 text-purple-800',
  };
  const cls = colors[t] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {t}
    </span>
  );
}

function ExpandedRow({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-[#0f2d6b]/3 border-l-4 border-[#0f2d6b]/30"
    >
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Abstract */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Abstract</h4>
          {article.abstract ? (
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-5">{article.abstract}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">No abstract available</p>
          )}
        </div>

        {/* Metadata */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Details</h4>
          <div className="space-y-2">
            {article.doi && (
              <div>
                <span className="text-xs text-gray-400">DOI</span>
                <p className="text-xs font-mono text-[#0f2d6b] break-all">{article.doi}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {article.volume != null && (
                <div>
                  <span className="text-xs text-gray-400">Volume</span>
                  <p className="text-sm font-medium text-gray-700">{article.volume}</p>
                </div>
              )}
              {article.issue != null && (
                <div>
                  <span className="text-xs text-gray-400">Issue</span>
                  <p className="text-sm font-medium text-gray-700">{article.issue}</p>
                </div>
              )}
              {article.page_start && (
                <div>
                  <span className="text-xs text-gray-400">Pages</span>
                  <p className="text-sm font-medium text-gray-700">
                    {article.page_start}{article.page_end ? `–${article.page_end}` : ''}
                  </p>
                </div>
              )}
              {article.year && (
                <div>
                  <span className="text-xs text-gray-400">Year</span>
                  <p className="text-sm font-medium text-gray-700">{article.year}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-400">Views</span>
                <p className="text-sm font-bold text-gray-900">{(article.total_views || 0).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Downloads</span>
                <p className="text-sm font-bold text-gray-900">{(article.total_downloads || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <Link
            href={`/articles/${article.id}`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0f2d6b] hover:text-[#c9a227] transition-colors"
          >
            View full article <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All Years');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: '20',
        page: String(page),
        sort: sortKey,
        dir: sortDir,
        from_submission: '1',
      });
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (yearFilter !== 'All Years') params.set('year', yearFilter);
      if (typeFilter !== 'All Types') params.set('type', typeFilter);

      const res = await fetch(`${API_BASE}/articles?${params}`);
      if (res.ok) {
        const data: ArticlesResponse = await res.json();
        setArticles(data.data || []);
        setMeta({
          total: data.meta?.total ?? data.total ?? 0,
          per_page: data.meta?.per_page ?? data.per_page ?? 20,
          current_page: data.meta?.current_page ?? data.current_page ?? 1,
          last_page: data.meta?.last_page ?? data.last_page ?? 1,
        });
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, sortKey, sortDir, debouncedQuery, yearFilter, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, yearFilter, typeFilter, sortKey, sortDir]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors group"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === field ? 'text-[#0f2d6b]' : 'text-gray-300 group-hover:text-gray-400'}`} />
    </button>
  );

  const clearFilters = () => {
    setSearchQuery('');
    setYearFilter('All Years');
    setTypeFilter('All Types');
  };

  const hasFilters = searchQuery || yearFilter !== 'All Years' || typeFilter !== 'All Types';

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Articles' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {meta.total > 0 ? `${meta.total.toLocaleString()} articles in the database` : 'Browse journal articles'}
          </p>
        </div>
        <button
          onClick={fetchArticles}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search + Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, DOI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
              showFilters || hasFilters
                ? 'bg-[#0f2d6b] text-white border-[#0f2d6b]'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-[#c9a227]" />
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 mt-3 border-t border-gray-100">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                  >
                    {YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b] transition-colors"
                  >
                    {ARTICLE_TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Articles Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-3 border-b border-gray-100 bg-gray-50/80">
          <div className="col-span-5">
            <SortHeader label="Title" field="title" />
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-gray-500">Vol / Issue</span>
          </div>
          <div className="col-span-1">
            <SortHeader label="Year" field="year" />
          </div>
          <div className="col-span-1 text-right">
            <SortHeader label="Views" field="total_views" />
          </div>
          <div className="col-span-1 text-right">
            <SortHeader label="DL" field="total_downloads" />
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-gray-500">Type</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm font-medium mb-1">No articles found</p>
            <p className="text-gray-400 text-xs">Try adjusting your search or filter criteria</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 text-xs text-[#0f2d6b] hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Articles rows */}
        {!isLoading && articles.map((article, idx) => (
          <div key={article.id}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => toggleExpand(article.id)}
              className="group cursor-pointer border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
            >
              {/* Mobile layout */}
              <div className="md:hidden px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#0f2d6b] transition-colors">
                      {article.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {article.year && <span className="text-xs text-gray-500">{article.year}</span>}
                      <TypeBadge type={article.article_type} />
                      <span className="text-xs text-gray-400">
                        <Eye className="w-3 h-3 inline mr-0.5" />{(article.total_views || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {expandedId === article.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-6 py-3.5 items-center">
                <div className="col-span-5 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#0f2d6b] transition-colors leading-snug">
                      {article.title}
                    </p>
                    {article.doi && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{article.doi}</p>
                    )}
                  </div>
                  {expandedId === article.id
                    ? <ChevronUp className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500">
                    {article.volume != null && article.issue != null
                      ? `Vol.${article.volume} · Iss.${article.issue}`
                      : '—'}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-gray-700 font-medium">{article.year ?? '—'}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm text-gray-700">{(article.total_views || 0).toLocaleString()}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm text-gray-700">{(article.total_downloads || 0).toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <TypeBadge type={article.article_type} />
                </div>
              </div>
            </motion.div>

            {/* Expanded row */}
            <AnimatePresence>
              {expandedId === article.id && <ExpandedRow article={article} />}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-6 px-2"
        >
          <div className="text-sm text-gray-500">
            Showing {((meta.current_page - 1) * meta.per_page) + 1}–{Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total.toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                let p: number;
                if (meta.last_page <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= meta.last_page - 2) p = meta.last_page - 4 + i;
                else p = page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                      p === page
                        ? 'bg-[#0f2d6b] text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page || isLoading}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Export bar */}
      <div className="mt-6 flex items-center justify-between px-1">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          Data sourced from AML journal database · {new Date().toLocaleDateString()}
        </p>
        <button className="text-xs text-gray-400 hover:text-[#0f2d6b] transition-colors flex items-center gap-1">
          Export CSV
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
