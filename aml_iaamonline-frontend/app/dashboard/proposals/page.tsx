'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, BookOpen, Loader2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { authFetch, API_BASE } from '@/lib/userAuth';

interface Proposal {
  id: number; proposal_id: string; kind: string; title: string;
  units?: string; status: string; created_at: string;
}

const PSTATUS: Record<string, { label: string; color: string }> = {
  proposed: { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  under_evaluation: { label: 'Under Evaluation', color: 'bg-amber-100 text-amber-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/my/proposals`);
      if (res.ok) setProposals((await res.json()).data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <UserDashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
            <p className="text-gray-500 text-sm mt-0.5">Book and conference-proceedings proposals you have submitted to IAAM.</p>
          </div>
          <Link href="/dashboard/proposals/new" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">
            <PlusCircle className="w-4 h-4" /> New Proposal
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : proposals.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><BookOpen className="w-8 h-8 text-[#0f2d6b]" /></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No proposals yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Propose a book or conference-proceedings volume for the IAAM publishing programme.</p>
              <Link href="/dashboard/proposals/new" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]"><PlusCircle className="w-4 h-4" /> Start a Proposal</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Proposal</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden sm:table-cell">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3.5">
                      <p className="text-xs font-mono text-[#c9a227] font-semibold mb-0.5">{p.proposal_id}</p>
                      <p className="text-sm font-medium text-gray-900">{p.title}</p>
                      {p.units && <p className="text-xs text-gray-400 mt-0.5">{p.units}</p>}
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell"><span className="text-xs text-gray-600">{p.kind}</span></td>
                    <td className="px-3 py-3.5"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${PSTATUS[p.status]?.color ?? 'bg-gray-100 text-gray-700'}`}>{PSTATUS[p.status]?.label ?? p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
