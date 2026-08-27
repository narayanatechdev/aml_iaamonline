'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface Page {
  id: number;
  title: string;
  slug: string;
  layout: string;
  placement: 'header' | 'footer' | 'none';
  position: number;
  is_published: boolean;
  updated_at: string;
}

const PLACEMENT_LABELS: Record<string, string> = {
  header: 'Header nav',
  footer: 'Footer',
  none: 'Not linked',
};

const PLACEMENT_COLORS: Record<string, string> = {
  header: 'bg-blue-100 text-blue-800',
  footer: 'bg-purple-100 text-purple-800',
  none: 'bg-gray-100 text-gray-600',
};

export default function AdminPagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showNew, setShowNew] = useState(false);
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
      const res = await authFetch(`${API_BASE}/admin/pages`);
      if (!res.ok) throw new Error(`Failed to load pages (${res.status})`);
      const json = await res.json();
      setPages(json.data ?? []);
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createPage = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/pages`, {
        method: 'POST',
        body: JSON.stringify({ title: newTitle.trim(), placement: 'none', is_published: false }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Create failed (${res.status})`);
      }
      const json = await res.json();
      const created: Page = json.data;
      setNewTitle('');
      setShowNew(false);
      router.push(`/admin/content/pages/${created.id}`);
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  const deletePage = async (id: number, title: string) => {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    try {
      const res = await authFetch(`${API_BASE}/admin/pages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setPages((prev) => prev.filter((p) => p.id !== id));
      showToast('success', 'Page deleted.');
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Delete failed');
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
          { label: 'Pages' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage journal information pages and their nav placement.
          </p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Create new page</h2>
          <div className="flex gap-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createPage()}
              placeholder="Page title…"
              className={input}
              autoFocus
            />
            <button
              onClick={createPage}
              disabled={creating || !newTitle.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f2d6b] text-white text-sm font-medium hover:bg-[#0d2560] disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create & edit
            </button>
            <button
              onClick={() => { setShowNew(false); setNewTitle(''); }}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-16">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : pages.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No pages yet. Create one above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Placement</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3 font-medium w-24"></th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {page.title}
                      {page.layout && page.layout !== 'prose' && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold uppercase tracking-wide">
                          Designed layout
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{page.slug}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          PLACEMENT_COLORS[page.placement] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {PLACEMENT_LABELS[page.placement] ?? page.placement}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          page.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/content/pages/${page.id}`}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#0f2d6b] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePage(page.id, page.title)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SimpleToast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </div>
  );
}
