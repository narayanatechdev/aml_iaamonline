'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Search, Download, ScrollText } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface AuditLog {
  id: number;
  action: string;
  actor_type: string | null;
  actor_email: string | null;
  actor_ip: string | null;
  manuscript_id: number | null;
  description: string | null;
  status: string | null;
  created_at: string;
}

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

function formatDate(s: string) {
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ per_page: '25', page: String(page) });
      if (search) params.set('search', search);
      const res = await authFetch(`${API_BASE}/admin/analytics/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load audit logs');
      const json = await res.json();
      setLogs(json.data ?? []);
      setMeta(json.meta ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/analytics/audit-logs?export=csv`);
      if (!res.ok) throw new Error('Export failed');
      const json = await res.json();
      const { content, filename, mime_type } = json.data;
      const blob = new Blob([content], { type: mime_type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* swallow — export is best-effort */
    }
  };

  return (
    <div className="min-h-full">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics', href: '/admin/analytics' },
          { label: 'Audit Logs' },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">System activity and editorial actions{meta ? ` · ${meta.total.toLocaleString()} records` : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={fetchData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors disabled:opacity-50 shadow-sm">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(searchInput); }}
        className="flex gap-2 mb-6"
      >
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search description or actor email…"
            className="bg-transparent text-sm outline-none w-full text-gray-700"
          />
        </div>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors">Search</button>
      </form>

      {error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">Retry</button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(8)].map((_, i) => (<div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />))}</div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <ScrollText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No audit logs found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Action</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden md:table-cell">Actor</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Description</th>
                      <th className="text-right text-xs font-semibold text-gray-500 px-6 py-3">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#0f2d6b]/8 text-[#0f2d6b]">{log.action}</span>
                        </td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <div className="text-xs text-gray-700">{log.actor_email ?? '—'}</div>
                          {log.actor_type && <div className="text-xs text-gray-400">{log.actor_type}</div>}
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <span className="text-xs text-gray-600 line-clamp-1 max-w-md">{log.description ?? '—'}</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(log.created_at)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Page {meta.current_page} of {meta.last_page}</span>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
                    <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
