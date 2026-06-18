'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Award, Users } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface EditorRow {
  editor_id: number;
  name: string;
  email: string;
  roles: string[];
  decisions_this_month: number;
  total_decisions: number;
  invitations_sent: number;
}

export default function EditorPerformancePage() {
  const [rows, setRows] = useState<EditorRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/admin/analytics/editor-performance`);
      if (!res.ok) throw new Error('Failed to load editor performance');
      const json = await res.json();
      setRows(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-full">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics', href: '/admin/analytics' },
          { label: 'Editor Performance' },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor Performance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Decisions and reviewer invitations per editor</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">Retry</button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Editors</h2>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => (<div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />))}</div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No editor activity recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Editor</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3">This month</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3">Total decisions</th>
                    <th className="text-right text-xs font-semibold text-gray-500 px-6 py-3">Invitations sent</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.editor_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f2d6b] to-[#c9a227] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {idx === 0 ? <Award className="w-4 h-4" /> : initials(r.name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{r.name}</div>
                            <div className="text-xs text-gray-400">{r.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-right text-sm font-medium text-gray-700">{r.decisions_this_month}</td>
                      <td className="px-3 py-3.5 text-right text-sm font-semibold text-[#0f2d6b]">{r.total_decisions}</td>
                      <td className="px-6 py-3.5 text-right text-sm text-gray-700">{r.invitations_sent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
