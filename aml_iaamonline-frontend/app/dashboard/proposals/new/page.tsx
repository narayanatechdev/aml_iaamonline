'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { authFetch, API_BASE } from '@/lib/userAuth';

const STEPS = ['Type', 'Details', 'Scale & plan', 'Review'];
const input = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20';

export default function NewProposalPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ kind: 'Book', title: '', editors: '', scope: '', units: '', timeline: '', audience: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const next = () => {
    setError(null);
    if (step === 1 && (!form.title.trim() || form.scope.trim().length < 10)) { setError('Add a working title and a scope (at least 10 characters).'); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await authFetch(`${API_BASE}/proposals`, { method: 'POST', body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) {
        const fe = json.errors ? Object.values(json.errors)[0] : null;
        throw new Error((Array.isArray(fe) ? fe[0] : fe) || json.message || 'Could not submit.');
      }
      router.push('/dashboard/proposals');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserDashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">New Proposal</h1>
        <p className="text-gray-500 text-sm mb-6">IAAM Publications · book &amp; proceedings commissioning</p>

        {/* steps */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-[#0f2d6b] text-white' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>{i < step ? <Check className="w-4 h-4" /> : i + 1}</div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">Proposal type</h2>
              {['Book', 'Conference Proceedings'].map((k) => (
                <button key={k} onClick={() => setForm({ ...form, kind: k })} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.kind === k ? 'border-[#0f2d6b] bg-[#0f2d6b]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="font-semibold text-gray-900">{k}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{k === 'Book' ? 'Edited volume, monograph or reference work' : 'Peer-reviewed proceedings of an IAAM event'}</div>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Details</h2>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Working title</label><input className={input} value={form.title} onChange={set('title')} placeholder="e.g. Advanced Materials for Decentralized Healthcare" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Editor(s) / organiser(s)</label><input className={input} value={form.editors} onChange={set('editors')} placeholder="Names & affiliations" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Scope &amp; rationale</label><textarea rows={4} className={`${input} resize-none`} value={form.scope} onChange={set('scope')} placeholder="What the volume covers and why it matters now…" /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Scale &amp; plan</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{form.kind === 'Book' ? 'Estimated chapters' : 'Estimated papers'}</label><input className={input} value={form.units} onChange={set('units')} placeholder={form.kind === 'Book' ? 'e.g. 14 chapters' : 'e.g. ~120 papers'} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Target timeline</label><input className={input} value={form.timeline} onChange={set('timeline')} placeholder="e.g. 12 months" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Primary audience</label><input className={input} value={form.audience} onChange={set('audience')} placeholder="e.g. Researchers, clinicians, policymakers" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Review &amp; submit</h2>
              {[['Type', form.kind], ['Title', form.title], ['Editors', form.editors || '—'], ['Scale', form.units || '—'], ['Timeline', form.timeline || '—']].map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm py-2 border-b border-gray-100"><span className="text-gray-500 w-28 flex-shrink-0">{k}</span><span className="text-gray-900 font-medium">{v}</span></div>
              ))}
            </div>
          )}

          {error && <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200"><AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-red-700">{error}</p></div>}

          <div className="flex justify-between pt-2">
            <button onClick={() => step === 0 ? router.push('/dashboard/proposals') : setStep((s) => s - 1)} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Cancel' : 'Back'}</button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="flex items-center gap-1 px-5 py-2 text-sm font-semibold text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">Continue <ArrowRight className="w-4 h-4" /></button>
            ) : (
              <button onClick={submit} disabled={submitting} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-[#c9a227] rounded-lg hover:bg-[#b8911f] disabled:opacity-50">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Submit proposal</button>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
