'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import {
  FileText, Eye, Download, Quote, Users, BookOpen, BarChart3,
  ArrowUpRight, RefreshCw, CheckCircle, Database, Server, Layers,
  TrendingUp, ChevronRight,
} from 'lucide-react';
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
  volume: number | null;
  issue: number | null;
  year: number | null;
  article_type: string | null;
  total_views: number;
  total_downloads: number;
  authors_count?: number;
}

// Animated counter hook
function useCountUp(target: number, duration: number = 1.5, enabled: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || target === 0) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return controls.stop;
  }, [target, duration, enabled]);

  return count;
}

// Animated stat card
function HeroStatCard({
  icon,
  label,
  value,
  gradient,
  iconBg,
  delay = 0,
  prefix = '',
  suffix = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  iconBg: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 1.8, inView);

  const formatted = count >= 1_000_000
    ? `${(count / 1_000_000).toFixed(2)}M`
    : count >= 1_000
    ? count.toLocaleString()
    : count.toString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} mb-4`}>
          {icon}
        </div>
        <div className="text-3xl font-bold text-white mb-1 tabular-nums">
          {prefix}{formatted}{suffix}
        </div>
        <div className="text-sm text-white/75 font-medium">{label}</div>
        <div className="mt-3 flex items-center gap-1 text-white/60 text-xs">
          <TrendingUp className="w-3 h-3" />
          <span>Real-time data</span>
        </div>
      </div>
    </motion.div>
  );
}

const SUBJECT_COLORS = [
  '#0f2d6b', '#1a4da8', '#c9a227', '#e8b84b', '#2563eb',
  '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2',
];

const TYPE_COLOR_MAP: Record<string, string> = {
  'Research Article': '#0f2d6b',
  'Review': '#c9a227',
  'Letter': '#2563eb',
  'Editorial': '#059669',
  'Communication': '#7c3aed',
  'Correction': '#dc2626',
};

function getTypeColor(type: string) {
  return TYPE_COLOR_MAP[type] || '#6b7280';
}

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

// Custom donut label
const renderCustomLabel = (props: PieLabelRenderProps) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  if ((percent as number) < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${((percent as number) * 100).toFixed(0)}%`}
    </text>
  );
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/60 animate-pulse h-40 shadow" />
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-2xl bg-white animate-pulse h-80 shadow border border-gray-100" />
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, articlesRes] = await Promise.allSettled([
        fetch(`${API_BASE}/articles/stats`),
        fetch(`${API_BASE}/articles?sort=publish_date&dir=desc&per_page=5`),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStats(data);
      }

      if (articlesRes.status === 'fulfilled' && articlesRes.value.ok) {
        const data = await articlesRes.value.json();
        setRecentArticles(data.data || data.articles || data || []);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform data for charts
  const yearData = stats?.by_year
    ? Object.entries(stats.by_year)
        .map(([year, count]) => ({ year, count: Number(count) }))
        .sort((a, b) => Number(a.year) - Number(b.year))
        .slice(-12)
    : [];

  const subjectData = stats?.by_subject
    ? Object.entries(stats.by_subject)
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
    : [];

  const typeData = stats?.by_type
    ? Object.entries(stats.by_type)
        .map(([name, value]) => ({ name, value: Number(value), fill: getTypeColor(name) }))
        .sort((a, b) => b.value - a.value)
    : [];

  const quickActions = [
    { label: 'Manage Users', icon: <Users className="w-5 h-5" />, href: '/admin/users', count: '1,293', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Browse Articles', icon: <BookOpen className="w-5 h-5" />, href: '/admin/articles', count: '1,662', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    { label: 'Manuscripts', icon: <FileText className="w-5 h-5" />, href: '/admin/manuscripts', count: 'Workflow', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/analytics', count: 'Deep Dive', color: 'bg-green-50 text-green-700 border-green-100' },
  ];

  const healthItems = [
    { label: 'API Server', status: 'online', icon: <Server className="w-4 h-4" /> },
    { label: 'Database', status: 'online', icon: <Database className="w-4 h-4" />, detail: '7k+ records' },
    { label: 'Articles', status: 'online', icon: <Layers className="w-4 h-4" />, detail: stats ? `${stats.total.toLocaleString()} indexed` : 'Loading...' },
    { label: 'Authors', status: 'online', icon: <Users className="w-4 h-4" />, detail: '5,051 linked' },
  ];

  return (
    <div className="min-h-full">
      <AdminBreadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Advanced Materials Letters — Journal Analytics
            {lastUpdated && (
              <span className="ml-2 text-gray-400">
                · Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
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

      {/* Hero Stats Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <HeroStatCard
            icon={<FileText className="w-6 h-6 text-white" />}
            label="Total Articles Published"
            value={stats.total}
            gradient="bg-gradient-to-br from-[#0f2d6b] to-[#1a4da8]"
            iconBg="bg-white/20"
            delay={0}
          />
          <HeroStatCard
            icon={<Eye className="w-6 h-6 text-white" />}
            label="Total Article Views"
            value={stats.total_views}
            gradient="bg-gradient-to-br from-[#1a4da8] to-[#2563eb]"
            iconBg="bg-white/20"
            delay={0.1}
          />
          <HeroStatCard
            icon={<Download className="w-6 h-6 text-[#0f2d6b]" />}
            label="Total Downloads"
            value={stats.total_downloads}
            gradient="bg-gradient-to-br from-[#c9a227] to-[#e8b84b]"
            iconBg="bg-[#0f2d6b]/20"
            delay={0.2}
          />
          <HeroStatCard
            icon={<Quote className="w-6 h-6 text-white" />}
            label="Total Citations"
            value={stats.total_citations}
            gradient="bg-gradient-to-br from-[#0f2d6b] via-[#1a3d7c] to-[#c9a227]"
            iconBg="bg-white/20"
            delay={0.3}
          />
        </div>
      ) : null}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Publications by Year — area chart, 3/5 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Publications by Year</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Annual article output (2010 – present)</p>
                </div>
                <span className="text-xs text-[#0f2d6b] bg-[#0f2d6b]/8 px-2 py-1 rounded-full font-medium">
                  {yearData.length} years
                </span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="yearGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f2d6b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0f2d6b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(v) => [(v as number).toLocaleString(), 'Articles']}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#0f2d6b"
                      strokeWidth={2.5}
                      fill="url(#yearGrad)"
                      dot={{ fill: '#0f2d6b', r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#c9a227', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        {/* Articles by Subject — donut chart, 2/5 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900">Articles by Subject</h2>
                <p className="text-xs text-gray-500 mt-0.5">Top research areas</p>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {subjectData.map((_, idx) => (
                        <Cell key={idx} fill={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {subjectData.slice(0, 6).map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: SUBJECT_COLORS[idx % SUBJECT_COLORS.length] }}
                      />
                      <span className="text-gray-600 truncate">{item.name}</span>
                    </div>
                    <span className="text-gray-900 font-medium ml-2 flex-shrink-0">{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Document Types — horizontal bar, 3/5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Document Types</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Distribution by article type</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical" margin={{ top: 0, right: 16, left: 80, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#374151' }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(v) => [(v as number).toLocaleString(), 'Articles']}
                      cursor={{ fill: '#f9fafb' }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
                      {typeData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions, 2/5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Jump to key sections</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + idx * 0.08 }}
              >
                <Link
                  href={action.href}
                  className={`flex items-center justify-between p-3.5 rounded-xl border ${action.color} hover:shadow-sm transition-all group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">{action.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs opacity-70">{action.count}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Articles Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent Articles</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest published works</p>
          </div>
          <Link
            href="/admin/articles"
            className="flex items-center gap-1 text-xs font-medium text-[#0f2d6b] hover:text-[#c9a227] transition-colors"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No articles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">Title</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden md:table-cell">Vol/Issue</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden sm:table-cell">Year</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3 hidden lg:table-cell">Views</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3 hidden xl:table-cell">Type</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article, idx) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85 + idx * 0.05 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs group-hover:text-[#0f2d6b] transition-colors">
                        {article.title}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-500">
                        {article.volume != null && article.issue != null
                          ? `Vol.${article.volume} Iss.${article.issue}`
                          : '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-gray-700 font-medium">{article.year ?? '—'}</span>
                    </td>
                    <td className="px-3 py-3.5 hidden lg:table-cell text-right">
                      <span className="text-xs font-medium text-gray-700">
                        {(article.total_views ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 hidden xl:table-cell">
                      <TypeBadge type={article.article_type || 'Research Article'} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-xs text-[#0f2d6b]/50 hover:text-[#0f2d6b] transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 inline" />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* System Health Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">System Health</h2>
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            All systems operational
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {healthItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-gray-700">{item.label}</div>
                {item.detail && <div className="text-xs text-gray-400 truncate">{item.detail}</div>}
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
