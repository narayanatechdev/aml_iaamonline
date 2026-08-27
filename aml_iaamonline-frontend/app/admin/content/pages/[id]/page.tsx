'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';
import { sanitizePageHtml } from '@/lib/rich-text';
import { PAGE_LAYOUTS, parsePageContent } from '@/lib/page-layouts';
import { StructuredContentEditor } from '@/components/admin/structured-content-editor';
import { RichPageEditor } from '@/components/admin/rich-page-editor';

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  layout: string;
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
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
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
        layout: page.layout,
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
    <div className="min-h-full max-w-7xl">
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          {/* Main column: content editor — structured form for designed layouts, HTML for prose */}
          <div className="min-w-0">
          {/* content editor */}
          {PAGE_LAYOUTS[page.layout] ? (
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Page Sections
                </h2>
                <p className="text-xs text-blue-800 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                  Powers <span className="font-mono">{PAGE_LAYOUTS[page.layout].route}</span> — fields
                  left empty keep the text built into the design.
                </p>
              </div>
              <StructuredContentEditor
                layout={PAGE_LAYOUTS[page.layout]}
                value={parsePageContent(page.content)}
                onChange={(data) => setPage({ ...page, content: JSON.stringify(data) })}
              />
            </div>
          ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Content
              </h2>
              <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                {(['visual', 'html'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setEditorMode(mode)}
                    className={`px-3 py-1.5 font-medium transition-colors ${
                      editorMode === mode
                        ? 'bg-[#0f2d6b] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {mode === 'visual' ? 'Visual' : 'HTML'}
                  </button>
                ))}
              </div>
            </div>

            {editorMode === 'visual' ? (
              <RichPageEditor
                value={page.content ?? ''}
                onChange={(html) => setPage({ ...page, content: html })}
              />
            ) : (
            <>
            <div>
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
                  .page-preview ul { list-style-type: disc; }
                  .page-preview ol { list-style-type: decimal; }
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
            </>
            )}
          </div>
          )}
          </div>

          {/* Right sidebar: page settings (WordPress-style) */}
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-[#f7f9fd] to-white border-b border-gray-100">
                <h2
                  className="text-lg font-bold text-[#0f2d6b] tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Page Settings
                </h2>
              </div>
              <div className="p-5 space-y-5">
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
                    {PAGE_LAYOUTS[page.layout]
                      ? `This page powers ${PAGE_LAYOUTS[page.layout].route} (designed layout)`
                      : `Public URL will be: /page/${page.slug}`}
                  </p>
                </div>
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
                <label className="flex items-center gap-3 cursor-pointer border-t border-gray-100 pt-4">
                  <input
                    type="checkbox"
                    checked={page.is_published}
                    onChange={(e) => setPage({ ...page, is_published: e.target.checked })}
                    className="w-4 h-4 accent-[#0f2d6b]"
                  />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                <p className="text-xs text-gray-400 -mt-3">Unpublished pages are hidden from visitors.</p>
                <button
                  onClick={save}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save changes
                </button>
              </div>
            </div>
          </aside>
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
