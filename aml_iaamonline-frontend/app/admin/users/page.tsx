'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Users, BookOpen, Globe, RefreshCw,
  ChevronLeft, ChevronRight, ShieldCheck, UserCheck,
  Mail, Star,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface AuthorUser {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  email: string;
  orcid: string | null;
  affiliation: string | null;
  country: string | null;
  city: string | null;
  degree: string | null;
  position: string | null;
  is_reviewer: boolean;
  join_date: string | null;
  created_at: string;
  article_count: number;
  author_id: number | null;
  roles: string[];
  is_admin: boolean;
  verified: boolean;
}

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers]           = useState<AuthorUser[]>([]);
  const [meta, setMeta]             = useState<Meta>({ total: 0, per_page: 20, current_page: 1, last_page: 1 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [page, setPage]             = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '20' });
      if (search)     params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);

      const res  = await authFetch(`${API_BASE}/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setUsers(data.data ?? []);
      setMeta(data.meta ?? { total: 0, per_page: 20, current_page: 1, last_page: 1 });
    } catch {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const displayName = (u: AuthorUser) =>
    u.first_name || u.last_name
      ? `${u.title ? u.title + ' ' : ''}${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
      : u.name;

  const initials = (u: AuthorUser) => {
    const n = displayName(u);
    return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin:    'bg-red-100 text-red-700',
      editor:   'bg-purple-100 text-purple-700',
      reviewer: 'bg-amber-100 text-amber-700',
      author:   'bg-blue-100 text-blue-700',
    };
    return map[role] ?? 'bg-gray-100 text-gray-600';
  };

  // Stats from current page (full totals need backend — approximate from meta)
  const reviewers   = users.filter(u => u.is_reviewer).length;
  const withOrcid   = users.filter(u => u.orcid).length;
  const admins      = users.filter(u => u.is_admin).length;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[{ label: 'Registered Authors' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Authors</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meta.total.toLocaleString()} users · all are authors except the AML Admin account
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] border border-[#0f2d6b]/30 rounded-lg hover:bg-[#0f2d6b]/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Registered', value: meta.total.toLocaleString(), icon: <Users className="w-5 h-5" />,     color: 'text-[#0f2d6b]',  bg: 'bg-[#0f2d6b]/10' },
          { label: 'Reviewers',        value: reviewers,  icon: <Star className="w-5 h-5" />,       color: 'text-amber-700', bg: 'bg-amber-100' },
          { label: 'With ORCID',       value: withOrcid,  icon: <UserCheck className="w-5 h-5" />,  color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'Admins',           value: admins,     icon: <ShieldCheck className="w-5 h-5" />, color: 'text-red-700', bg: 'bg-red-100' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + role filter */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email, affiliation, country, ORCID…"
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="reviewer">Reviewer</option>
            <option value="author">Author</option>
          </select>
          <button type="submit" className="px-5 py-2.5 bg-[#0f2d6b] text-white text-sm font-semibold rounded-lg hover:bg-[#0d2560] transition-colors">
            Search
          </button>
          {(search || roleFilter) && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setRoleFilter(''); setPage(1); }}
              className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Clear
            </button>
          )}
        </div>
      </form>

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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Articles</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviewer</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200"/><div className="space-y-1.5"><div className="h-3.5 bg-gray-200 rounded w-32"/><div className="h-3 bg-gray-200 rounded w-24"/></div></div></td>
                    <td className="px-4 py-3"><div className="h-3.5 bg-gray-200 rounded w-40"/></td>
                    <td className="px-4 py-3"><div className="h-3.5 bg-gray-200 rounded w-20"/></td>
                    <td className="px-4 py-3"><div className="h-5 bg-gray-200 rounded w-16"/></td>
                    <td className="px-4 py-3 text-center"><div className="h-3.5 bg-gray-200 rounded w-8 mx-auto"/></td>
                    <td className="px-4 py-3 text-center"><div className="h-5 bg-gray-200 rounded w-12 mx-auto"/></td>
                    <td className="px-4 py-3 text-center"><div className="h-7 bg-gray-200 rounded w-14 mx-auto"/></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                    {search && <p className="text-gray-400 text-xs mt-1">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${user.is_admin ? 'bg-amber-50/40' : ''}`}>

                    {/* Author */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          user.is_admin
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#0f2d6b]/10 text-[#0f2d6b]'
                        }`}>
                          {initials(user)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-gray-900 leading-tight truncate">{displayName(user)}</p>
                            {user.is_admin && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-100 text-red-700 flex-shrink-0">ADMIN</span>
                            )}
                          </div>
                          <a href={`mailto:${user.email}`} className="text-xs text-gray-400 hover:text-[#0f2d6b] truncate block">
                            {user.email}
                          </a>
                          {user.orcid && (
                            <p className="text-[10px] font-mono text-gray-300 leading-tight">{user.orcid}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Affiliation */}
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 max-w-[200px] truncate" title={user.affiliation ?? ''}>
                        {user.affiliation || <span className="text-gray-300">—</span>}
                      </p>
                      {user.degree && (
                        <p className="text-[10px] text-gray-400 mt-0.5">{user.degree}</p>
                      )}
                    </td>

                    {/* Country */}
                    <td className="px-4 py-3">
                      {user.country
                        ? <span className="text-xs text-gray-700 flex items-center gap-1"><Globe className="w-3 h-3 text-gray-400"/>{user.country}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>

                    {/* Roles */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(user.roles ?? []).map(r => (
                          <span key={r} className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full capitalize ${roleBadge(r)}`}>
                            {r}
                          </span>
                        ))}
                        {(!user.roles || user.roles.length === 0) && (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    </td>

                    {/* Articles */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
                        <BookOpen className="w-3 h-3 text-gray-400"/>
                        {user.article_count}
                      </span>
                    </td>

                    {/* Reviewer */}
                    <td className="px-4 py-3 text-center">
                      {user.is_reviewer
                        ? <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">Yes</span>
                        : <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-400">No</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="px-3 py-1.5 text-xs font-medium text-[#0f2d6b] border border-[#0f2d6b]/30 rounded-lg hover:bg-[#0f2d6b]/5 transition-colors"
                      >
                        Edit
                      </button>
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
              Page {meta.current_page} of {meta.last_page} &nbsp;·&nbsp; {meta.total.toLocaleString()} total
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600"/>
              </button>
              <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
