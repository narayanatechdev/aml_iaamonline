'use client';

import { useState } from 'react';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { authFetch, API_BASE } from '@/lib/adminAuth';

export interface UserAffiliationRow {
  name: string;
  email: string | null;
  is_primary: boolean;
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

/**
 * Structured affiliation editor for a user: numbered entries, each with its
 * own contact email, exactly one marked primary.
 */
export function UserAffiliationsEditor({
  userId,
  initial,
}: {
  userId: number;
  initial: UserAffiliationRow[];
}) {
  const [rows, setRows] = useState<UserAffiliationRow[]>(
    initial.length ? initial : [{ name: '', email: null, is_primary: true }]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patchRow = (index: number, patch: Partial<UserAffiliationRow>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const setPrimary = (index: number) =>
    setRows((prev) => prev.map((r, i) => ({ ...r, is_primary: i === index })));

  const removeRow = (index: number) =>
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length && !next.some((r) => r.is_primary)) next[0] = { ...next[0], is_primary: true };
      return next;
    });

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const payload = rows
        .filter((r) => r.name.trim() !== '')
        .map((r) => ({ name: r.name.trim(), email: r.email?.trim() || null, is_primary: r.is_primary }));
      const res = await authFetch(`${API_BASE}/admin/users/${userId}/affiliations`, {
        method: 'PATCH',
        body: JSON.stringify({ affiliations: payload }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const detail = json?.errors
          ? Object.values(json.errors as Record<string, string[]>)[0]?.[0]
          : json?.message;
        throw new Error(detail || `Save failed (${res.status})`);
      }
      setMessage('Affiliations saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Affiliations</h3>
        <button
          type="button"
          onClick={() => setRows((prev) => [...prev, { name: '', email: null, is_primary: prev.length === 0 }])}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 text-xs font-medium text-gray-500 hover:border-[#0f2d6b] hover:text-[#0f2d6b] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0f2d6b] uppercase tracking-wider">
                Affiliation {i + 1}
              </span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name={`primary-affiliation-${userId}`}
                    checked={row.is_primary}
                    onChange={() => setPrimary(i)}
                    className="w-3.5 h-3.5 accent-[#c9a227]"
                  />
                  Primary
                </label>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove affiliation ${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={row.name}
              onChange={(e) => patchRow(i, { name: e.target.value })}
              className={inputCls + ' min-h-[52px] resize-y text-xs'}
              placeholder="Department, Institution, City, Country"
            />
            <input
              type="email"
              value={row.email ?? ''}
              onChange={(e) => patchRow(i, { email: e.target.value })}
              className={inputCls + ' text-xs'}
              placeholder="Email at this affiliation (optional)"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-3">
        {message && <span className="text-[11px] text-emerald-600">{message}</span>}
        {error && <span className="text-[11px] text-red-600">{error}</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2d6b] text-white text-xs font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
      </div>
    </div>
  );
}
