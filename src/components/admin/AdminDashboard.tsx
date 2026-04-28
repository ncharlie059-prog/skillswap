import { useState } from 'react';
import {
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Shield,
  Eye,
  Ban,
  CheckCircle,
  Search,
  Download,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Profile, Report } from '../../types';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockUsers: (Profile & { status: 'active' | 'banned' | 'suspended' })[] = [
  {
    id: 'u1',
    email: 'emma.johnson@university.edu',
    full_name: 'Emma Johnson',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'State University',
    college_id_verified: true,
    is_verified: true,
    is_online: true,
    last_seen: '',
    created_at: '2025-09-12T10:00:00Z',
    updated_at: '',
    status: 'active',
  },
  {
    id: 'u2',
    email: 'liam.chen@campus.edu',
    full_name: 'Liam Chen',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'Tech Institute',
    college_id_verified: true,
    is_verified: true,
    is_online: false,
    last_seen: '',
    created_at: '2025-10-03T14:30:00Z',
    updated_at: '',
    status: 'active',
  },
  {
    id: 'u3',
    email: 'sophia.ramirez@college.edu',
    full_name: 'Sophia Ramirez',
    avatar_url: '',
    role: 'client',
    phone: '',
    college: 'Liberal Arts College',
    college_id_verified: false,
    is_verified: false,
    is_online: true,
    last_seen: '',
    created_at: '2025-11-18T09:15:00Z',
    updated_at: '',
    status: 'active',
  },
  {
    id: 'u4',
    email: 'noah.williams@uni.edu',
    full_name: 'Noah Williams',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'State University',
    college_id_verified: true,
    is_verified: true,
    is_online: false,
    last_seen: '',
    created_at: '2025-08-22T16:45:00Z',
    updated_at: '',
    status: 'banned',
  },
  {
    id: 'u5',
    email: 'olivia.brown@campus.edu',
    full_name: 'Olivia Brown',
    avatar_url: '',
    role: 'client',
    phone: '',
    college: 'Business School',
    college_id_verified: true,
    is_verified: true,
    is_online: true,
    last_seen: '',
    created_at: '2026-01-05T11:20:00Z',
    updated_at: '',
    status: 'suspended',
  },
  {
    id: 'u6',
    email: 'ethan.davis@university.edu',
    full_name: 'Ethan Davis',
    avatar_url: '',
    role: 'freelancer',
    phone: '',
    college: 'Engineering College',
    college_id_verified: true,
    is_verified: false,
    is_online: false,
    last_seen: '',
    created_at: '2026-02-14T08:00:00Z',
    updated_at: '',
    status: 'active',
  },
];

const mockReports: (Report & { reporter_name: string; reported_name: string })[] = [
  {
    id: 'r1',
    reporter_id: 'u3',
    reported_user_id: 'u4',
    reason: 'Spam / Misleading listing',
    description: 'The freelancer delivered a completely different deliverable from what was advertised in their gig listing.',
    status: 'pending',
    created_at: '2026-04-25T14:00:00Z',
    reporter_name: 'Sophia Ramirez',
    reported_name: 'Noah Williams',
  },
  {
    id: 'r2',
    reporter_id: 'u1',
    reported_user_id: 'u5',
    reason: 'Harassment',
    description: 'Client sent threatening messages after requesting free revisions outside the agreed scope.',
    status: 'pending',
    created_at: '2026-04-24T09:30:00Z',
    reporter_name: 'Emma Johnson',
    reported_name: 'Olivia Brown',
  },
  {
    id: 'r3',
    reporter_id: 'u2',
    reported_user_id: 'u6',
    reason: 'Plagiarism',
    description: 'Submitted work that was directly copied from a publicly available GitHub repository without attribution.',
    status: 'reviewed',
    created_at: '2026-04-22T16:45:00Z',
    reporter_name: 'Liam Chen',
    reported_name: 'Ethan Davis',
  },
  {
    id: 'r4',
    reporter_id: 'u5',
    reported_user_id: 'u1',
    reason: 'Off-platform communication',
    description: 'Freelancer insisted on moving the transaction off-platform to avoid fees.',
    status: 'dismissed',
    created_at: '2026-04-20T11:00:00Z',
    reporter_name: 'Olivia Brown',
    reported_name: 'Emma Johnson',
  },
];

const revenueData = [
  { month: 'Nov', amount: 4200 },
  { month: 'Dec', amount: 5800 },
  { month: 'Jan', amount: 4900 },
  { month: 'Feb', amount: 7100 },
  { month: 'Mar', amount: 8400 },
  { month: 'Apr', amount: 9200 },
];

const userGrowthData = [
  { month: 'Nov', users: 320 },
  { month: 'Dec', users: 410 },
  { month: 'Jan', users: 485 },
  { month: 'Feb', users: 580 },
  { month: 'Mar', users: 720 },
  { month: 'Apr', users: 894 },
];

const activityLog = [
  {
    id: 'a1',
    action: 'User banned',
    detail: 'Noah Williams was banned for policy violation',
    time: '2 hours ago',
    type: 'ban' as const,
  },
  {
    id: 'a2',
    action: 'Report resolved',
    detail: 'Off-platform communication report dismissed',
    time: '5 hours ago',
    type: 'resolve' as const,
  },
  {
    id: 'a3',
    action: 'Payout processed',
    detail: '$1,240.00 released to Emma Johnson',
    time: '8 hours ago',
    type: 'payout' as const,
  },
  {
    id: 'a4',
    action: 'User verified',
    detail: 'Ethan Davis completed college ID verification',
    time: '1 day ago',
    type: 'verify' as const,
  },
  {
    id: 'a5',
    action: 'Support ticket closed',
    detail: 'Ticket #TK-1042 resolved by admin',
    time: '1 day ago',
    type: 'support' as const,
  },
  {
    id: 'a6',
    action: 'New report filed',
    detail: 'Harassment report against Olivia Brown',
    time: '2 days ago',
    type: 'report' as const,
  },
  {
    id: 'a7',
    action: 'System update',
    detail: 'Commission rate updated to 12%',
    time: '3 days ago',
    type: 'system' as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const { profile: _profile } = useAuth();
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'analytics'>('overview');

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const pendingReports = mockReports.filter((r) => r.status === 'pending');
  const reviewedReports = mockReports.filter((r) => r.status !== 'pending');

  const maxRevenue = Math.max(...revenueData.map((d) => d.amount));
  const maxUsers = Math.max(...userGrowthData.map((d) => d.users));
  const completionRate = 87.4;

  /* ---- helpers ---- */

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      banned: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
      suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      reviewed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400',
      resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
      dismissed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    };
    return map[status] ?? map.dismissed;
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      freelancer: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
      client: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
      admin: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    };
    return map[role] ?? map.client;
  };

  const activityIcon = (type: string) => {
    const map: Record<string, string> = {
      ban: 'text-red-500',
      resolve: 'text-emerald-500',
      payout: 'text-teal-500',
      verify: 'text-sky-500',
      support: 'text-amber-500',
      report: 'text-orange-500',
      system: 'text-gray-500 dark:text-gray-400',
    };
    return map[type] ?? map.system;
  };

  const statCards = [
    {
      label: 'Total Users',
      value: '894',
      change: '+12.4%',
      up: true,
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Revenue',
      value: '$39,600',
      change: '+24.1%',
      up: true,
      icon: DollarSign,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      label: 'Active Orders',
      value: '142',
      change: '+8.2%',
      up: true,
      icon: FileText,
      color: 'from-cyan-500 to-emerald-600',
    },
    {
      label: 'Open Reports',
      value: String(pendingReports.length),
      change: pendingReports.length > 0 ? 'Needs attention' : 'All clear',
      up: pendingReports.length === 0,
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  /* ---- render ---- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              SkillSwap Campus Ultimate v2 &mdash; Platform overview
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System operational
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1 mb-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
          {(
            [
              ['overview', 'Overview'],
              ['users', 'Users'],
              ['reports', 'Reports'],
              ['analytics', 'Analytics'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          s.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {s.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${s.color} shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div
                    className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300`}
                  />
                </div>
              ))}
            </div>

            {/* Two-column: Recent Activity + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {activityLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      <div
                        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${activityIcon(entry.type).replace('text-', 'bg-')}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.action}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{entry.detail}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
                        {entry.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { icon: Download, label: 'Export Data', desc: 'Download CSV reports' },
                    { icon: Users, label: 'Send Announcement', desc: 'Notify all users' },
                    { icon: BarChart3, label: 'System Settings', desc: 'Configure platform' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all duration-200 text-left group"
                    >
                      <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-colors duration-200">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== USERS TAB ===================== */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h2>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user.full_name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.college}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View profile"
                            className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-150"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Verify user"
                            className="p-2 rounded-lg text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-all duration-150"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            title="Ban user"
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-150"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                        No users found matching &quot;{userSearch}&quot;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredUsers.length} of {mockUsers.length} users
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      p === 1
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== REPORTS TAB ===================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Pending Reports */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Pending Reports
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    {pendingReports.length}
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {report.reason}
                          </p>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(report.status)}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reported by{' '}
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {report.reporter_name}
                          </span>{' '}
                          against{' '}
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {report.reported_name}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {report.description}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(report.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="px-3 py-2 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60 transition-all duration-150">
                          Review
                        </button>
                        <button className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all duration-150">
                          Dismiss
                        </button>
                        <button className="px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-all duration-150">
                          Ban User
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingReports.length === 0 && (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">All caught up!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No pending reports to review.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resolved / Dismissed Reports */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Previously Reviewed</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {reviewedReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{report.reason}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.reported_name} &middot;{' '}
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== ANALYTICS TAB ===================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Revenue Overview
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${revenueData.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+24.1% vs prior</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-3 sm:gap-5 h-56">
                  {revenueData.map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        ${(d.amount / 1000).toFixed(1)}k
                      </span>
                      <div className="w-full relative group">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-500 ease-out group-hover:from-emerald-400 group-hover:to-teal-300"
                          style={{ height: `${(d.amount / maxRevenue) * 180}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Two-column: User Growth + Completion Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-500" />
                    User Growth
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">New signups per month</p>
                </div>
                <div className="p-6">
                  <div className="flex items-end gap-3 sm:gap-4 h-44">
                    {userGrowthData.map((d) => (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{d.users}</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-teal-500 to-cyan-400 transition-all duration-500 ease-out hover:from-teal-400 hover:to-cyan-300"
                          style={{ height: `${(d.users / maxUsers) * 140}px` }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Completion Rate */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-500" />
                    Task Completion Rate
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Successfully completed vs total</p>
                </div>
                <div className="p-6 flex flex-col items-center justify-center">
                  {/* Circular progress indicator */}
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#completionGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(completionRate / 100) * 439.82} 439.82`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">completion</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="w-full space-y-3">
                    {[
                      { label: 'Completed', value: 1248, color: 'bg-emerald-500' },
                      { label: 'In Progress', value: 142, color: 'bg-teal-500' },
                      { label: 'Cancelled', value: 36, color: 'bg-gray-300 dark:bg-gray-600' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Metrics */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Platform Metrics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg. Order Value', value: '$78.40', change: '+5.2%', up: true },
                  { label: 'Avg. Response Time', value: '2.4h', change: '-12%', up: true },
                  { label: 'Dispute Rate', value: '1.8%', change: '-0.3%', up: true },
                  { label: 'Repeat Client Rate', value: '34%', change: '+8%', up: true },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{m.value}</p>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{m.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
