'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Loader2, Trash2, Calendar, Globe, User,
  BookOpen, ExternalLink, Star, ChevronDown, ChevronUp,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { UserForm, UserFormData, Role } from '@/components/forms/UserForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { SimpleToast, ToastType } from '@/components/ui/Toast';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface UserDetails extends UserFormData {
  created_at: string;
  last_login: string | null;
  last_login_ip: string | null;
  orcid: string | null;
  affiliation: string | null;
  country: string | null;
  city: string | null;
  degree: string | null;
  position: string | null;
  is_reviewer: boolean;
  join_date: string | null;
  article_count: number;
  author_id: number | null;
  is_admin: boolean;
  verified?: boolean;
}

interface Article {
  id: number;
  legacy_id: string;
  title: string;
  document_type: string;
  subject: string;
  doi: string;
  volume: string;
  issue: string;
  pages_from: number | null;
  pages_to: number | null;
  publish_year: number;
  publish_date: string | null;
  views_count: number;
  pdf_downloads: number;
  pdf_url: string | null;
  graphical_abstract_url: string | null;
  is_corresponding: boolean;
  author_position: number;
}

interface ArticlesMeta {
  total: number;
  author_id: number | null;
  author_linked: boolean;
  author_name?: string;
}

export default function EditUserPage() {
  const router   = useRouter();
  const params   = useParams();
  const userId   = params.id as string;

  const [user, setUser]             = useState<UserDetails | null>(null);
  const [roles, setRoles]           = useState<Role[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Articles state
  const [articles, setArticles]         = useState<Article[]>([]);
  const [articlesMeta, setArticlesMeta] = useState<ArticlesMeta | null>(null);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [showArticles, setShowArticles] = useState(true);

  // Dialog / toast
  const [deleteDialog, setDeleteDialog]   = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string; isVisible: boolean }>({
    type: 'success', message: '', isVisible: false,
  });
  const showToast = (type: ToastType, message: string) =>
    setToast({ type, message, isVisible: true });

  const userFormInitialData = useMemo(() => {
    if (!user) return undefined;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status ?? 'active',
      roles: Array.isArray(user.roles) ? user.roles : [],
    };
  }, [user]);

  // ── Fetch user + roles ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userRes, rolesRes] = await Promise.all([
        authFetch(`${API_BASE}/admin/users/${userId}`),
        authFetch(`${API_BASE}/admin/roles`),
      ]);
      if (!userRes.ok)  throw new Error('Failed to fetch user');
      if (!rolesRes.ok) throw new Error('Failed to fetch roles');

      const userData  = await userRes.json();
      const rolesData = await rolesRes.json();
      setUser(userData.data || userData);
      setRoles(rolesData.data || rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ── Fetch articles for this user ───────────────────────────
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const res  = await authFetch(`${API_BASE}/admin/users/${userId}/articles`);
      const data = await res.json();
      setArticles(data.data ?? []);
      setArticlesMeta(data.meta ?? null);
    } catch {
      // non-fatal — just show empty state
      setArticles([]);
    } finally {
      setArticlesLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  // ── Submit (update user) ───────────────────────────────────
  const handleSubmit = async (data: {
    name: string; email: string; status: 'active' | 'inactive'; roles: string[];
  }) => {
    setIsSubmitting(true);
    try {
      const userRes = await authFetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });
      if (!userRes.ok) {
        const err = await userRes.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update user');
      }

      const rolesRes = await authFetch(`${API_BASE}/admin/users/${userId}/roles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: data.roles }),
      });
      if (!rolesRes.ok) {
        const err = await rolesRes.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update user roles');
      }

      await userRes.json();
      await rolesRes.json();
      await fetchData();
      showToast('success', 'User updated successfully!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete user ────────────────────────────────────────────
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      showToast('success', 'User deleted successfully!');
      setTimeout(() => router.push('/admin/users'), 1500);
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Never';

  // ── Loading / error states ─────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" />
      </div>
    );
  }
  if (error || !user) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb items={[{ label: 'Users', href: '/admin/users' }, { label: 'Edit User' }]} />
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading User</h2>
          <p className="text-sm text-red-600 mb-4">{error || 'User not found'}</p>
          <div className="flex gap-3">
            <button onClick={fetchData}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
              Try Again
            </button>
            <button onClick={() => router.push('/admin/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Registered Authors', href: '/admin/users' },
        { label: user.name },
      ]} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
            user.is_admin ? 'bg-red-100 text-red-700' : 'bg-[#0f2d6b]/10 text-[#0f2d6b]'
          }`}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {user.is_admin && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700">Admin</span>
              )}
              {user.is_reviewer && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Reviewer
                </span>
              )}
              {user.orcid && (
                <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-emerald-100 text-emerald-700">
                  ORCID: {user.orcid}
                </span>
              )}
              {user.article_count > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {user.article_count} articles
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Edit form ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Account Details</h2>
            <UserForm
              initialData={userFormInitialData}
              roles={roles}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel="Save Changes"
            />
          </div>

          {/* ── Articles panel ─────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowArticles(p => !p)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#0f2d6b]" />
                <span className="text-base font-semibold text-gray-900">
                  Published Articles
                </span>
                {articlesMeta && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#0f2d6b]/10 text-[#0f2d6b]">
                    {articlesMeta.total}
                  </span>
                )}
              </div>
              {showArticles
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {showArticles && (
              <div className="border-t border-gray-200">
                {articlesLoading ? (
                  <div className="px-6 py-8 flex items-center justify-center gap-2 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading articles…</span>
                  </div>
                ) : !articlesMeta?.author_linked ? (
                  <div className="px-6 py-10 text-center">
                    <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-sm">No linked author profile</p>
                    <p className="text-gray-400 text-xs mt-1">
                      This user hasn't been linked to an author record yet.
                    </p>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-sm">No articles found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {articles.map(art => (
                      <div key={art.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm leading-snug">{art.title}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className="text-xs text-gray-400">
                                Vol.{art.volume} Issue {art.issue}
                                {art.pages_from && ` · pp. ${art.pages_from}–${art.pages_to}`}
                                {art.publish_year && ` · ${art.publish_year}`}
                              </span>
                              {art.is_corresponding && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#c9a227]/20 text-[#7a5f00]">
                                  Corresponding
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 text-gray-500">
                                {art.document_type}
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-50 text-blue-600">
                                {art.subject}
                              </span>
                            </div>
                            <div className="flex gap-4 mt-1.5 text-xs text-gray-400">
                              <span>{art.views_count.toLocaleString()} views</span>
                              <span>{art.pdf_downloads.toLocaleString()} downloads</span>
                              {art.doi && <span className="font-mono truncate max-w-[200px]">{art.doi}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {art.pdf_url && (
                              <a href={art.pdf_url} target="_blank" rel="noopener noreferrer"
                                className="p-1.5 text-[#0f2d6b] hover:bg-[#0f2d6b]/10 rounded-lg transition-colors"
                                title="Open PDF">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right sidebar ──────────────────────────────── */}
        <div className="space-y-4">
          {/* Author profile card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Author Profile</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'User ID',     value: `#${user.id}` },
                { label: 'Degree',      value: user.degree },
                { label: 'Position',    value: user.position },
                { label: 'Affiliation', value: user.affiliation },
                { label: 'Country',     value: user.country },
                { label: 'City',        value: user.city },
                { label: 'ORCID',       value: user.orcid },
                { label: 'Joined',      value: fmt(user.join_date || user.created_at) },
                { label: 'Verified',    value: user.verified ? 'Yes' : 'No' },
              ].map(row => row.value ? (
                <div key={row.label} className="flex gap-2">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5">{row.label}</span>
                  <span className="text-xs text-gray-800 font-medium break-all">{row.value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Author link card */}
          {user.author_id && (
            <div className="bg-[#0f2d6b]/5 rounded-xl border border-[#0f2d6b]/20 p-4">
              <h3 className="text-sm font-semibold text-[#0f2d6b] mb-2">Linked Author Record</h3>
              <p className="text-xs text-gray-600 mb-3">
                Author profile #{user.author_id} — {user.article_count} published articles
              </p>
              <button
                onClick={() => router.push('/admin/authors')}
                className="text-xs font-medium text-[#0f2d6b] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> View in Authors
              </button>
            </div>
          )}

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-200 p-4">
            <h3 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h3>
            <p className="text-xs text-gray-500 mb-4">
              Permanently removes this account and all associated data.
            </p>
            <button
              onClick={() => setDeleteDialog(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete User
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
        confirmText="Delete" cancelText="Cancel"
        isDangerous isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
      />

      <SimpleToast
        type={toast.type} message={toast.message} isVisible={toast.isVisible}
        onClose={() => setToast(p => ({ ...p, isVisible: false }))}
      />
    </div>
  );
}
