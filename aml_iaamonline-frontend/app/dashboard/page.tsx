'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Clock, RotateCcw, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { authFetch, getUser, API_BASE } from '@/lib/userAuth';

interface Manuscript {
  id: number;
  submission_id: string;
  title: string;
  category: string | null;
  status: string;
  submitted_at: string | null;
  author_email?: string | null;
}

interface Stats {
  total: number;
  in_progress: number;
  awaiting_revision: number;
  decided: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', color: 'bg-amber-100 text-amber-800' },
  with_editor: { label: 'With Editor', color: 'bg-purple-100 text-purple-800' },
  decision: { label: 'Decision Due', color: 'bg-purple-100 text-purple-800' },
  revision_required: { label: 'Revision Required', color: 'bg-orange-100 text-orange-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  published: { label: 'Published', color: 'bg-teal-100 text-teal-800' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
}

function formatDate(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AuthorDashboardPage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getUser();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/my/manuscripts`);
      if (!res.ok) throw new Error('Could not load your submissions.');
      const json = await res.json();
      setManuscripts(json.data ?? []);
      setStats(json.stats ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    { label: 'In Progress', value: stats?.in_progress ?? 0, icon: <Clock className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-100' },
    { label: 'Awaiting Your Revision', value: stats?.awaiting_revision ?? 0, icon: <RotateCcw className="w-5 h-5" />, color: 'text-orange-700', bg: 'bg-orange-100' },
    { label: 'Decisions Received', value: stats?.decided ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
    { label: 'Total Submissions', value: stats?.total ?? 0, icon: <FileText className="w-5 h-5" />, color: 'text-[#0f2d6b]', bg: 'bg-[#0f2d6b]/10' },
  ];

  return (
    <UserDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {user ? `Welcome back, ${user.name} — ` : ''}track your manuscripts and start a new submission.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link href="/dashboard/submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#0d2560] transition-colors" style={{ fontWeight: 600 }}>
              <PlusCircle className="w-4 h-4" /> New Submission
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.color} flex items-center justify-center mb-3`}>{c.icon}</div>
              <p className={`text-2xl font-bold ${c.color}`}>{isLoading ? '…' : c.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-gray-900 text-base font-bold">Submissions</h2>
          </div>

          {error ? (
            <div className="py-14 text-center">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#0d2560]">Retry</button>
            </div>
          ) : isLoading ? (
            <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => (<div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />))}</div>
          ) : manuscripts.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f4fb] flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#0f2d6b]" />
              </div>
              <h3 className="text-[#0f1a2e] mb-2" style={{ fontSize: '1.1rem', fontWeight: 700 }}>No submissions yet</h3>
              <p className="text-[#5a6a8a] text-sm max-w-sm mx-auto mb-6">Your submitted manuscripts will appear here so you can track their status through peer review.</p>
              <Link href="/dashboard/submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#0d2560] transition-colors" style={{ fontWeight: 600 }}>
                <PlusCircle className="w-4 h-4" /> Start a Submission
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Manuscript</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Submitted</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {manuscripts.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{m.submission_id}</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-md">{m.title}</p>
                        {m.category && <p className="text-xs text-gray-400 mt-0.5">{m.category}</p>}
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <StatusBadge status={m.status} />
                        {m.status === 'revision_required' && <div className="text-xs text-orange-600 font-semibold mt-1">Action needed</div>}
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{formatDate(m.submitted_at)}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {m.status === 'revision_required' ? (
                          <Link href={`/dashboard/revise/${m.id}`} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors">
                            Submit revision
                          </Link>
                        ) : (
                          <Link href={`/dashboard/track?id=${m.submission_id}&email=${m.author_email}`} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0f2d6b] text-white hover:bg-[#0d2560] transition-colors">
                            View Tracking
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
