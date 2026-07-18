'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Pencil,
  X,
  Check,
  Loader2,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { authFetch, API_BASE, getToken } from '@/lib/adminAuth';
import { BLOCK_CATALOGUE, getBlockMeta } from '@/components/homepage/block-registry';
import { ON_THE_COVER_DEFAULTS } from '@/components/homepage/on-the-cover';
import { FEATURED_ARTICLES } from '@/lib/realData';

interface Section {
  id: number;
  block_type: string;
  name: string | null;
  position: number;
  is_visible: boolean;
  content: Record<string, unknown>;
}

const API_URL = API_BASE;

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const json = await res.json();
      setSections(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistOrder = async (ordered: Section[]) => {
    setSavingOrder(true);
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections/reorder`, {
        method: 'POST',
        body: JSON.stringify({ order: ordered.map((s) => s.id) }),
      });
      if (!res.ok) throw new Error('Reorder failed');
      const json = await res.json();
      setSections(json.data ?? ordered);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Reorder failed');
      load();
    } finally {
      setSavingOrder(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    persistOrder(next);
  };

  const toggleVisible = async (s: Section) => {
    setBusyId(s.id);
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections/${s.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_visible: !s.is_visible }),
      });
      if (!res.ok) throw new Error('Update failed');
      const json = await res.json();
      setSections((prev) => prev.map((p) => (p.id === s.id ? json.data : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const duplicate = async (s: Section) => {
    setBusyId(s.id);
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections/${s.id}/duplicate`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Duplicate failed');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Duplicate failed');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (s: Section) => {
    if (!confirm(`Delete "${s.name || getBlockMeta(s.block_type)?.label || s.block_type}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(s.id);
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections/${s.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSections((prev) => prev.filter((p) => p.id !== s.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusyId(null);
    }
  };

  const addBlock = async (blockType: string) => {
    try {
      const meta = getBlockMeta(blockType);
      const res = await authFetch(`${API_URL}/admin/home/sections`, {
        method: 'POST',
        body: JSON.stringify({ block_type: blockType, name: meta?.label ?? blockType }),
      });
      if (!res.ok) throw new Error('Add failed');
      setShowAdd(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add failed');
    }
  };

  const saveEdit = async (updated: Section) => {
    try {
      const res = await authFetch(`${API_URL}/admin/home/sections/${updated.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: updated.name, content: updated.content }),
      });
      if (!res.ok) throw new Error('Save failed');
      const json = await res.json();
      setSections((prev) => prev.map((p) => (p.id === updated.id ? json.data : p)));
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Builder</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add, reorder, show/hide and edit the sections shown on the public homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4" /> View site
          </a>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]"
          >
            <Plus className="w-4 h-4" /> Add block
          </button>
        </div>
      </div>

      {savingOrder && (
        <div className="mb-3 text-xs text-gray-500 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving order…
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-3">No sections yet.</p>
          <button onClick={() => setShowAdd(true)} className="text-[#0f2d6b] font-medium hover:underline">
            Add your first block
          </button>
        </div>
      ) : (
        <ul className="space-y-2">
          {sections.map((s, i) => {
            const meta = getBlockMeta(s.block_type);
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${
                  s.is_visible ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-70'
                }`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === sections.length - 1}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {s.name || meta?.label || s.block_type}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {meta?.label ?? s.block_type}
                    {!s.is_visible && ' · hidden'}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {meta?.editable && (
                    <button
                      onClick={() => setEditing(s)}
                      className="p-2 text-gray-500 hover:text-[#0f2d6b] hover:bg-gray-100 rounded-lg"
                      title="Edit content"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => toggleVisible(s)}
                    disabled={busyId === s.id}
                    className="p-2 text-gray-500 hover:text-[#0f2d6b] hover:bg-gray-100 rounded-lg"
                    title={s.is_visible ? 'Hide' : 'Show'}
                  >
                    {s.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => duplicate(s)}
                    disabled={busyId === s.id}
                    className="p-2 text-gray-500 hover:text-[#0f2d6b] hover:bg-gray-100 rounded-lg"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => remove(s)}
                    disabled={busyId === s.id}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showAdd && <AddBlockModal onClose={() => setShowAdd(false)} onPick={addBlock} />}
      {editing && (
        <EditBlockModal section={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}
    </div>
  );
}

function AddBlockModal({ onClose, onPick }: { onClose: () => void; onPick: (t: string) => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add a block</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BLOCK_CATALOGUE.map((b) => (
            <button
              key={b.type}
              onClick={() => onPick(b.type)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-[#0f2d6b] hover:bg-gray-50 transition-colors"
            >
              <div className="text-sm font-semibold text-gray-900">{b.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{b.description}</div>
              {b.editable && (
                <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-100 text-green-700">
                  Editable
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Content fields per editable block type. */
type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'image';
  options?: { value: string; label: string }[];
  help?: string;
};

const CONTENT_FIELDS: Record<string, FieldDef[]> = {
  on_the_cover: [
    { key: 'imageUrl', label: 'Cover image', type: 'image', help: 'Portrait 3:4 (e.g. 600×800). JPG, PNG or WebP, max 5 MB.' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'volume', label: 'Volume', type: 'text' },
    { key: 'issue', label: 'Issue', type: 'text' },
    { key: 'year', label: 'Year', type: 'text' },
  ],
  featured_hero: [
    {
      key: 'mode',
      label: 'Which article to feature',
      type: 'select',
      options: [
        { value: 'auto', label: 'Automatic — latest published article' },
        { value: 'article', label: 'Pick a specific article' },
      ],
      help: 'Choose "Pick a specific article" to search and select the article shown in the hero.',
    },
  ],
  featured_articles: [{ key: 'heading', label: 'Section heading', type: 'text' }],
  announcements: [{ key: 'heading', label: 'Section heading', type: 'text' }],
  rich_text: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'body', label: 'Body text', type: 'textarea' },
  ],
  image_banner: [
    { key: 'imageUrl', label: 'Image URL (1600×600 recommended)', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'ctaLabel', label: 'Button label', type: 'text' },
    { key: 'ctaHref', label: 'Button link', type: 'text' },
  ],
};

/**
 * What each block renders when a content field is empty. Used to prefill the
 * edit form so admins see (and can tweak) the live values instead of blanks.
 */
const CONTENT_DEFAULTS: Record<string, Record<string, unknown>> = {
  on_the_cover: ON_THE_COVER_DEFAULTS,
};

function EditBlockModal({
  section,
  onClose,
  onSave,
}: {
  section: Section;
  onClose: () => void;
  onSave: (s: Section) => void;
}) {
  const [name, setName] = useState(section.name ?? '');
  const [content, setContent] = useState<Record<string, unknown>>(() => {
    // Saved values win; defaults fill the gaps so the form mirrors the live site.
    const merged: Record<string, unknown> = { ...(CONTENT_DEFAULTS[section.block_type] ?? {}) };
    for (const [k, v] of Object.entries(section.content ?? {})) {
      if (!(typeof v === 'string' && v.trim() === '')) merged[k] = v;
    }
    return merged;
  });
  const [saving, setSaving] = useState(false);
  const fields = CONTENT_FIELDS[section.block_type] ?? [];

  const submit = async () => {
    setSaving(true);
    await onSave({ ...section, name, content });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit: {getBlockMeta(section.block_type)?.label ?? section.block_type}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internal label</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
            />
          </div>
          {fields.length === 0 && (
            <p className="text-sm text-gray-500">This block has no editable content fields.</p>
          )}
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'image' ? (
                <ImageField
                  value={(content[f.key] as string) ?? ''}
                  onChange={(url) => setContent((c) => ({ ...c, [f.key]: url }))}
                />
              ) : f.type === 'select' ? (
                <select
                  value={(content[f.key] as string) ?? f.options?.[0]?.value ?? ''}
                  onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={(content[f.key] as string) ?? ''}
                  onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                />
              ) : (
                <input
                  value={(content[f.key] as string) ?? ''}
                  onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                />
              )}
              {f.help && <p className="mt-1 text-xs text-gray-400">{f.help}</p>}
            </div>
          ))}

          {section.block_type === 'featured_hero' && content.mode === 'article' && (
            <ArticlePicker
              value={content.articleId as string | undefined}
              onChange={(id) => setContent((c) => ({ ...c, articleId: id }))}
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/** Searchable picker over the article catalogue; stores the selected article id. */
function ArticlePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState('');

  const selected = value ? FEATURED_ARTICLES.find((a) => String(a.id) === String(value)) : undefined;

  const q = query.trim().toLowerCase();
  const results = q
    ? FEATURED_ARTICLES.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          String(a.id) === q ||
          String(a.year).includes(q)
      ).slice(0, 25)
    : [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>

      {selected && (
        <div className="mb-2 p-2 rounded-lg bg-[#f0f4fb] border border-[#0f2d6b]/20">
          <div className="text-sm font-semibold text-[#0f2d6b] line-clamp-2">{selected.title}</div>
          <div className="text-xs text-gray-500">
            Vol {selected.volume}, Issue {selected.issue} · {selected.year} · id {selected.id}
          </div>
        </div>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, year, or id…"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
      />

      {q && (
        <ul className="mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
          {results.length === 0 && (
            <li className="p-3 text-sm text-gray-400">No matching articles.</li>
          )}
          {results.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  onChange(String(a.id));
                  setQuery('');
                }}
                className="w-full text-left p-2 hover:bg-gray-50"
              >
                <div className="text-sm text-gray-900 line-clamp-2">{a.title}</div>
                <div className="text-xs text-gray-400">
                  Vol {a.volume}, Issue {a.issue} · {a.year}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Image URL field with live preview and direct upload. */
function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const token = getToken();
      const res = await fetch(`${API_URL}/admin/home/upload-image`, {
        method: 'POST',
        headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Upload failed (${res.status})`);
      }
      const json = await res.json();
      const url = json.data?.url;
      if (url) onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL, or upload below"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
      />
      {value && (
        failed === value ? (
          <p className="mt-2 text-xs text-amber-600">Couldn&apos;t load this image URL.</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={value}
            src={value}
            alt="Preview"
            className="mt-2 max-h-40 w-auto rounded-lg border border-gray-200 object-contain bg-gray-50"
            onError={() => setFailed(value)}
          />
        )
      )}
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
            if (file) upload(file);
            e.target.value = '';
          }}
        />
      </label>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
