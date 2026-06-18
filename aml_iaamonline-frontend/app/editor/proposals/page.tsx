'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, BookOpen, Check, X } from 'lucide-react';
import { EditorShell } from '@/components/editor/EditorShell';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Proposal {
  id: number; proposal_id: string; kind: string; title: string; editors?: string;
  scope?: string; units?: string; timeline?: string; audience?: string; status: string;
}

const PSTATUS: Record<string, { label: string; color: string }> = {
  proposed: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_evaluation: { label: 'Under Evaluation', color: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
};

export default function EditorProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState<Proposal | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/proposals`);
      if (res.ok) setProposals((await res.json()).data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (decision: 'approved' | 'declined') => {
    if (!open) return;
    setBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/proposals/${open.id}/decision`, { method: 'POST', body: JSON.stringify({ decision }) });
      if (res.ok) { setOpen(null); await load(); }
    } finally {
      setBusy(false);
    }
  };

  return (
    <EditorShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book &amp; proceedings proposals</h1>
          <p className="text-gray-500 text-sm mt-0.5">Commissioning queue — evaluate and approve book &amp; proceedings proposals.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : proposals.length === 0 ? (
            <div className="py-16 text-center"><BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">No proposals in the queue.</p></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Proposal</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3.5">
                      <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{p.proposal_id}</p>
                      <p className="text-sm font-medium text-gray-900">{p.title}</p>
                      {p.editors && <p className="text-xs text-gray-400 mt-0.5">{p.editors}</p>}
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell text-xs text-gray-600">{p.kind}</td>
                    <td className="px-3 py-3.5"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${PSTATUS[p.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>{PSTATUS[p.status]?.label ?? p.status}</span></td>
                    <td className="px-6 py-3.5 text-right"><button onClick={() => setOpen(p)} className="text-xs font-medium text-[#0f2d6b] hover:underline">Open →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !busy && setOpen(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-mono text-[#c9a227] font-semibold">{open.proposal_id} · {open.kind}</p>
            <h3 className="text-lg font-bold text-gray-900 mt-1 mb-3">{open.title}</h3>
            <div className="space-y-2 text-sm mb-5">
              {open.editors && <p><span className="text-gray-500">Editors:</span> {open.editors}</p>}
              {open.scope && <p className="text-gray-700 leading-relaxed">{open.scope}</p>}
              <div className="flex gap-4 text-xs text-gray-500 pt-2">
                {open.units && <span>Scale: {open.units}</span>}
                {open.timeline && <span>Timeline: {open.timeline}</span>}
              </div>
            </div>
            {['proposed', 'under_evaluation'].includes(open.status) ? (
              <div className="flex gap-2">
                <button disabled={busy} onClick={() => decide('approved')} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"><Check className="w-4 h-4" /> Approve</button>
                <button disabled={busy} onClick={() => decide('declined')} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"><X className="w-4 h-4" /> Decline</button>
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500">This proposal has been {PSTATUS[open.status]?.label.toLowerCase()}.</p>
            )}
            <button onClick={() => setOpen(null)} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </EditorShell>
  );
}
