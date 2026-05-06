'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../../lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const revenueData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 3800 },
  { name: 'Mar', value: 5200 },
  { name: 'Apr', value: 4800 },
  { name: 'May', value: 6100 },
  { name: 'Jun', value: 5900 },
  { name: 'Jul', value: 7200 },
];

const trafficData = [
  { name: 'Mon', value: 450 },
  { name: 'Tue', value: 520 },
  { name: 'Wed', value: 480 },
  { name: 'Thu', value: 610 },
  { name: 'Fri', value: 590 },
  { name: 'Sat', value: 380 },
  { name: 'Sun', value: 410 },
];

const sourceData = [
  { name: 'Direct', value: 45, color: '#4F46E5' },
  { name: 'Search', value: 30, color: '#2563EB' },
  { name: 'Referral', value: 15, color: '#B8ADA4' },
  { name: 'Other', value: 10, color: '#3A3A3A' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const MetricCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <motion.div 
    variants={itemVariants}
    className="bg-luxury-card border border-luxury-border p-6 rounded-2xl hover:border-luxury-primary/30 hover:shadow-2xl hover:shadow-luxury-primary/5 transition-all duration-500 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
        <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
      </div>
      <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <p className="text-luxury-text-secondary text-xs uppercase tracking-widest font-bold mb-1">{title}</p>
    <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
  </motion.div>
);

export const LuxuryInsights = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Performance <span className="text-luxury-primary">Overview</span></h1>
          <p className="text-luxury-text-secondary text-sm">Welcome back, Alex. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-luxury-card border-luxury-border text-white hover:bg-white/5 rounded-xl font-bold text-xs gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="bg-luxury-primary hover:bg-luxury-primary/90 text-white rounded-xl font-bold text-xs gap-2 shadow-lg shadow-luxury-primary/20">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value="$4.82M" 
          change="12.5" 
          trend="up" 
          icon={DollarSign} 
          color="bg-luxury-primary"
        />
        <MetricCard 
          title="Active Users" 
          value="84.2K" 
          change="8.2" 
          trend="up" 
          icon={Users} 
          color="bg-luxury-secondary"
        />
        <MetricCard 
          title="Conversion" 
          value="3.42%" 
          change="2.4" 
          trend="down" 
          icon={TrendingUp} 
          color="bg-luxury-neutral"
        />
        <MetricCard 
          title="Engagement" 
          value="68%" 
          change="4.1" 
          trend="up" 
          icon={Activity} 
          color="bg-emerald-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-luxury-card border border-luxury-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg mb-1">Revenue Growth</h3>
              <p className="text-xs text-luxury-text-secondary">Monthly financial performance</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-luxury-primary" /> Projected
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold">
                <div className="w-2 h-2 rounded-full bg-indigo-200" /> Actual
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#262626', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Source Distribution */}
        <motion.div variants={itemVariants} className="bg-luxury-card border border-luxury-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-1">Lead Sources</h3>
          <p className="text-xs text-luxury-text-secondary mb-8">Traffic acquisition channels</p>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">1.2k</span>
              <span className="text-[10px] text-luxury-text-secondary font-bold uppercase">Total</span>
            </div>
          </div>
          <div className="space-y-3 mt-6">
            {sourceData.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-xs font-medium">{source.name}</span>
                </div>
                <span className="text-xs font-bold">{source.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pipeline & Team */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline Table */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-luxury-card border border-luxury-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-luxury-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Leads Pipeline</h3>
              <p className="text-xs text-luxury-text-secondary">Recent high-value opportunities</p>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-white/5"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-luxury-text-secondary bg-white/[0.02]">
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Contact</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Company</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border">
                {[
                  { name: 'Sarah Wilson', company: 'Global Materials', status: 'In Review', value: '$24,500', color: 'bg-indigo-500' },
                  { name: 'Wei Zhang', company: 'TechNano Inc', status: 'Accepted', value: '$12,800', color: 'bg-emerald-500' },
                  { name: 'Robert Johnson', company: 'RenewEnergy', status: 'Under Review', value: '$45,000', color: 'bg-amber-500' },
                  { name: 'Elena Rodriguez', company: 'Solara Labs', status: 'Revision', value: '$18,200', color: 'bg-rose-500' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-white", row.color)}>
                          {row.name.charAt(0)}
                        </div>
                        <span className="font-bold">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-luxury-text-secondary">{row.company}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="border-luxury-border bg-white/5 text-[10px] font-bold h-6">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-luxury-primary">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Insights & Progress */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* AI Insights Widget */}
          <div className="bg-gradient-to-br from-luxury-primary to-luxury-secondary rounded-2xl p-6 relative overflow-hidden group">
            <Zap className="absolute -top-4 -right-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <Zap className="w-3 h-3 text-white fill-white" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white">AI Insights</span>
              </div>
              <h4 className="text-white font-bold mb-2">Anomalous Growth Detected</h4>
              <p className="text-white/80 text-xs leading-relaxed mb-4">
                We've noticed a 14% increase in energy-related submissions from the APAC region. Consider opening a new section.
              </p>
              <Button size="sm" className="bg-white text-luxury-primary hover:bg-white/90 rounded-xl font-bold text-[10px] w-full">Explore Opportunity</Button>
            </div>
          </div>

          {/* Tasks Progress */}
          <div className="bg-luxury-card border border-luxury-border rounded-2xl p-6">
            <h3 className="font-bold text-sm mb-5 uppercase tracking-wider">Publication Progress</h3>
            <div className="space-y-5">
              {[
                { label: 'Annual Report', progress: 78, status: 'On Track' },
                { label: 'Issue 3 Prep', progress: 45, status: 'Delayed' },
                { label: 'Web Redesign', progress: 92, status: 'Finishing' },
              ].map((task) => (
                <div key={task.label} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold">{task.label}</span>
                    <span className="text-luxury-text-secondary">{task.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={cn(
                        "h-full rounded-full",
                        task.status === 'Delayed' ? "bg-rose-500" : "bg-luxury-primary"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
