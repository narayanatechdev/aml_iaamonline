'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';
import { sanitizePageHtml } from '@/lib/rich-text';

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  placement: 'header' | 'footer' | 'none';
  position: number;
  is_published: boolean;
  updated_at: string;
}

type Placement = 'header' | 'footer' | 'none';

export default function AdminPageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const showToast = (type: ToastType, message: string) =>
    setToast({ type, message, isVisible: true });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/pages/${id}`);
      if (!res.ok) throw new Error(`Failed to load page (${res.status})`);
      const json = await res.json();
      setPage(json.data);
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const body = {
        title: page.title,
        slug: page.slug,
        content: page.content,
        placement: page.placement,
        position: page.position,
        is_published: page.is_published,
      };
      const res = await authFetch(`${API_BASE}/admin/pages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Save failed (${res.status})`);
      }
      const json = await res.json();
      setPage(json.data);
      showToast('success', 'Page saved.');
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]';

  return (
    <div className="min-h-full max-w-5xl">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Content' },
          { label: 'Pages', href: '/admin/content/pages' },
          { label: page?.title ?? 'Edit Page' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/pages"
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{page?.title ?? 'Edit Page'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Edit content and settings for this page.</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving || !page}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-16">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : !page ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          Page not found or failed to load.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Basic fields */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className={input}
                placeholder="Page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                className={input + ' font-mono'}
                placeholder="page-slug"
              />
              <p className="text-xs text-gray-400 mt-1">
                Public URL will be: /page/{page.slug}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Placement</label>
                <select
                  value={page.placement}
                  onChange={(e) => setPage({ ...page, placement: e.target.value as Placement })}
                  className={input}
                >
                  <option value="header">Header navigation</option>
                  <option value="footer">Footer</option>
                  <option value="none">Not linked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                <input
                  type="number"
                  min={0}
                  value={page.position}
                  onChange={(e) =>
                    setPage({ ...page, position: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className={input}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={page.is_published}
                onChange={(e) => setPage({ ...page, is_published: e.target.checked })}
                className="w-4 h-4 accent-[#0f2d6b]"
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
              <span className="text-xs text-gray-400">(unpublished pages are hidden from visitors)</span>
            </label>
          </div>

          {/* Content editor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content (HTML)
              </label>
              <textarea
                value={page.content ?? ''}
                onChange={(e) => setPage({ ...page, content: e.target.value })}
                className={
                  input +
                  ' font-mono text-xs min-h-[300px] resize-y leading-relaxed'
                }
                placeholder="<h2>Section heading</h2><p>Body text…</p>"
                spellCheck={false}
              />
            </div>

            {/* Live preview */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 min-h-[120px]">
                <style>{`
                  .page-preview h2 { font-size: 1.25rem; font-weight: 700; color: #0f2d6b; margin: 1rem 0 0.5rem; }
                  .page-preview h3 { font-size: 1.1rem; font-weight: 600; color: #0f2d6b; margin: 0.75rem 0 0.4rem; }
                  .page-preview h4 { font-size: 1rem; font-weight: 600; color: #3a4a6a; margin: 0.75rem 0 0.4rem; }
                  .page-preview p  { color: #3a4a6a; line-height: 1.7; margin: 0.5rem 0; font-size: 0.9rem; }
                  .page-preview ul, .page-preview ol { color: #3a4a6a; padding-left: 1.25rem; margin: 0.5rem 0; font-size: 0.9rem; }
                  .page-preview li { margin: 0.2rem 0; line-height: 1.6; }
                  .page-preview a  { color: #0f2d6b; text-decoration: underline; }
                  .page-preview blockquote { border-left: 3px solid #c9a227; padding-left: 0.75rem; margin: 0.75rem 0; color: #5a6a8a; font-style: italic; font-size: 0.9rem; }
                  .page-preview hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
                  .page-preview table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.85rem; }
                  .page-preview th, .page-preview td { border: 1px solid #e5e7eb; padding: 0.4rem 0.6rem; color: #3a4a6a; }
                  .page-preview th { background: #f9fafb; font-weight: 600; color: #0f2d6b; }
                `}</style>
                <div
                  className="page-preview"
                  dangerouslySetInnerHTML={{ __html: sanitizePageHtml(page.content ?? '') }}
                />
              </div>
            </div>
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
