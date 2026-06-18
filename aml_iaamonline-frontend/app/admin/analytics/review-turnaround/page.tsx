'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, Clock } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface CategoryTurnaround {
  category: string;
  review_count: number;
  avg_days_to_complete: number;
}

interface TurnaroundData {
  by_category: CategoryTurnaround[];
  overall: { review_count: number; avg_days_to_complete: number };
}

function titleCase(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ReviewTurnaroundPage() {
  const [data, setData] = useState<TurnaroundData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/admin/analytics/review-turnaround`);
      if (!res.ok) throw new Error('Failed to load review turnaround');
      const json = await res.json();
      setData(json.data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = (data?.by_category ?? [])
    .filter((c) => c.review_count > 0)
    .map((c) => ({ label: titleCase(c.category), days: c.avg_days_to_complete, count: c.review_count }));

  return (
    <div className="min-h-full">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics', href: '/admin/analytics' },
          { label: 'Review Turnaround' },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Turnaround</h1>
          <p className="text-sm text-gray-500 mt-0.5">Average days from reviewer invitation to completed review</p>
        </div>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#0f2d6b] to-[#1a4da8] rounded-2xl shadow-lg p-6 text-white">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 mb-3"><Clock className="w-5 h-5" /></div>
              <div className="text-3xl font-bold">{isLoading ? '…' : `${data?.overall.avg_days_to_complete ?? 0} days`}</div>
              <div className="text-sm text-white/75 mt-1">Overall average turnaround</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-3"><Clock className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : (data?.overall.review_count ?? 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Completed reviews</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Average Days by Category</h2>
            {isLoading ? (
              <div className="h-72 bg-gray-50 rounded-xl animate-pulse" />
            ) : chartData.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">No completed reviews yet.</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={110} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [`${v} days`, 'Avg turnaround']} cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey="days" radius={[0, 6, 6, 0]} maxBarSize={28} fill="#c9a227" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
