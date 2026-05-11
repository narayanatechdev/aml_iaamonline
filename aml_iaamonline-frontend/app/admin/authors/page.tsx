'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Globe, Mail, BookOpen, Link2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { API_BASE } from '@/lib/adminAuth';

interface Author {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  orcid: string | null;
  affiliation: string | null;
  country: string | null;
  city: string | null;
  article_count: number;
  user_id: number | null;
}

interface PaginatedAuthors {
  data: Author[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export default function AuthorsPage() {
  const [authors, setAuthors]     = useState<Author[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage]           = useState(1);
  const [meta, setMeta]           = useState({ total: 0, last_page: 1, per_page: 20 });

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '20' });
      if (search) params.set('q', search);

      const res  = await fetch(`${API_BASE}/authors?${params}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setAuthors(data);
        setMeta({ total: data.length, last_page: 1, per_page: 20 });
      } else if (data.data) {
        setAuthors(data.data);
        setMeta({
          total: data.total ?? data.meta?.total ?? 0,
          last_page: data.last_page ?? data.meta?.last_page ?? 1,
          per_page: data.per_page ?? 20,
        });
      }
    } catch {
      setError('Failed to load authors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchAuthors(); }, [fetchAuthors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const displayName = (a: Author) =>
    a.first_name || a.last_name
      ? `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim()
      : a.name;

  const initials = (a: Author) => {
    const name = displayName(a);
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Stats
  const withEmail   = authors.filter((a) => a.email).length;
  const withCountry = authors.filter((a) => a.country).length;
  const linked      = authors.filter((a) => a.user_id).length;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Authors' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meta.total.toLocaleString()} authors in the database
          </p>
        </div>
        <button
          onClick={fetchAuthors}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] border border-[#0f2d6b]/30 rounded-lg hover:bg-[#0f2d6b]/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Authors', value: meta.total.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'text-[#0f2d6b]', bg: 'bg-[#0f2d6b]/10' },
          { label: 'With Email',    value: withEmail,    icon: <Mail className="w-5 h-5" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'With Country',  value: withCountry,  icon: <Globe className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-100' },
          { label: 'Linked to User',value: linked,       icon: <Link2 className="w-5 h-5" />, color: 'text-[#c9a227]', bg: 'bg-[#c9a227]/10' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, affiliation, country…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0f2d6b] text-white text-sm font-semibold rounded-lg hover:bg-[#0d2560] transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
              className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Affiliation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Articles</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-200" /><div className="h-4 bg-gray-200 rounded w-32" /></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-36" /></td>
                    <td className="px-4 py-3 text-center"><div className="h-4 bg-gray-200 rounded w-8 mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><div className="h-4 bg-gray-200 rounded w-8 mx-auto" /></td>
                  </tr>
                ))
              ) : authors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No authors found</p>
                    {search && <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                    {/* Author name + avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0f2d6b]/10 text-[#0f2d6b] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {initials(author)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{displayName(author)}</p>
                          {author.orcid && (
                            <p className="text-[10px] text-gray-400 font-mono">{author.orcid}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Affiliation */}
                    <td className="px-4 py-3">
                      <p className="text-gray-600 text-xs max-w-[200px] truncate" title={author.affiliation ?? ''}>
                        {author.affiliation && author.affiliation !== 'Research Institution'
                          ? author.affiliation
                          : <span className="text-gray-300">—</span>}
                      </p>
                    </td>

                    {/* Country */}
                    <td className="px-4 py-3">
                      {author.country
                        ? <span className="text-gray-700 text-xs">{author.country}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      {author.email
                        ? <a href={`mailto:${author.email}`} className="text-[#0f2d6b] text-xs hover:underline truncate block max-w-[160px]">{author.email}</a>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    {/* Article count */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                        <BookOpen className="w-3 h-3 text-gray-400" />
                        {author.article_count}
                      </span>
                    </td>

                    {/* Linked to user */}
                    <td className="px-4 py-3 text-center">
                      {author.user_id
                        ? <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700">Yes</span>
                        : <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-400">No</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">
              Page {page} of {meta.last_page} &nbsp;·&nbsp; {meta.total.toLocaleString()} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
