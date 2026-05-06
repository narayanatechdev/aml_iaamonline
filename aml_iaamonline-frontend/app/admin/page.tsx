'use client';

import { useState, useEffect } from 'react';
import { FileText, Clock, AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsCard, DataTable, AdminBreadcrumb } from '@/components/admin';

interface DashboardStats {
  total_submissions: number;
  active_manuscripts: number;
  pending_decisions: number;
  system_alerts: number;
}

interface TrendData {
  month: string;
  submissions: number;
  acceptanceRate: number;
}

interface AuditLogEntry {
  id: number;
  action: string;
  actor: string;
  manuscript_id: string | null;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Mock data for development
const MOCK_STATS: DashboardStats = {
  total_submissions: 1247,
  active_manuscripts: 89,
  pending_decisions: 23,
  system_alerts: 0,
};

const MOCK_TRENDS: TrendData[] = [
  { month: 'Jan', submissions: 45, acceptanceRate: 42 },
  { month: 'Feb', submissions: 52, acceptanceRate: 45 },
  { month: 'Mar', submissions: 61, acceptanceRate: 48 },
  { month: 'Apr', submissions: 55, acceptanceRate: 44 },
  { month: 'May', submissions: 78, acceptanceRate: 51 },
  { month: 'Jun', submissions: 82, acceptanceRate: 53 },
  { month: 'Jul', submissions: 95, acceptanceRate: 55 },
  { month: 'Aug', submissions: 88, acceptanceRate: 52 },
  { month: 'Sep', submissions: 102, acceptanceRate: 58 },
  { month: 'Oct', submissions: 110, acceptanceRate: 61 },
  { month: 'Nov', submissions: 125, acceptanceRate: 63 },
  { month: 'Dec', submissions: 118, acceptanceRate: 60 },
];

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 1, action: 'Manuscript submitted', actor: 'john.doe@example.com', manuscript_id: 'AML-2024-0125', created_at: '2024-01-15T10:30:00Z' },
  { id: 2, action: 'Review assigned', actor: 'editor@iaamonline.org', manuscript_id: 'AML-2024-0124', created_at: '2024-01-15T09:15:00Z' },
  { id: 3, action: 'Decision made: Accept', actor: 'chief.editor@iaamonline.org', manuscript_id: 'AML-2024-0120', created_at: '2024-01-15T08:45:00Z' },
  { id: 4, action: 'Revision submitted', actor: 'jane.smith@university.edu', manuscript_id: 'AML-2024-0118', created_at: '2024-01-14T16:20:00Z' },
  { id: 5, action: 'User registered', actor: 'new.author@research.org', manuscript_id: null, created_at: '2024-01-14T14:00:00Z' },
  { id: 6, action: 'Review completed', actor: 'reviewer1@university.edu', manuscript_id: 'AML-2024-0115', created_at: '2024-01-14T11:30:00Z' },
  { id: 7, action: 'Manuscript submitted', actor: 'research@lab.edu', manuscript_id: 'AML-2024-0126', created_at: '2024-01-14T10:00:00Z' },
  { id: 8, action: 'Decision made: Revision', actor: 'editor@iaamonline.org', manuscript_id: 'AML-2024-0112', created_at: '2024-01-13T15:45:00Z' },
  { id: 9, action: 'Review invitation sent', actor: 'editor@iaamonline.org', manuscript_id: 'AML-2024-0110', created_at: '2024-01-13T14:20:00Z' },
  { id: 10, action: 'Initial check completed', actor: 'admin@iaamonline.org', manuscript_id: 'AML-2024-0125', created_at: '2024-01-13T12:00:00Z' },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from API, fall back to mock data
      const [statsRes, trendsRes, logsRes] = await Promise.allSettled([
        fetch(`${API_BASE}/admin/stats/dashboard`),
        fetch(`${API_BASE}/admin/stats/trends`),
        fetch(`${API_BASE}/admin/audit-logs?limit=10`),
      ]);

      // Use API data if available, otherwise use mock data
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        const data = await statsRes.value.json();
        setStats(data);
      } else {
        setStats(MOCK_STATS);
      }

      if (trendsRes.status === 'fulfilled' && trendsRes.value.ok) {
        const data = await trendsRes.value.json();
        setTrends(data);
      } else {
        setTrends(MOCK_TRENDS);
      }

      if (logsRes.status === 'fulfilled' && logsRes.value.ok) {
        const data = await logsRes.value.json();
        setAuditLogs(data.data || data);
      } else {
        setAuditLogs(MOCK_AUDIT_LOGS);
      }
    } catch (err) {
      // Use mock data on error
      setStats(MOCK_STATS);
      setTrends(MOCK_TRENDS);
      setAuditLogs(MOCK_AUDIT_LOGS);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const auditLogColumns = [
    { key: 'action' as const, label: 'Action', sortable: true },
    { key: 'actor' as const, label: 'Actor', sortable: true },
    {
      key: 'manuscript_id' as const,
      label: 'Manuscript',
      render: (value: unknown) => {
        const val = value as string | null;
        return val ? (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {val}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      key: 'created_at' as const,
      label: 'Time',
      render: (value: unknown) => (
        <span className="text-gray-500">{formatDate(value as string)}</span>
      ),
    },
  ];

  return (
    <div>
      <AdminBreadcrumb items={[{ label: 'Dashboard' }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {error && (
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            icon={<FileText className="w-5 h-5" />}
            label="Total Submissions"
            value={stats.total_submissions.toLocaleString()}
            change={{ value: 12, direction: 'up', period: 'vs last month' }}
          />
          <StatsCard
            icon={<Clock className="w-5 h-5" />}
            label="Active Manuscripts"
            value={stats.active_manuscripts}
            change={{ value: 5, direction: 'up', period: 'vs last week' }}
          />
          <StatsCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Pending Decisions"
            value={stats.pending_decisions}
            change={{ value: 3, direction: 'down', period: 'vs yesterday' }}
          />
          <StatsCard
            icon={<AlertTriangle className="w-5 h-5" />}
            label="System Alerts"
            value={stats.system_alerts}
          />
        </div>
      ) : null}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {/* Submission Trends */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Submission Trends
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      stroke="#0f2d6b"
                      strokeWidth={2}
                      dot={{ fill: '#0f2d6b', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Acceptance Rate (%)
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`${value}%`, 'Rate']}
                    />
                    <Line
                      type="monotone"
                      dataKey="acceptanceRate"
                      stroke="#c9a227"
                      strokeWidth={2}
                      dot={{ fill: '#c9a227', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <DataTable
          columns={auditLogColumns}
          data={auditLogs}
          isLoading={isLoading}
          keyField="id"
        />
      </div>
    </div>
  );
}
