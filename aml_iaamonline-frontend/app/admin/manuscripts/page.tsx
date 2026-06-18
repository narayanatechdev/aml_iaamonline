'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Send, Search, ClipboardCheck, CheckCircle,
  PlusCircle, ArrowRight, BookOpen,
  BarChart3, Users, RefreshCw, Inbox, RotateCcw, ChevronRight,
} from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface EditorStats {
  total_manuscripts?: number;
  new_triage?: number;
  under_review?: number;
  pending_decision?: number;
  in_revision?: number;
  accepted?: number;
  rejected?: number;
}

interface Manuscript {
  id: number;
  title: string;
  status: string;
  submitted_at: string;
  authors?: string;
  category?: string;
  division?: string;
  reviewers_total?: number;
  reviews_completed?: number;
}

// Statuses that require the editor's attention on the dashboard queue
const ATTENTION_STATUSES = ['decision', 'with_editor', 'submitted', 'revision_required'];

const WORKFLOW_STAGES = [
  {
    id: 'submitted',
    label: 'Submitted',
    icon: <Send className="w-5 h-5" />,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    description: 'New manuscripts awaiting initial editorial check',
  },
  {
    id: 'under_review',
    label: 'Under Review',
    icon: <Search className="w-5 h-5" />,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    description: 'Assigned to peer reviewers for evaluation',
  },
  {
    id: 'decision',
    label: 'Decision',
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    description: 'Editor reviewing reviewer reports and making decisions',
  },
  {
    id: 'published',
    label: 'Published',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    description: 'Accepted and published in the journal',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'Under Review', color: 'bg-amber-100 text-amber-800' },
  with_editor: { label: 'With Editor', color: 'bg-purple-100 text-purple-800' },
  decision: { label: 'Decision Due', color: 'bg-purple-100 text-purple-800' },
  revision_required: { label: 'Revision Required', color: 'bg-orange-100 text-orange-800' },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  published: { label: 'Published', color: 'bg-teal-100 text-teal-800' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ManuscriptsPage() {
  const [editorStats, setEditorStats] = useState<EditorStats | null>(null);
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [editors, setEditors] = useState<{ id: number; name: string; email: string }[]>([]);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, msRes, edRes] = await Promise.allSettled([
        authFetch(`${API_BASE}/editor/stats`),
        authFetch(`${API_BASE}/editor/manuscripts?per_page=50`),
        authFetch(`${API_BASE}/admin/editors`),
      ]);
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const json = await statsRes.value.json();
        setEditorStats(json.data ?? json); // endpoint returns { success, data }
        setHasData(true);
      }
      if (msRes.status === 'fulfilled' && msRes.value.ok) {
        const data = await msRes.value.json();
        const items = data.data || data.manuscripts || data || [];
        setManuscripts(items);
        if (items.length > 0) setHasData(true);
      }
      if (edRes.status === 'fulfilled' && edRes.value.ok) {
        const data = await edRes.value.json();
        setEditors(data.data ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch manuscript data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignEditor = async (manuscriptId: number, editorId: string) => {
    if (!editorId) return;
    setAssigningId(manuscriptId);
    try {
      const res = await authFetch(`${API_BASE}/managing-editor/assign-editor/${manuscriptId}`, {
        method: 'POST',
        body: JSON.stringify({ editor_id: Number(editorId) }),
      });
      if (res.ok) await fetchData();
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    { label: 'New / Triage', value: editorStats?.new_triage ?? 0, icon: <Inbox className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Under Review', value: editorStats?.under_review ?? 0, icon: <Search className="w-5 h-5" />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Decision Due', value: editorStats?.pending_decision ?? 0, icon: <ClipboardCheck className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50' },
    { label: 'In Revision', value: editorStats?.in_revision ?? 0, icon: <RotateCcw className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50' },
    { label: 'Accepted', value: editorStats?.accepted ?? 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
  ];

  // Manuscripts that need the editor's attention now
  const attentionList = manuscripts.filter((m) => ATTENTION_STATUSES.includes(m.status));

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Manuscripts' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manuscripts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Editorial workflow management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c] transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4" />
          New Submission
        </button>
      </div>

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : hasData ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`}>
                {card.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Workflow visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
      >
        <h2 className="text-base font-semibold text-gray-900 mb-6">Editorial Workflow</h2>
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-amber-200 via-purple-200 to-green-200 hidden md:block" style={{ zIndex: 0 }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {WORKFLOW_STAGES.map((stage, idx) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`flex flex-col items-center text-center p-4 rounded-xl border ${stage.borderColor} ${stage.lightColor}`}
              >
                <div className={`w-16 h-16 rounded-2xl ${stage.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                  {stage.icon}
                </div>
                <div className={`text-sm font-semibold ${stage.textColor} mb-1`}>{stage.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{stage.description}</div>
                {idx < WORKFLOW_STAGES.length - 1 && (
                  <div className="absolute right-0 top-8 hidden md:block">
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Manuscripts list or empty state */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : manuscripts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Needs your attention</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manuscripts awaiting triage, assignment, or a decision</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#0f2d6b]/8 text-[#0f2d6b]">
              {attentionList.length} {attentionList.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Manuscript</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden md:table-cell">Stage</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Reviews</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Submitted</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {attentionList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Nothing waiting — nice work.</p>
                    </td>
                  </tr>
                ) : (
                  attentionList.map((ms, idx) => (
                    <motion.tr
                      key={ms.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.04 }}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">
                          {`MS-${String(ms.id).padStart(4, '0')}`}
                        </p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-md group-hover:text-[#0f2d6b] transition-colors">
                          {ms.title}
                        </p>
                        {(ms.category || ms.division || ms.authors) && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {[ms.category, ms.division].filter(Boolean).join(' · ') || ms.authors}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <StatusBadge status={ms.status} />
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        {ms.reviewers_total ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                            {ms.reviews_completed ?? 0}/{ms.reviewers_total} complete
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">none assigned</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{formatDate(ms.submitted_at)}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {['submitted', 'with_editor'].includes(ms.status) ? (
                          <select
                            defaultValue=""
                            disabled={assigningId === ms.id || editors.length === 0}
                            onChange={(e) => assignEditor(ms.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 disabled:opacity-50"
                          >
                            <option value="" disabled>
                              {assigningId === ms.id ? 'Assigning…' : 'Assign editor…'}
                            </option>
                            {editors.map((ed) => (
                              <option key={ed.id} value={ed.id}>{ed.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400">Assigned</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        /* Beautiful empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="flex flex-col items-center text-center py-20 px-6">
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0f2d6b]/8 to-[#c9a227]/8 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f2d6b] to-[#1a4da8] flex items-center justify-center shadow-lg">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#c9a227] flex items-center justify-center shadow">
                <PlusCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">No manuscripts yet</h3>
            <p className="text-gray-500 text-sm max-w-md mb-8 leading-relaxed">
              The manuscript management system is ready. Authors can submit their work through the journal portal, and you&apos;ll manage the full editorial workflow here.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full max-w-lg">
              {[
                { icon: <BookOpen className="w-4 h-4" />, label: 'Peer Review', desc: 'Manage reviewer assignments' },
                { icon: <BarChart3 className="w-4 h-4" />, label: 'Track Progress', desc: 'Full workflow visibility' },
                { icon: <Users className="w-4 h-4" />, label: 'Collaborate', desc: 'Multi-editor support' },
              ].map((feat) => (
                <div key={feat.label} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2d6b]/10 text-[#0f2d6b] flex items-center justify-center mb-2">
                    {feat.icon}
                  </div>
                  <div className="text-xs font-semibold text-gray-700">{feat.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{feat.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#0f2d6b] rounded-xl hover:bg-[#1a3d7c] transition-colors shadow-sm">
                <PlusCircle className="w-4 h-4" />
                Accept First Submission
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-[#0f2d6b] bg-[#0f2d6b]/8 rounded-xl hover:bg-[#0f2d6b]/12 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Check for Updates
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
