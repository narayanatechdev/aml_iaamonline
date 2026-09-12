'use client';

import { useEffect, useState } from 'react';
import { Save, Info, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface WorkflowSettings {
  review_deadline_days: number;
  invite_response_days: number;
  invite_reminder_after_days: number;
  due_soon_reminder_days: number;
}

const FIELDS: { key: keyof WorkflowSettings; label: string; help: string }[] = [
  {
    key: 'review_deadline_days',
    label: 'Review deadline (days)',
    help: 'Default time reviewers get to submit their report after accepting.',
  },
  {
    key: 'invite_response_days',
    label: 'Invitation response window (days)',
    help: 'Invitations not answered within this window expire automatically.',
  },
  {
    key: 'invite_reminder_after_days',
    label: 'Invitation reminder after (days)',
    help: 'A single nudge email is sent this many days after an unanswered invitation.',
  },
  {
    key: 'due_soon_reminder_days',
    label: 'Due-soon reminder (days before deadline)',
    help: 'Reviewers get a reminder this many days before their review is due, and again on the due date.',
  },
];

export default function WorkflowSettingsPage() {
  const [settings, setSettings] = useState<WorkflowSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/admin/settings/workflow`);
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
        setSettings((await res.json()).data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/settings/workflow`, {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Save failed (${res.status})`);
      }
      setToast({ type: 'success', message: 'Workflow settings saved.', isVisible: true });
    } catch (e) {
      setToast({ type: 'error', message: e instanceof Error ? e.message : 'Save failed', isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-3xl">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Settings' },
          { label: 'Workflow' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Workflow Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Peer-review deadlines and the automated reminder cadence.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          The reminder scheduler runs daily at 06:00 server time: it nudges unanswered
          invitations, expires stale ones, and reminds reviewers before and on their deadline.
          Changes here apply from the next run.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error || !settings ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          {error ?? 'Settings unavailable.'}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="number"
                  min={1}
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: Math.max(1, parseInt(e.target.value, 10) || 1) })
                  }
                  className={input}
                />
                <p className="text-xs text-gray-400 mt-1">{field.help}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save changes
            </button>
          </div>
        </div>
      )}

      <SimpleToast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </div>
  );
}
