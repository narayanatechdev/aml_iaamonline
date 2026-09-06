'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Info, Loader2, Plus, Trash2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface AccessTier {
  key: string;
  label: string;
  daily_limit: number;
  monthly_limit: number;
}

interface SubscriptionPlan {
  key: string;
  name: string;
  audience: 'individual' | 'institutional';
  price: number;
  currency: string;
  period: 'year' | 'month';
  description: string;
  benefits: string[];
  featured: boolean;
}

interface AccessModel {
  enabled: boolean;
  preview: 'abstract' | 'none';
  tiers: AccessTier[];
  plans: SubscriptionPlan[];
  article_price: number;
  currency: string;
  contact_email: string;
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

  const updatePlan = (index: number, patch: Partial<SubscriptionPlan>) => {
    setModel((prev) => {
      if (!prev) return prev;
      return { ...prev, plans: prev.plans.map((p, i) => (i === index ? { ...p, ...patch } : p)) };
    });
  };

  const save = async () => {
    if (!model) return;
    setSaving(true);
    try {
      const payload = {
        ...model,
        plans: (model.plans ?? []).map((p) => ({
          ...p,
          benefits: p.benefits.map((b) => b.trim()).filter((b) => b !== ''),
        })),
      };
      const res = await authFetch(`${API_BASE}/admin/settings/access`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
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

          {/* Subscription plans & fees */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Subscription plans & fees</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shown on the public Subscriptions page. Edit prices before launch.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setModel({
                    ...model,
                    plans: [
                      ...(model.plans ?? []),
                      {
                        key: `plan-${Date.now()}`,
                        name: '',
                        audience: 'individual',
                        price: 0,
                        currency: model.currency || 'USD',
                        period: 'year',
                        description: '',
                        benefits: [],
                        featured: false,
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs font-medium text-gray-500 hover:border-[#0f2d6b] hover:text-[#0f2d6b] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add plan
              </button>
            </div>

            {(model.plans ?? []).map((plan, i) => (
              <div key={plan.key} className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0f2d6b] uppercase tracking-wider">Plan {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setModel({ ...model, plans: model.plans.filter((_, j) => j !== i) })}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove plan ${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Plan name</label>
                    <input value={plan.name} onChange={(e) => updatePlan(i, { name: e.target.value })} className={input} placeholder="Individual Subscription" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Audience</label>
                    <select value={plan.audience} onChange={(e) => updatePlan(i, { audience: e.target.value as SubscriptionPlan['audience'] })} className={input}>
                      <option value="individual">Individual</option>
                      <option value="institutional">Institutional</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Price</label>
                      <input type="number" min={0} value={plan.price} onChange={(e) => updatePlan(i, { price: Math.max(0, Number(e.target.value) || 0) })} className={input} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Currency</label>
                      <input value={plan.currency} maxLength={3} onChange={(e) => updatePlan(i, { currency: e.target.value.toUpperCase() })} className={input} placeholder="USD" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Per</label>
                      <select value={plan.period} onChange={(e) => updatePlan(i, { period: e.target.value as SubscriptionPlan['period'] })} className={input}>
                        <option value="year">Year</option>
                        <option value="month">Month</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Short description</label>
                    <input value={plan.description} onChange={(e) => updatePlan(i, { description: e.target.value })} className={input} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Benefits (one per line)</label>
                  <textarea
                    value={plan.benefits.join('\n')}
                    onChange={(e) => updatePlan(i, { benefits: e.target.value.split('\n') })}
                    className={input + ' min-h-[70px] resize-y'}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={plan.featured} onChange={(e) => updatePlan(i, { featured: e.target.checked })} className="w-4 h-4 accent-[#0f2d6b]" />
                  Highlight as recommended plan
                </label>
              </div>
            ))}

            <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Per-article purchase fee</label>
                <input type="number" min={0} value={model.article_price ?? 0} onChange={(e) => setModel({ ...model, article_price: Math.max(0, Number(e.target.value) || 0) })} className={input} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Currency</label>
                <input value={model.currency ?? 'USD'} maxLength={3} onChange={(e) => setModel({ ...model, currency: e.target.value.toUpperCase() })} className={input} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subscription contact email</label>
                <input value={model.contact_email ?? ''} onChange={(e) => setModel({ ...model, contact_email: e.target.value })} className={input} />
              </div>
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
