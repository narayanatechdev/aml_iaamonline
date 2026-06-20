'use client';

import { useState, useEffect, useCallback } from 'react';
import { Inbox, Clock, CheckCircle, Loader2, Check, X, FileText, Star } from 'lucide-react';
import { ReviewerShell } from '@/components/reviewer/ReviewerShell';
import { authFetch, API_BASE } from '@/lib/userAuth';

interface Manuscript { id: number; submission_id?: string; title: string; abstract?: string; category?: string; division?: string }
interface Assignment {
  id: number; status: string; due_date?: string | null; invited_at?: string | null;
  manuscript?: Manuscript;
}
interface Stats { invited: number; accepted: number; completed: number }

const STATUS: Record<string, { label: string; color: string }> = {
  invited: { label: 'Invitation', color: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'In Progress', color: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', color: 'bg-gray-100 text-gray-600' },
};

const CRITERIA: { key: 'quality_score' | 'novelty_score' | 'relevance_score'; label: string }[] = [
  { key: 'quality_score', label: 'Scientific quality' },
  { key: 'novelty_score', label: 'Novelty & originality' },
  { key: 'relevance_score', label: 'Relevance' },
];
const RECS = [
  { value: 'accept', label: 'Accept', color: 'text-emerald-700 border-emerald-300' },
  { value: 'minor', label: 'Minor revisions', color: 'text-amber-700 border-amber-300' },
  { value: 'major', label: 'Major revisions', color: 'text-orange-700 border-orange-300' },
  { value: 'reject', label: 'Reject', color: 'text-red-700 border-red-300' },
];

function fmt(s?: string | null) { if (!s) return '—'; const d = new Date(s); return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-CA'); }

export default function ReviewerPortalPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [reviewFor, setReviewFor] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ recommendation: '', quality_score: 0, novelty_score: 0, relevance_score: 0, comments: '', confidential_comments: '' });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/reviewer/assignments`);
      if (res.ok) { const j = await res.json(); setAssignments(j.data ?? []); setStats(j.stats ?? null); }
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const respond = async (a: Assignment, decision: 'accept' | 'decline') => {
    setBusy(a.id);
    try {
      const res = await authFetch(`${API_BASE}/reviewer/assignments/${a.id}/respond`, { method: 'POST', body: JSON.stringify({ decision }) });
      if (res.ok) await load();
    } finally { setBusy(null); }
  };

  const submitReview = async () => {
    if (!reviewFor) return;
    setError(null);
    if (!form.recommendation) { setError('Please select a recommendation.'); return; }
    if (form.comments.trim().length < 10) { setError('Please add comments for the authors.'); return; }
    setBusy(reviewFor.id);
    try {
      const res = await authFetch(`${API_BASE}/reviewer/assignments/${reviewFor.id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          recommendation: form.recommendation,
          quality_score: form.quality_score || null,
          novelty_score: form.novelty_score || null,
          relevance_score: form.relevance_score || null,
          comments: form.comments,
          confidential_comments: form.confidential_comments || null,
        }),
      });
      if (res.ok) { setReviewFor(null); setForm({ recommendation: '', quality_score: 0, novelty_score: 0, relevance_score: 0, comments: '', confidential_comments: '' }); await load(); }
    } finally { setBusy(null); }
  };

  const cards = [
    { label: 'Invitations', value: stats?.invited ?? 0, icon: <Inbox className="w-5 h-5" />, color: 'text-blue-700', bg: 'bg-blue-100' },
    { label: 'In Progress', value: stats?.accepted ?? 0, icon: <Clock className="w-5 h-5" />, color: 'text-amber-700', bg: 'bg-amber-100' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  ];

  return (
    <ReviewerShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review invitations and assignments. Your identity is never shared with the authors.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.color} flex items-center justify-center mb-3`}>{c.icon}</div>
              <p className={`text-2xl font-bold ${c.color}`}>{isLoading ? '…' : c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-base font-bold text-gray-900">Assignments</h2></div>
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : assignments.length === 0 ? (
            <div className="py-16 text-center"><FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No review assignments yet.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {assignments.map((a) => (
                <div key={a.id} className="px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS[a.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>{STATUS[a.status]?.label ?? a.status}</span>
                      {a.due_date && <span className="text-xs text-gray-400">Due {fmt(a.due_date)}</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{a.manuscript?.title ?? 'Manuscript'}</p>
                    {a.manuscript?.abstract && <p className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-2xl">{a.manuscript.abstract}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {a.status === 'invited' && (
                      <>
                        <button disabled={busy === a.id} onClick={() => respond(a, 'accept')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">Accept</button>
                        <button disabled={busy === a.id} onClick={() => respond(a, 'decline')} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50">Decline</button>
                      </>
                    )}
                    {a.status === 'accepted' && (
                      <button onClick={() => setReviewFor(a)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0f2d6b] text-white hover:bg-[#1a3d7c]">Write review</button>
                    )}
                    {a.status === 'completed' && <span className="text-xs text-gray-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Submitted</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review modal */}
      {reviewFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto" onClick={() => busy === null && setReviewFor(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Submit review</h3>
            <p className="text-xs text-gray-500 mb-5 line-clamp-2">{reviewFor.manuscript?.title}</p>

            <p className="text-sm font-semibold text-gray-900 mb-2">Recommendation</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {RECS.map((r) => (
                <button key={r.value} onClick={() => setForm({ ...form, recommendation: r.value })} className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.recommendation === r.value ? `${r.color} bg-gray-50` : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{r.label}</button>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-2">Scores <span className="text-gray-400 font-normal">(1–5)</span></p>
            <div className="space-y-2 mb-5">
              {CRITERIA.map((c) => (
                <div key={c.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{c.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setForm({ ...form, [c.key]: n })} className={`w-7 h-7 rounded-md border flex items-center justify-center ${form[c.key] >= n ? 'bg-[#c9a227] text-white border-[#c9a227]' : 'border-gray-200 text-gray-300'}`}><Star className="w-3.5 h-3.5" fill={form[c.key] >= n ? 'currentColor' : 'none'} /></button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Comments to authors</label>
            <textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20" placeholder="Constructive feedback shared with the authors…" />

            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Confidential comments to editor <span className="text-gray-400 font-normal">(not shown to authors)</span></label>
            <textarea value={form.confidential_comments} onChange={(e) => setForm({ ...form, confidential_comments: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20" placeholder="Your candid assessment for the handling editor…" />

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            <div className="flex gap-2">
              <button disabled={busy !== null} onClick={submitReview} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#0f2d6b] text-white hover:bg-[#1a3d7c] disabled:opacity-50">{busy !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit review</button>
              <button onClick={() => setReviewFor(null)} className="px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-1"><X className="w-4 h-4" /> Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ReviewerShell>
  );
}
