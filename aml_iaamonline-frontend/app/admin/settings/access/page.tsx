'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Info, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface AccessTier {
  key: string;
  label: string;
  daily_limit: number;
  monthly_limit: number;
}

interface AccessModel {
  enabled: boolean;
  preview: 'abstract' | 'none';
  tiers: AccessTier[];
}

export default function AccessSettingsPage() {
  const [model, setModel] = useState<AccessModel | null>(null);
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
        const res = await authFetch(`${API_BASE}/admin/settings/access`);
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);
        const json = await res.json();
        setModel(json.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateTier = useCallback(
    (index: number, field: 'label' | 'daily_limit' | 'monthly_limit', value: string) => {
      setModel((prev) => {
        if (!prev) return prev;
        const tiers = prev.tiers.map((t, i) => {
          if (i !== index) return t;
          if (field === 'label') return { ...t, label: value };
          const n = Math.max(0, parseInt(value, 10) || 0);
          return { ...t, [field]: n };
        });
        return { ...prev, tiers };
      });
    },
    []
  );

  const save = async () => {
    if (!model) return;
    setSaving(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/settings/access`, {
        method: 'PATCH',
        body: JSON.stringify(model),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Save failed (${res.status})`);
      }
      setToast({ type: 'success', message: 'Access model saved.', isVisible: true });
    } catch (e) {
      setToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Save failed',
        isVisible: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-4xl">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Settings' },
          { label: 'Access & Subscription' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Access & Subscription</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Article access allowances per IAAM membership category. Changes apply immediately across
          the site.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Members receive the daily and monthly article allowances below. Non-members see the
          article preview and are invited to subscribe or become an IAAM member.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : error || !model ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          {error ?? 'Settings unavailable.'}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <label className="flex items-center justify-between">
              <span>
                <span className="block text-sm font-medium text-gray-700">
                  Subscription model enabled
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  When off, full text is not gated (pre-launch/testing only).
                </span>
              </span>
              <input
                type="checkbox"
                checked={model.enabled}
                onChange={(e) => setModel({ ...model, enabled: e.target.checked })}
                className="w-5 h-5 accent-[#0f2d6b]"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Non-subscriber preview
              </label>
              <select
                value={model.preview}
                onChange={(e) =>
                  setModel({ ...model, preview: e.target.value as AccessModel['preview'] })
                }
                className={input}
              >
                <option value="abstract">Abstract and article details (recommended)</option>
                <option value="none">Title and metadata only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Membership tiers & article allowances
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="pb-2 pr-4 font-medium">Tier</th>
                    <th className="pb-2 pr-4 font-medium w-36">Articles / day</th>
                    <th className="pb-2 font-medium w-36">Articles / month</th>
                  </tr>
                </thead>
                <tbody>
                  {model.tiers.map((tier, i) => (
                    <tr key={tier.key} className="border-t border-gray-100">
                      <td className="py-2.5 pr-4">
                        <input
                          value={tier.label}
                          onChange={(e) => updateTier(i, 'label', e.target.value)}
                          className={input}
                          aria-label={`Label for ${tier.key} tier`}
                        />
                      </td>
                      <td className="py-2.5 pr-4">
                        <input
                          type="number"
                          min={0}
                          value={tier.daily_limit}
                          onChange={(e) => updateTier(i, 'daily_limit', e.target.value)}
                          className={input}
                          aria-label={`Daily article limit for ${tier.label}`}
                        />
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          min={0}
                          value={tier.monthly_limit}
                          onChange={(e) => updateTier(i, 'monthly_limit', e.target.value)}
                          className={input}
                          aria-label={`Monthly article limit for ${tier.label}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
