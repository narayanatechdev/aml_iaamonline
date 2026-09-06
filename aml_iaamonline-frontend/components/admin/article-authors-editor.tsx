'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface EditableAuthor {
  author_id: number;
  name: string | null;
  email: string | null;
  orcid: string | null;
  is_corresponding: boolean;
  affiliation_ids: number[];
  affiliation_text: string | null;
}

interface AffiliationOption {
  id: number;
  name: string;
  country: string | null;
}

const inputCls =
  'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

/**
 * Per-article author editor: email, ORCID iD, corresponding flag, and
 * multi-affiliation assignment (rendered as superscripts 1, 2… on the
 * public article page). Affiliation numbering follows first appearance
 * in author order, matching the public page.
 */
export function ArticleAuthorsEditor({ articleId }: { articleId: string }) {
  const [authors, setAuthors] = useState<EditableAuthor[]>([]);
  const [affiliations, setAffiliations] = useState<AffiliationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_BASE}/admin/articles/${articleId}/authors`);
        if (!res.ok) throw new Error(`Failed to load authors (${res.status})`);
        const json = await res.json();
        setAuthors(json.data.authors ?? []);
        setAffiliations(json.data.affiliations ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load authors');
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  const patchAuthor = (index: number, patch: Partial<EditableAuthor>) => {
    setAuthors((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  };

  const toggleAffiliation = (index: number, affId: number) => {
    setAuthors((prev) =>
      prev.map((a, i) => {
        if (i !== index) return a;
        const has = a.affiliation_ids.includes(affId);
        return {
          ...a,
          affiliation_ids: has
            ? a.affiliation_ids.filter((id) => id !== affId)
            : [...a.affiliation_ids, affId],
        };
      })
    );
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/admin/articles/${articleId}/authors`, {
        method: 'PATCH',
        body: JSON.stringify({
          authors: authors.map((a) => ({
            author_id: a.author_id,
            email: a.email?.trim() || null,
            orcid: a.orcid?.trim() || null,
            is_corresponding: a.is_corresponding,
            affiliation_ids: a.affiliation_ids,
          })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        const detail =
          json?.errors ? Object.values(json.errors as Record<string, string[]>)[0]?.[0] : json?.message;
        throw new Error(detail || `Save failed (${res.status})`);
      }
      setAuthors(json.data.authors ?? []);
      setMessage('Authors saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-6 justify-center">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading authors…
      </div>
    );
  }

  if (authors.length === 0) {
    return <p className="text-sm text-gray-500">No linked author records for this article.</p>;
  }

  return (
    <div className="space-y-4">
      {affiliations.length > 0 && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600">
          Affiliation numbers on the article page:{' '}
          {affiliations.map((a, i) => (
            <span key={a.id} className="mr-2">
              <b className="text-[#0f2d6b]">{i + 1}</b> {a.name}
            </span>
          ))}
        </div>
      )}

      {authors.map((author, i) => (
        <div key={author.author_id} className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#0f2d6b]">{author.name ?? `Author ${i + 1}`}</span>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={author.is_corresponding}
                onChange={(e) => patchAuthor(i, { is_corresponding: e.target.checked })}
                className="w-4 h-4 accent-[#c9a227]"
              />
              Corresponding author *
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={author.email ?? ''}
                onChange={(e) => patchAuthor(i, { email: e.target.value })}
                className={inputCls}
                placeholder="author@university.edu"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">ORCID iD</label>
              <input
                value={author.orcid ?? ''}
                onChange={(e) => patchAuthor(i, { orcid: e.target.value })}
                className={inputCls + ' font-mono'}
                placeholder="0000-0002-1825-0097"
              />
            </div>
          </div>
          {affiliations.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Affiliations (an author can have several)
              </label>
              <div className="flex flex-wrap gap-2">
                {affiliations.map((aff, n) => (
                  <label
                    key={aff.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-colors ${
                      author.affiliation_ids.includes(aff.id)
                        ? 'bg-[#0f2d6b] text-white border-[#0f2d6b]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#0f2d6b]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={author.affiliation_ids.includes(aff.id)}
                      onChange={() => toggleAffiliation(i, aff.id)}
                      className="sr-only"
                    />
                    <b>{n + 1}</b> {aff.name.length > 46 ? aff.name.slice(0, 45) + '…' : aff.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center justify-end gap-3">
        {message && <span className="text-xs text-emerald-600">{message}</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save authors
        </button>
      </div>
    </div>
  );
}
