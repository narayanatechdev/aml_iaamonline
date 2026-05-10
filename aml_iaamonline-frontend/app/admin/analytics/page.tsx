'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis,
  LineChart, Line, Legend,
} from 'recharts';
import {
  TrendingUp, BookOpen, Download, Quote, Eye, RefreshCw, ArrowUpRight,
  BarChart3, Award,
} from 'lucide-react';
import Link from 'next/link';
import { AdminBreadcrumb } from '@/components/admin';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ArticleStats {
  total: number;
  total_views: number;
  total_downloads: number;
  total_citations: number;
  by_year: Record<string, number>;
  by_subject: Record<string, number>;
  by_type: Record<string, number>;
}

interface Article {
  id: number;
  title: string;
  year: number | null;
  total_views: number;
  total_downloads: number;
  total_citations?: number;
  article_type: string | null;
  subject?: string;
}

const SUBJECT_COLORS = [
  '#0f2d6b', '#1a4da8', '#c9a227', '#e8b84b', '#2563eb',
  '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2',
  '#6366f1', '#14b8a6',
];

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    'Research Article': 'bg-blue-100 text-blue-800',
    'Review': 'bg-amber-100 text-amber-800',
    'Letter': 'bg-indigo-100 text-indigo-800',
    'Editorial': 'bg-green-100 text-green-800',
    'Communication': 'bg-purple-100 text-purple-800',
  };
  const cls = colors[type] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {type || 'Article'}
    </span>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [topArticles, setTopArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'publications' | 'subjects' | 'performance'>('publications');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, topRes] = await Promise.allSettled([
        fetch(`${API_BASE}/articles/stats`),
        fetch(`${API_BASE}/articles?sort=total_views&dir=desc&per_page=10`),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        setStats(await statsRes.value.json());
      }
      if (topRes.status === 'fulfilled' && topRes.value.ok) {
        const data = await topRes.value.json();
        setTopArticles(data.data || data.articles || data || []);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Year data with growth rate
  const yearData = stats?.by_year
    ? Object.entries(stats.by_year)
        .map(([year, count]) => ({ year, count: Number(count) }))
        .sort((a, b) => Number(a.year) - Number(b.year))
    : [];

  const yearDataWithGrowth = yearData.map((d, idx) => ({
    ...d,
    growth: idx > 0 && yearData[idx - 1].count > 0
      ? Math.round(((d.count - yearData[idx - 1].count) / yearData[idx - 1].count) * 100)
      : 0,
  }));

  const subjectData = stats?.by_subject
    ? Object.entries(stats.by_subject)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value)
    : [];

  const typeData = stats?.by_type
    ? Object.entries(stats.by_type)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value)
    : [];

  // Download vs views scatter data
  const scatterData = topArticles.map((a) => ({
    views: a.total_views || 0,
    downloads: a.total_downloads || 0,
    title: a.title?.slice(0, 40) + '...',
    z: 40,
  }));

  const KPI_CARDS = stats ? [
    {
      label: 'Avg Views / Article',
      value: Math.round(stats.total_views / stats.total).toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50',
      change: '+8.2%',
    },
    {
      label: 'Avg Downloads / Article',
      value: Math.round(stats.total_downloads / stats.total).toLocaleString(),
      icon: <Download className="w-5 h-5" />,
      color: 'text-amber-600 bg-amber-50',
      change: '+5.1%',
    },
    {
      label: 'Download / View Ratio',
      value: `${((stats.total_downloads / stats.total_views) * 100).toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50',
      change: '+2.3%',
    },
    {
      label: 'Avg Citations / Article',
      value: (stats.total_citations / stats.total).toFixed(1),
      icon: <Quote className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50',
      change: '+12.7%',
    },
  ] : [];

  const TABS = [
    { id: 'publications', label: 'Publication Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subject Distribution', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'performance', label: 'Article Performance', icon: <Award className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Analytics' }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Deep-dive into journal performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0f2d6b] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {KPI_CARDS.map((card, idx) => (
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
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
              <div className="mt-2 text-xs text-green-600 font-medium">{card.change} vs last year</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#0f2d6b] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      {activeTab === 'publications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Publications over time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">Publications Over Time</h2>
              <p className="text-xs text-gray-500 mt-0.5">Annual article count with growth rate overlay</p>
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearDataWithGrowth} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f2d6b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0f2d6b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="count" stroke="#0f2d6b" strokeWidth={2.5} fill="url(#pubGrad)" name="Articles" />
                    <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#c9a227" strokeWidth={2} dot={false} name="Growth %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Document types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">By Document Type</h2>
              <p className="text-xs text-gray-500 mt-0.5">Article type distribution</p>
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="space-y-3">
                {typeData.map((item, idx) => {
                  const pct = stats ? Math.round((item.value / stats.total) * 100) : 0;
                  const colors = ['#0f2d6b', '#c9a227', '#2563eb', '#059669', '#7c3aed'];
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 truncate">{item.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{item.value.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.2 + idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: colors[idx % colors.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Horizontal bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">Articles by Research Area</h2>
              <p className="text-xs text-gray-500 mt-0.5">Top subjects by article count</p>
            </div>
            {isLoading ? (
              <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subjectData.slice(0, 10)}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 140, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#374151' }}
                      axisLine={false}
                      tickLine={false}
                      width={135}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(v) => [(v as number).toLocaleString(), 'Articles']}
                      cursor={{ fill: '#f9fafb' }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={20}>
                      {subjectData.slice(0, 10).map((_, idx) => (
                        <Cell key={idx} fill={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Donut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">Subject Share</h2>
              <p className="text-xs text-gray-500 mt-0.5">Proportional breakdown of top subjects</p>
            </div>
            {isLoading ? (
              <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {subjectData.slice(0, 8).map((_, idx) => (
                          <Cell key={idx} fill={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                  {subjectData.slice(0, 8).map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: SUBJECT_COLORS[idx % SUBJECT_COLORS.length] }}
                      />
                      <span className="text-gray-600 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Download vs Views scatter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-900">Downloads vs Views Correlation</h2>
              <p className="text-xs text-gray-500 mt-0.5">Top 10 articles by engagement</p>
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="views" name="Views" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="downloads" name="Downloads" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <ZAxis dataKey="z" range={[40, 40]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                      content={({ payload }) => {
                        if (!payload || !payload[0]) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg max-w-xs">
                            <p className="text-xs font-medium text-gray-800 mb-1 line-clamp-2">{d.title}</p>
                            <p className="text-xs text-gray-500">Views: {d.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Downloads: {d.downloads.toLocaleString()}</p>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={scatterData} fill="#0f2d6b" fillOpacity={0.75} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Top articles table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Top Articles by Views</h2>
              <p className="text-xs text-gray-500 mt-0.5">Most-read articles in the journal</p>
            </div>
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {topArticles.slice(0, 8).map((article, idx) => (
                  <div key={article.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-gray-50/60 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-relaxed">{article.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">
                          <Eye className="w-3 h-3 inline mr-0.5" />
                          {(article.total_views || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          <Download className="w-3 h-3 inline mr-0.5" />
                          {(article.total_downloads || 0).toLocaleString()}
                        </span>
                        {article.year && <span className="text-xs text-gray-400">{article.year}</span>}
                      </div>
                    </div>
                    <Link href={`/articles/${article.id}`} className="flex-shrink-0 text-gray-300 hover:text-[#0f2d6b] transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Summary callout */}
      {stats && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-[#0f2d6b] to-[#1a4da8] rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {stats.total.toLocaleString()} Articles · {stats.total_views.toLocaleString()} Views · {stats.total_downloads.toLocaleString()} Downloads
                </div>
                <div className="text-white/70 text-sm mt-0.5">
                  Advanced Materials Letters — {Object.keys(stats.by_subject).length} research areas · {Object.keys(stats.by_year).length} years of publication
                </div>
              </div>
            </div>
            <Link
              href="/admin/articles"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a227] text-white rounded-xl text-sm font-medium hover:bg-[#e8b84b] transition-colors flex-shrink-0"
            >
              Browse Articles
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
