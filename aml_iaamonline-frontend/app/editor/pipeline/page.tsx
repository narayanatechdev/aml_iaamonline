'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, FileText } from 'lucide-react';
import { EditorShell } from '@/components/editor/EditorShell';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Manuscript {
  id: number; submission_id?: string; title: string; status: string;
  submitted_at: string | null; authors?: string; category?: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', color: 'bg-amber-100 text-amber-800' },
  with_editor: { label: 'With Editor', color: 'bg-purple-100 text-purple-800' },
  decision: { label: 'Decision Due', color: 'bg-purple-100 text-purple-800' },
  revision_required: { label: 'Revision Required', color: 'bg-orange-100 text-orange-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  published: { label: 'Published', color: 'bg-teal-100 text-teal-800' },
};

const FILTERS = ['all', 'submitted', 'under_review', 'decision', 'revision_required', 'accepted', 'published'];

function fmt(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-CA');
}

export default function EditorPipelinePage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/manuscripts?per_page=100`);
      if (res.ok) { const j = await res.json(); setManuscripts(j.data ?? j.manuscripts ?? j ?? []); }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const rows = filter === 'all' ? manuscripts : manuscripts.filter((m) => m.status === filter);

  return (
    <EditorShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manuscript pipeline</h1>
            <p className="text-gray-500 text-sm mt-0.5">Every manuscript currently in the system</p>
          </div>
          <button onClick={fetchData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-[#0f2d6b] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f === 'all' ? 'All' : STATUS[f]?.label ?? f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center"><FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No manuscripts in this stage.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Manuscript</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Stage</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{m.submission_id || `AML-${String(m.id).padStart(4, '0')}`}</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-lg">{m.title}</p>
                        {(m.category || m.authors) && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.category || m.authors}</p>}
                      </td>
                      <td className="px-3 py-3.5"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS[m.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>{STATUS[m.status]?.label ?? m.status}</span></td>
                      <td className="px-6 py-3.5 hidden lg:table-cell text-xs text-gray-500">{fmt(m.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EditorShell>
  );
}
