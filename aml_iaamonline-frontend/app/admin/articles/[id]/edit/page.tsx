'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Check, AlertCircle, Upload } from 'lucide-react';
import { authFetch, API_BASE, getToken } from '@/lib/adminAuth';

const API_URL = API_BASE;

type Article = Record<string, unknown> & {
  id: number;
  legacy_id?: string | null;
  title?: string;
  authors?: { first_name?: string; last_name?: string; name?: string }[];
};

/** Fields grouped into sections for the form. */
const SECTIONS: { title: string; fields: { key: string; label: string; type: 'text' | 'textarea' | 'number' | 'date' | 'select'; options?: string[] }[] }[] = [
  {
    title: 'Basics',
    fields: [
      { key: 'title', label: 'Title', type: 'textarea' },
      { key: 'document_type', label: 'Type', type: 'select', options: ['Research Article', 'Review', 'Letter', 'Communication', 'Editorial'] },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'in_production', 'retracted'] },
    ],
  },
  {
    title: 'Content',
    fields: [
      { key: 'abstract', label: 'Abstract', type: 'textarea' },
      { key: 'keywords', label: 'Keywords (comma separated)', type: 'text' },
    ],
  },
  {
    title: 'Publication',
    fields: [
      { key: 'volume', label: 'Volume', type: 'text' },
      { key: 'issue', label: 'Issue', type: 'text' },
      { key: 'pages_from', label: 'Page from', type: 'number' },
      { key: 'pages_to', label: 'Page to', type: 'number' },
      { key: 'publish_year', label: 'Year', type: 'number' },
      { key: 'publish_month', label: 'Month', type: 'text' },
      { key: 'publish_date', label: 'Publish date', type: 'date' },
      { key: 'language', label: 'Language', type: 'text' },
      { key: 'corresponding_author', label: 'Corresponding author', type: 'text' },
    ],
  },
  {
    title: 'Identifiers & links',
    fields: [
      { key: 'doi', label: 'DOI', type: 'text' },
      { key: 'doi_link', label: 'DOI link', type: 'text' },
      { key: 'google_scholar_id', label: 'Google Scholar ID', type: 'text' },
      { key: 'pdf_url', label: 'PDF URL', type: 'text' },
      { key: 'original_pdf_url', label: 'Original PDF URL', type: 'text' },
      { key: 'graphical_abstract_url', label: 'Graphical abstract URL', type: 'text' },
      { key: 'article_link', label: 'Article link', type: 'text' },
    ],
  },
  {
    title: 'Dates',
    fields: [
      { key: 'receive_date', label: 'Received', type: 'date' },
      { key: 'revise_date', label: 'Revised', type: 'date' },
      { key: 'accept_date', label: 'Accepted', type: 'date' },
    ],
  },
  {
    title: 'Additional sections',
    fields: [
      { key: 'acknowledgements', label: 'Acknowledgements', type: 'textarea' },
      { key: 'funding_information', label: 'Funding information', type: 'textarea' },
      { key: 'conflict_of_interest', label: 'Conflict of interest', type: 'textarea' },
      { key: 'data_availability', label: 'Data availability', type: 'textarea' },
    ],
  },
  {
    title: 'Metrics',
    fields: [
      { key: 'views_count', label: 'Views', type: 'number' },
      { key: 'pdf_downloads', label: 'PDF downloads', type: 'number' },
      { key: 'cited_count', label: 'Citations', type: 'number' },
    ],
  },
];

const ALL_KEYS = SECTIONS.flatMap((s) => s.fields.map((f) => f.key));
const DATE_KEYS = new Set(['publish_date', 'receive_date', 'revise_date', 'accept_date']);
/** URL fields that should show a live image preview under the input. */
const IMAGE_KEYS = new Set(['graphical_abstract_url']);

export default function ArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/admin/articles/${id}`);
      if (res.status === 403) throw new Error('You do not have permission to edit articles.');
      if (res.status === 404) throw new Error('Article not found.');
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = await res.json();
      const data: Article = json.data ?? json;
      setArticle(data);

      const initial: Record<string, string> = {};
      for (const key of ALL_KEYS) {
        const v = data[key];
        if (v === null || v === undefined) {
          initial[key] = '';
        } else if (DATE_KEYS.has(key)) {
          initial[key] = String(v).slice(0, 10); // YYYY-MM-DD for <input type=date>
        } else {
          initial[key] = String(v);
        }
      }
      setForm(initial);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const [uploading, setUploading] = useState(false);
  const [failedSrc, setFailedSrc] = useState<Set<string>>(new Set());

  const uploadGraphicalAbstract = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = getToken();
      // Do NOT set Content-Type — the browser adds the multipart boundary.
      const res = await fetch(`${API_URL}/admin/articles/${id}/graphical-abstract`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Upload failed (${res.status})`);
      }
      const json = await res.json();
      const url = json.data?.graphical_abstract_url;
      if (url) setField('graphical_abstract_url', url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      // Send only fields, coercing empty strings to null (except title).
      const payload: Record<string, unknown> = {};
      for (const key of ALL_KEYS) {
        const raw = form[key] ?? '';
        payload[key] = raw === '' ? (key === 'title' ? '' : null) : raw;
      }
      const res = await authFetch(`${API_URL}/admin/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (res.status === 403) throw new Error('You do not have permission to edit articles.');
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Save failed (${res.status})`);
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const authorNames = (article?.authors ?? [])
    .map((a) => a.name || `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim())
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link href="/admin/articles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0f2d6b] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Article</h1>
      <p className="text-sm text-gray-500 mb-6">
        {article?.title ? article.title : `Article ${id}`}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : article ? (
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((f) => (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        rows={f.key === 'abstract' ? 6 : 3}
                        value={form[f.key] ?? ''}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={form[f.key] ?? ''}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                      >
                        <option value="">—</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                        value={form[f.key] ?? ''}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                      />
                    )}
                    {IMAGE_KEYS.has(f.key) && (
                      <>
                        {form[f.key] ? (
                          failedSrc.has(form[f.key]) ? (
                            <p className="mt-2 text-xs text-amber-600">
                              Couldn&apos;t load this image.{' '}
                              <a href={form[f.key]} target="_blank" rel="noopener noreferrer" className="underline break-all">
                                Open the URL
                              </a>{' '}
                              — if it 404s, run <code>php artisan storage:link</code> on the server and check <code>APP_URL</code>.
                            </p>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={form[f.key]}
                              src={form[f.key]}
                              alt={f.label}
                              className="mt-2 max-h-48 w-auto rounded-lg border border-gray-200 object-contain bg-gray-50"
                              onError={() => setFailedSrc((s) => new Set(s).add(form[f.key]))}
                            />
                          )
                        ) : (
                          <p className="mt-2 text-xs text-gray-400">No image set.</p>
                        )}
                        {f.key === 'graphical_abstract_url' && (
                          <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0f2d6b] border border-[#0f2d6b]/30 rounded-lg cursor-pointer hover:bg-[#f0f4fb]">
                            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                            {uploading ? 'Uploading…' : 'Upload image'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              disabled={uploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) uploadGraphicalAbstract(file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        )}
                        {f.key === 'graphical_abstract_url' && (
                          <p className="mt-1 text-xs text-gray-400">JPG, PNG or WebP · max 5 MB · 1200×900 recommended. Upload sets the URL automatically.</p>
                        )}
                      </>
                    )}
                    {f.key === 'pdf_url' && form[f.key] && (
                      <a href={form[f.key]} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-[#0f2d6b] hover:underline">
                        Open current PDF ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Authors (read-only for now) */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Authors</h2>
            <p className="text-sm text-gray-600">
              {authorNames.length ? authorNames.join(', ') : 'No linked authors.'}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Author list editing is managed separately; contact the developer to enable inline author editing.
            </p>
          </div>

          {/* Sticky save bar */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-200 py-4 flex items-center justify-end gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                <Check className="w-4 h-4" /> Saved
              </span>
            )}
            <button
              onClick={() => router.push('/admin/articles')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save changes
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
