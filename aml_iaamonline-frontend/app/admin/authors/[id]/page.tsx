'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Award, Globe, BookOpen, Eye, Download, Quote,
  FileText, Loader2, ExternalLink,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface AuthorDetail {
  author: {
    id: number;
    name: string;
    email?: string | null;
    orcid?: string | null;
    affiliation?: string | null;
    country?: string | null;
    city?: string | null;
    degree?: string | null;
  };
  articles: Array<{
    id: number;
    title: string;
    document_type?: string | null;
    doi?: string | null;
    volume?: number | string | null;
    issue?: number | string | null;
    publish_year?: number | null;
    views_count?: number;
    pdf_downloads?: number;
    cited_count?: number;
  }>;
  metrics: { article_count: number; total_views: number; total_downloads: number; total_citations: number };
  submissions?: Array<{
    id: number;
    submission_id: string;
    title: string;
    category: string | null;
    status: string;
    submitted_at: string | null;
  }>;
}

const STATUS_COLOR: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-amber-100 text-amber-800',
  with_editor: 'bg-purple-100 text-purple-800',
  decision: 'bg-purple-100 text-purple-800',
  revision_required: 'bg-orange-100 text-orange-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  published: 'bg-teal-100 text-teal-800',
};

function fmtDate(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminAuthorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<AuthorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/authors/${id}`);
      if (!res.ok) throw new Error('Could not load this author.');
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#0f2d6b] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full">
        <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Authors', href: '/admin/authors' }, { label: 'Author' }]} />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-sm text-red-600 mb-3">{error ?? 'Author not found.'}</p>
          <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">Retry</button>
        </div>
      </div>
    );
  }

  const { author, articles, metrics, submissions } = data;
  const initials = author.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const location = [author.city, author.country].filter(Boolean).join(', ');

  const metricCards = [
    { label: 'Articles', value: metrics.article_count, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Views', value: metrics.total_views, icon: <Eye className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Downloads', value: metrics.total_downloads, icon: <Download className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Citations', value: metrics.total_citations, icon: <Quote className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Authors', href: '/admin/authors' }, { label: author.name }]} />

      <button onClick={() => router.push('/admin/authors')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0f2d6b] mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to authors
      </button>

      {/* About this author */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f2d6b] to-[#c9a227] text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{author.name}{author.degree ? <span className="text-base font-normal text-gray-400">, {author.degree}</span> : null}</h1>
            {author.affiliation && <p className="text-sm text-gray-600 mt-1">{author.affiliation}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {location && <span className="inline-flex items-center gap-1.5 text-xs text-gray-500"><Globe className="w-3.5 h-3.5" />{location}</span>}
              {author.email && <a href={`mailto:${author.email}`} className="inline-flex items-center gap-1.5 text-xs text-[#0f2d6b] hover:underline"><Mail className="w-3.5 h-3.5" />{author.email}</a>}
              {author.orcid && <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#0f2d6b] hover:underline"><Award className="w-3.5 h-3.5" />ORCID</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.color} mb-3`}>{c.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{c.value.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Submission tracking (staff-only; present when token is admin/editor) */}
      {submissions && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Submission Tracking</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manuscripts submitted from this author&apos;s email</p>
          </div>
          {submissions.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No submissions from this author yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Manuscript</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{s.submission_id}</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{s.title}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status] ?? 'bg-gray-100 text-gray-700'}`}>{s.status.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{fmtDate(s.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Published articles */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Published Articles ({articles.length})</h2>
        </div>
        {articles.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No published articles on record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden md:table-cell">Year</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Vol/Issue</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Views</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3 hidden xl:table-cell">Cites</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-lg group-hover:text-[#0f2d6b] transition-colors">{a.title}</p>
                      {a.document_type && <p className="text-xs text-gray-400 mt-0.5">{a.document_type}</p>}
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-sm text-gray-600">{a.publish_year ?? '—'}</td>
                    <td className="px-3 py-3 hidden lg:table-cell text-xs text-gray-500">
                      {a.volume != null ? `Vol.${a.volume}${a.issue != null ? ` Iss.${a.issue}` : ''}` : '—'}
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-right text-xs text-gray-600">{(a.views_count ?? 0).toLocaleString()}</td>
                    <td className="px-3 py-3 hidden xl:table-cell text-right text-xs text-gray-600">{(a.cited_count ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/article/${a.id}`} className="text-[#0f2d6b]/50 hover:text-[#0f2d6b] transition-colors"><ExternalLink className="w-3.5 h-3.5 inline" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
