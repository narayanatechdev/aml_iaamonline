'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, TrendingUp, FileText } from 'lucide-react';
import { AdminBreadcrumb } from '@/components/admin';
import { authFetch, API_BASE } from '@/lib/adminAuth';

interface TrendPoint {
  month: string;
  label: string;
  count: number;
}

export default function SubmissionTrendsPage() {
  const [data, setData] = useState<TrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/admin/analytics/submissions`);
      if (!res.ok) throw new Error('Failed to load submission trends');
      const json = await res.json();
      setData(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const total = data.reduce((sum, d) => sum + d.count, 0);
  const peak = data.reduce((max, d) => (d.count > max.count ? d : max), { count: 0, label: '—' } as TrendPoint);

  return (
    <div className="min-h-full">
      <AdminBreadcrumb
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Analytics', href: '/admin/analytics' },
          { label: 'Submission Trends' },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submission Trends</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monthly manuscript submissions over the last 12 months</p>
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
          <button onClick={fetchData} className="px-4 py-2 text-sm font-medium text-white bg-[#0f2d6b] rounded-lg hover:bg-[#1a3d7c]">
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-3"><FileText className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : total.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Submissions (12 mo)</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 mb-3"><TrendingUp className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : peak.count.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Peak month — {peak.label}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-3"><TrendingUp className="w-5 h-5" /></div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? '…' : (data.length ? Math.round(total / data.length) : 0).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">Monthly average</div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <h2 className="text-base font-semibold text-gray-900 mb-6">Monthly Submissions</h2>
            {isLoading ? (
              <div className="h-72 bg-gray-50 rounded-xl animate-pulse" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f2d6b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0f2d6b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [(v as number).toLocaleString(), 'Submissions']} />
                    <Area type="monotone" dataKey="count" stroke="#0f2d6b" strokeWidth={2.5} fill="url(#subGrad)" dot={{ fill: '#0f2d6b', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#c9a227', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
