'use client';

import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

const STORAGE_KEY = 'admin_settings_workflow';

interface WorkflowSettings {
  reviewersPerManuscript: number;
  reviewDeadlineDays: number;
  minReviewsForDecision: number;
  autoAssignEditor: boolean;
  doubleBlind: boolean;
}

const DEFAULTS: WorkflowSettings = {
  reviewersPerManuscript: 3,
  reviewDeadlineDays: 21,
  minReviewsForDecision: 2,
  autoAssignEditor: true,
  doubleBlind: true,
};

export default function WorkflowSettingsPage() {
  const [form, setForm] = useState<WorkflowSettings>(DEFAULTS);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setToast({ type: 'success', message: 'Workflow settings saved.', isVisible: true });
  };

  const input = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-3xl">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Workflow' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workflow Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Peer review process and editorial defaults</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">Settings are saved in this browser. Server-side persistence can be wired to a settings API when available.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reviewers / manuscript</label>
            <input type="number" min={1} max={6} className={input} value={form.reviewersPerManuscript} onChange={(e) => setForm({ ...form, reviewersPerManuscript: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review deadline (days)</label>
            <input type="number" min={7} max={90} className={input} value={form.reviewDeadlineDays} onChange={(e) => setForm({ ...form, reviewDeadlineDays: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min reviews for decision</label>
            <input type="number" min={1} max={6} className={input} value={form.minReviewsForDecision} onChange={(e) => setForm({ ...form, minReviewsForDecision: Number(e.target.value) })} />
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-[#0f2d6b] w-4 h-4" checked={form.autoAssignEditor} onChange={(e) => setForm({ ...form, autoAssignEditor: e.target.checked })} />
          <span className="text-sm text-gray-700">Automatically assign a handling editor on submission</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-[#0f2d6b] w-4 h-4" checked={form.doubleBlind} onChange={(e) => setForm({ ...form, doubleBlind: e.target.checked })} />
          <span className="text-sm text-gray-700">Double-blind review (hide author identities from reviewers)</span>
        </label>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button onClick={save} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <SimpleToast {...toast} onClose={() => setToast((t) => ({ ...t, isVisible: false }))} />
    </div>
  );
}
