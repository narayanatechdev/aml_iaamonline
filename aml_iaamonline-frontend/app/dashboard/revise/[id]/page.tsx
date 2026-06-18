'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Upload, FileText, Send, AlertCircle, ArrowLeft } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { authFetch, API_BASE } from '@/lib/userAuth';

interface Manuscript {
  id: number; submission_id: string; title: string; status: string;
  decision_notes?: string | null; revision_round?: number;
}

export default function RevisePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [ms, setMs] = useState<Manuscript | null>(null);
  const [response, setResponse] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/my/manuscripts/${id}`);
      if (res.ok) setMs((await res.json()).data);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) load(); }, [id, load]);

  const submit = async () => {
    setError(null);
    if (response.trim().length < 10) { setError('Please write a response to the reviewers (at least 10 characters).'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('response', response);
      files.forEach((f) => fd.append('files[]', f));
      const res = await authFetch(`${API_BASE}/my/manuscripts/${id}/revise`, { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Could not submit revision.');
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0f2d6b] mb-5"><ArrowLeft className="w-4 h-4" /> Back to submissions</button>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" /></div>
        ) : done ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><Send className="w-7 h-7 text-emerald-600" /></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Revision submitted</h1>
            <p className="text-sm text-gray-500 mb-6">Your revised manuscript has returned to peer review.</p>
            <button onClick={() => router.push('/dashboard')} className="px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c]">Go to dashboard</button>
          </div>
        ) : !ms ? (
          <p className="text-sm text-gray-500">Manuscript not found.</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Submit a revision</h1>
            <p className="text-sm text-gray-500 mt-0.5 mb-6">{ms.title} {ms.revision_round ? `· currently R${ms.revision_round}` : ''}</p>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">Editor &amp; reviewer feedback</h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{ms.decision_notes || 'Please address the reviewer comments and upload your revised manuscript.'}</p>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Your point-by-point response</label>
                  <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={6} placeholder="Respond to each reviewer point, describing the changes made…" className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Revised files</label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#0f2d6b]/30 rounded-xl bg-gray-50 cursor-pointer hover:border-[#0f2d6b]/60">
                    <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
                    <Upload className="w-7 h-7 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Click to add revised PDFs</span>
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {files.map((f, i) => <li key={i} className="flex items-center gap-2 text-xs text-gray-600"><FileText className="w-3.5 h-3.5" />{f.name}</li>)}
                    </ul>
                  )}
                </div>

                {error && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700">{error}</p></div>}

                <button onClick={submit} disabled={submitting} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f2d6b] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3d7c] disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit revised manuscript
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </UserDashboardLayout>
  );
}
