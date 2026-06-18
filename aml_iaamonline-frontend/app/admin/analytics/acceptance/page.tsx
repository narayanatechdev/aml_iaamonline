'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface PeriodStat {
  total_decided: number;
  accepted: number;
  rejected: number;
  acceptance_rate: number;
}

const PERIOD_LABELS: Record<string, string> = {
  all_time: 'All time',
  last_year: 'Last 12 months',
  last_6_months: 'Last 6 months',
  last_3_months: 'Last 3 months',
  last_month: 'Last month',
};

export default function AcceptanceRatePage() {
  const [data, setData] = useState<Record<string, PeriodStat>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/admin/analytics/acceptance-rate`);
      if (!res.ok) throw new Error('Failed to load acceptance rate');
      const json = await res.json();
      setData(json.data ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = Object.entries(data).map(([key, v]) => ({
    label: PERIOD_LABELS[key] ?? key,
    rate: v.acceptance_rate,
    accepted: v.accepted,
    rejected: v.rejected,
  }));

  const allTime = data.all_time;

  return (
    <div className="min-h-full">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics', href: '/admin/analytics' },
          { label: 'Acceptance Rate' },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acceptance Rate</h1>
          <p className="text-sm text-gray-500 mt-0.5">Editorial decision outcomes across time periods</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#0f2d6b] to-[#1a4da8] rounded-2xl shadow-lg p-6 text-white">
              <div className="text-3xl font-bold">{isLoading ? '…' : `${allTime?.acceptance_rate ?? 0}%`}</div>
              <div className="text-sm text-white/75 mt-1">All-time acceptance rate</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 mb-3"><CheckCircle className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : (allTime?.accepted ?? 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Accepted (all time)</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 mb-3"><XCircle className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : (allTime?.rejected ?? 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Rejected (all time)</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Acceptance Rate by Period</h2>
            {isLoading ? (
              <div className="h-72 bg-gray-50 rounded-xl animate-pulse" />
            ) : chartData.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-500">No decision data yet.</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis unit="%" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Acceptance']} cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((_, i) => (<Cell key={i} fill={i === 0 ? '#0f2d6b' : '#c9a227'} />))}
                    </Bar>
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
