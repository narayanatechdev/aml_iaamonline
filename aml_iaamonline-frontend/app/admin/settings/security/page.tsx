'use client';

import { useState, useEffect } from 'react';
import { Save, Info, ShieldCheck } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';

const STORAGE_KEY = 'admin_settings_security';

interface SecuritySettings {
  sessionTimeoutMinutes: number;
  minPasswordLength: number;
  requireTwoFactor: boolean;
  lockoutAfterAttempts: number;
  allowSelfRegistration: boolean;
}

const DEFAULTS: SecuritySettings = {
  sessionTimeoutMinutes: 120,
  minPasswordLength: 8,
  requireTwoFactor: false,
  lockoutAfterAttempts: 5,
  allowSelfRegistration: true,
};

export default function SecuritySettingsPage() {
  const [form, setForm] = useState<SecuritySettings>(DEFAULTS);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setForm({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setToast({ type: 'success', message: 'Security settings saved.', isVisible: true });
  };

  const input = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-3xl">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Settings' }, { label: 'Security' }]} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Authentication and account protection policies</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">Settings are saved in this browser. Enforcement requires wiring these to the auth backend.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-10 h-10 rounded-xl bg-[#0f2d6b]/8 text-[#0f2d6b] flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Account Protection</div>
            <div className="text-xs text-gray-500">Applies to all admin and editorial accounts</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Session timeout (min)</label>
            <input type="number" min={15} max={1440} className={input} value={form.sessionTimeoutMinutes} onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min password length</label>
            <input type="number" min={6} max={64} className={input} value={form.minPasswordLength} onChange={(e) => setForm({ ...form, minPasswordLength: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Lockout after attempts</label>
            <input type="number" min={3} max={20} className={input} value={form.lockoutAfterAttempts} onChange={(e) => setForm({ ...form, lockoutAfterAttempts: Number(e.target.value) })} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-[#0f2d6b] w-4 h-4" checked={form.requireTwoFactor} onChange={(e) => setForm({ ...form, requireTwoFactor: e.target.checked })} />
          <span className="text-sm text-gray-700">Require two-factor authentication for staff accounts</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="accent-[#0f2d6b] w-4 h-4" checked={form.allowSelfRegistration} onChange={(e) => setForm({ ...form, allowSelfRegistration: e.target.checked })} />
          <span className="text-sm text-gray-700">Allow authors to self-register</span>
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
