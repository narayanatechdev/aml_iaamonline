'use client';

import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

const STORAGE_KEY = 'admin_settings_general';

interface GeneralSettings {
  journalName: string;
  issn: string;
  contactEmail: string;
  articlesPerPage: number;
  maintenanceMode: boolean;
}

const DEFAULTS: GeneralSettings = {
  journalName: 'Advanced Materials Letters',
  issn: '0976-3961',
  contactEmail: 'editor@iaamonline.org',
  articlesPerPage: 20,
  maintenanceMode: false,
};

export default function GeneralSettingsPage() {
  const [form, setForm] = useState<GeneralSettings>(DEFAULTS);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setToast({ type: 'success', message: 'General settings saved.', isVisible: true });
  };

  const input = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-3xl">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'General' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Core journal information and display preferences</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">Settings are saved in this browser. Server-side persistence can be wired to a settings API when available.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Journal Name</label>
          <input className={input} value={form.journalName} onChange={(e) => setForm({ ...form, journalName: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ISSN</label>
            <input className={input} value={form.issn} onChange={(e) => setForm({ ...form, issn: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
            <input type="email" className={input} value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Articles per page</label>
          <input type="number" min={5} max={100} className={input} value={form.articlesPerPage} onChange={(e) => setForm({ ...form, articlesPerPage: Number(e.target.value) })} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-[#0f2d6b] w-4 h-4" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
          <span className="text-sm text-gray-700">Enable maintenance mode (public site shows a notice)</span>
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
