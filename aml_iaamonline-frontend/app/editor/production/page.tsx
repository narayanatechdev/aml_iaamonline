'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Send, Check, Rocket } from 'lucide-react';
import { EditorShell } from '@/components/editor/EditorShell';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Manuscript {
  id: number; submission_id?: string; title: string; status: string;
  prod_copyedit?: boolean; prod_typeset?: boolean; prod_proof?: boolean; prod_xml?: boolean;
  volume?: string; issue?: string; pages?: string; doi?: string;
}

const STEPS: { key: 'prod_copyedit' | 'prod_typeset' | 'prod_proof' | 'prod_xml'; label: string }[] = [
  { key: 'prod_copyedit', label: 'Copyediting' },
  { key: 'prod_typeset', label: 'Typesetting & layout' },
  { key: 'prod_proof', label: 'Author proof approval' },
  { key: 'prod_xml', label: 'Final XML / PDF & DOI' },
];

export default function ProductionPage() {
  const [list, setList] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState<Manuscript | null>(null);
  const [busy, setBusy] = useState(false);
  const [pub, setPub] = useState({ volume: '17', issue: '1', pages: '', doi: '' });

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/manuscripts?per_page=100`);
      if (res.ok) {
        const data = (await res.json()).data ?? [];
        setList(data.filter((m: Manuscript) => ['accepted', 'production', 'published'].includes(m.status)));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refreshOpen = (data: Manuscript[]) => { if (open) { const u = data.find((x) => x.id === open.id); if (u) setOpen(u); } };

  const sendToProduction = async (m: Manuscript) => {
    setBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/production/${m.id}/start`, { method: 'POST' });
      if (res.ok) { const j = await res.json(); setOpen(j.data); await load(); }
    } finally { setBusy(false); }
  };

  const toggle = async (m: Manuscript, key: string, value: boolean) => {
    setBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/production/${m.id}`, { method: 'PATCH', body: JSON.stringify({ step: key, value }) });
      if (res.ok) { const j = await res.json(); setOpen(j.data); load().then(() => refreshOpen(list)); }
    } finally { setBusy(false); }
  };

  const publish = async (m: Manuscript) => {
    setBusy(true);
    try {
      const res = await authFetch(`${API_BASE}/editor/publish/${m.id}`, { method: 'POST', body: JSON.stringify(pub) });
      if (res.ok) { const j = await res.json(); setOpen(j.data); await load(); }
    } finally { setBusy(false); }
  };

  const allDone = (m: Manuscript) => m.prod_copyedit && m.prod_typeset && m.prod_proof && m.prod_xml;

  return (
    <EditorShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Production</h1>
          <p className="text-gray-500 text-sm mt-0.5">Accepted manuscripts in copyediting, typesetting and proofing.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center"><Rocket className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-500">Nothing in production yet.</p></div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Manuscript</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Stage</th>
                <th className="px-6 py-3"></th>
              </tr></thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3.5"><p className="text-sm font-medium text-gray-900">{m.title}</p>{m.doi && <p className="text-xs text-blue-600 mt-0.5">DOI: {m.doi}</p>}</td>
                    <td className="px-3 py-3.5"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m.status === 'published' ? 'bg-green-100 text-green-800' : m.status === 'production' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'}`}>{m.status}</span></td>
                    <td className="px-6 py-3.5 text-right"><button onClick={() => { setOpen(m); setPub({ volume: m.volume || '17', issue: m.issue || '1', pages: m.pages || '', doi: m.doi || '' }); }} className="text-xs font-medium text-[#0f2d6b] hover:underline">Open →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto" onClick={() => !busy && setOpen(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{open.title}</h3>
            <p className="text-xs text-gray-500 mb-5 capitalize">Status: {open.status}</p>

            {open.status === 'accepted' ? (
              <button disabled={busy} onClick={() => sendToProduction(open)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0f2d6b] text-white hover:bg-[#1a3d7c] disabled:opacity-50">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send to production
              </button>
            ) : (
              <>
                <div className="space-y-2 mb-5">
                  {STEPS.map((s) => (
                    <label key={s.key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <span className="flex items-center gap-2 text-sm text-gray-800">
                        <input type="checkbox" disabled={busy || open.status === 'published'} checked={!!open[s.key]} onChange={(e) => toggle(open, s.key, e.target.checked)} className="accent-[#0f2d6b] w-4 h-4" />
                        {s.label}
                      </span>
                      <span className={`text-xs font-semibold ${open[s.key] ? 'text-emerald-600' : 'text-gray-400'}`}>{open[s.key] ? 'Done' : 'Pending'}</span>
                    </label>
                  ))}
                </div>

                {open.status === 'published' ? (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
                    <p className="font-semibold mb-1">Published ✓</p>
                    <p>Volume {open.volume}({open.issue}){open.pages ? `, pp. ${open.pages}` : ''}</p>
                    <p className="text-xs mt-1">DOI: {open.doi}</p>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">{allDone(open) ? 'Assign issue & publish' : 'Complete all steps to publish'}</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <input value={pub.volume} onChange={(e) => setPub({ ...pub, volume: e.target.value })} placeholder="Vol" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                      <input value={pub.issue} onChange={(e) => setPub({ ...pub, issue: e.target.value })} placeholder="Issue" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                      <input value={pub.pages} onChange={(e) => setPub({ ...pub, pages: e.target.value })} placeholder="Pages" className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm" />
                    </div>
                    <button disabled={busy || !allDone(open)} onClick={() => publish(open)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-[#c9a227] text-white hover:bg-[#b8911f] disabled:opacity-50">
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Publish &amp; register DOI
                    </button>
                  </div>
                )}
              </>
            )}
            <button onClick={() => setOpen(null)} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </EditorShell>
  );
}
