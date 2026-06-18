'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Inbox, Search, ClipboardCheck, RotateCcw, CheckCircle, RefreshCw, FileText,
} from 'lucide-react';
import { EditorShell } from '@/components/editor/EditorShell';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Stats {
  new_triage?: number; under_review?: number; pending_decision?: number; in_revision?: number; accepted?: number;
}
interface Manuscript {
  id: number; title: string; status: string; submitted_at: string | null;
  authors?: string; category?: string;
  reviewers_total?: number; reviews_completed?: number;
}

const ATTENTION = ['decision', 'with_editor', 'submitted', 'revision_required'];
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

function fmt(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-CA');
}

export default function EditorDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [reviewers, setReviewers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decisionFor, setDecisionFor] = useState<Manuscript | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionBusy, setDecisionBusy] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [s, m, r] = await Promise.allSettled([
        authFetch(`${API_BASE}/editor/stats`),
        authFetch(`${API_BASE}/editor/manuscripts?per_page=50`),
        authFetch(`${API_BASE}/editor/reviewers`),
      ]);
      if (s.status === 'fulfilled' && s.value.ok) { const j = await s.value.json(); setStats(j.data ?? j); }
      if (m.status === 'fulfilled' && m.value.ok) { const j = await m.value.json(); setManuscripts(j.data ?? j.manuscripts ?? j ?? []); }
      if (r.status === 'fulfilled' && r.value.ok) { const j = await r.value.json(); setReviewers(j.data ?? []); }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // The editor invites a reviewer (peer review). Reviewers are people other than
  // the editor — they can't assign the review to themselves.
  const assignReviewer = async (id: number, reviewerId: string) => {
    const r = reviewers.find((x) => String(x.id) === reviewerId);
    if (!r) return;
    setAssigningId(id);
    try {
      const dueDate = new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10);
      const res = await authFetch(`${API_BASE}/editor/invite-reviewer`, {
        method: 'POST',
        body: JSON.stringify({ manuscript_id: id, reviewer_email: r.email, reviewer_name: r.name, due_date: dueDate }),
      });
      if (res.ok) await fetchData();
    } finally {
      setAssigningId(null);
    }
  };

  const submitDecision = async (decision: string) => {
    if (!decisionFor) return;
    setDecisionBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/decision`, {
        method: 'POST',
        body: JSON.stringify({ manuscript_id: decisionFor.id, decision, notes: decisionNotes || null }),
      });
      if (res.ok) {
        setDecisionFor(null);
        setDecisionNotes('');
        await fetchData();
      }
    } finally {
      setDecisionBusy(false);
    }
  };

  const attention = manuscripts.filter((m) => ATTENTION.includes(m.status));

  const cards = [
    { label: 'New / triage', value: stats?.new_triage ?? 0, icon: <Inbox className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-100' },
    { label: 'Under review', value: stats?.under_review ?? 0, icon: <Search className="w-5 h-5" />, color: 'text-amber-700', bg: 'bg-amber-100' },
    { label: 'Decision due', value: stats?.pending_decision ?? 0, icon: <ClipboardCheck className="w-5 h-5" />, color: 'text-purple-700', bg: 'bg-purple-100' },
    { label: 'In revision', value: stats?.in_revision ?? 0, icon: <RotateCcw className="w-5 h-5" />, color: 'text-orange-700', bg: 'bg-orange-100' },
    { label: 'Accepted', value: stats?.accepted ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  ];

  return (
    <EditorShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editorial dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Advanced Materials Letters · manuscript workflow overview</p>
          </div>
          <button onClick={fetchData} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.color} flex items-center justify-center mb-3`}>{c.icon}</div>
              <p className={`text-2xl font-bold ${c.color}`}>{isLoading ? '…' : c.value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">Needs your attention</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manuscripts awaiting triage, assignment, or a decision</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#0f2d6b]/8 text-[#0f2d6b]">{attention.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Manuscript</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Stage</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Reviews</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Submitted</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-10"><div className="h-12 bg-gray-100 rounded-lg animate-pulse" /></td></tr>
                ) : attention.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center"><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Nothing waiting — nice work.</p></td></tr>
                ) : (
                  attention.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 group">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{`AML-${String(m.id).padStart(4, '0')}`}</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-md">{m.title}</p>
                        {(m.category || m.authors) && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.category || m.authors}</p>}
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS[m.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>{STATUS[m.status]?.label ?? m.status}</span>
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        {m.reviewers_total ? <span className="text-xs text-gray-600">{m.reviews_completed ?? 0}/{m.reviewers_total} complete</span> : <span className="text-xs text-gray-400">none assigned</span>}
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell text-xs text-gray-500">{fmt(m.submitted_at)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {['submitted', 'with_editor', 'under_review'].includes(m.status) && (
                            <select defaultValue="" disabled={assigningId === m.id || reviewers.length === 0} onChange={(e) => assignReviewer(m.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 max-w-[150px] focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 disabled:opacity-50">
                              <option value="" disabled>{assigningId === m.id ? 'Inviting…' : 'Assign reviewer…'}</option>
                              {reviewers.map((rv) => <option key={rv.id} value={rv.id}>{rv.name}</option>)}
                            </select>
                          )}
                          {['under_review', 'decision'].includes(m.status) && (
                            <button onClick={() => { setDecisionFor(m); setDecisionNotes(''); }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0f2d6b] text-white hover:bg-[#1a3d7c]">Decide</button>
                          )}
                          {['submitted', 'with_editor', 'under_review', 'decision'].includes(m.status) ? null : (
                            <Link href="/editor/pipeline" className="text-xs font-medium text-[#0f2d6b]/70 hover:text-[#0f2d6b]">Open →</Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/editor/pipeline" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">
            <FileText className="w-4 h-4" /> Open full pipeline
          </Link>
        </div>
      </div>

      {/* Decision modal */}
      {decisionFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !decisionBusy && setDecisionFor(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Editorial decision</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{decisionFor.title}</p>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes to author <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              rows={4}
              placeholder="Summary of the decision and any required changes…"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <button disabled={decisionBusy} onClick={() => submitDecision('accept')} className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">Accept</button>
              <button disabled={decisionBusy} onClick={() => submitDecision('reject')} className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">Reject</button>
              <button disabled={decisionBusy} onClick={() => submitDecision('minor-revisions')} className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-amber-300 text-amber-800 hover:bg-amber-50 disabled:opacity-50">Minor revisions</button>
              <button disabled={decisionBusy} onClick={() => submitDecision('major-revisions')} className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-orange-300 text-orange-800 hover:bg-orange-50 disabled:opacity-50">Major revisions</button>
            </div>
            <button disabled={decisionBusy} onClick={() => setDecisionFor(null)} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}
    </EditorShell>
  );
}
