import { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle,
  Star,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Task } from '../../types';
import type { BadgeProps } from '../common/Badge';
import StatsCard from '../common/StatsCard';
import Badge from '../common/Badge';

// ---------------------------------------------------------------------------
// Mock / Demo Data
// ---------------------------------------------------------------------------

const MOCK_TASKS: (Task & { applications_count: number })[] = [
  {
    id: '1',
    client_id: 'demo',
    category_id: 'cat-1',
    title: 'Mobile App UI Design for Campus Events',
    description: 'Design a modern mobile app interface for campus event discovery.',
    budget_min: 200,
    budget_max: 500,
    deadline: '2026-05-15',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 87,
    applications_count: 12,
    created_at: '2026-04-20',
    updated_at: '2026-04-20',
  },
  {
    id: '2',
    client_id: 'demo',
    category_id: 'cat-2',
    title: 'Full-Stack Study Group Platform',
    description: 'Build a web platform for creating and managing study groups.',
    budget_min: 800,
    budget_max: 1500,
    deadline: '2026-06-01',
    status: 'in_progress',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 142,
    applications_count: 8,
    created_at: '2026-04-10',
    updated_at: '2026-04-22',
  },
  {
    id: '3',
    client_id: 'demo',
    category_id: 'cat-3',
    title: 'Logo Design for Tech Society',
    description: 'Create a professional logo for the campus tech society.',
    budget_min: 50,
    budget_max: 150,
    deadline: null,
    status: 'completed',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 34,
    applications_count: 5,
    created_at: '2026-03-15',
    updated_at: '2026-04-01',
  },
  {
    id: '4',
    client_id: 'demo',
    category_id: 'cat-4',
    title: 'Data Analysis for Research Project',
    description: 'Analyze survey data and create visualizations.',
    budget_min: 300,
    budget_max: 600,
    deadline: '2026-04-30',
    status: 'cancelled',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 56,
    applications_count: 3,
    created_at: '2026-03-28',
    updated_at: '2026-04-05',
  },
  {
    id: '5',
    client_id: 'demo',
    category_id: 'cat-5',
    title: 'WordPress Site for Student Club',
    description: 'Set up and customize a WordPress site for a student organization.',
    budget_min: 100,
    budget_max: 250,
    deadline: '2026-05-20',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 29,
    applications_count: 6,
    created_at: '2026-04-25',
    updated_at: '2026-04-25',
  },
];

interface RecentHire {
  id: string;
  name: string;
  avatar: string;
  task: string;
  rating: number;
  hiredDate: string;
  initials: string;
}

const MOCK_RECENT_HIRES: RecentHire[] = [
  {
    id: 'f1',
    name: 'Aisha Patel',
    avatar: '',
    task: 'Full-Stack Study Group Platform',
    rating: 4.9,
    hiredDate: '2026-04-22',
    initials: 'AP',
  },
  {
    id: 'f2',
    name: 'Marcus Chen',
    avatar: '',
    task: 'Logo Design for Tech Society',
    rating: 5.0,
    hiredDate: '2026-04-01',
    initials: 'MC',
  },
  {
    id: 'f3',
    name: 'Sofia Rodriguez',
    avatar: '',
    task: 'Data Analysis for Research Project',
    rating: 4.7,
    hiredDate: '2026-03-30',
    initials: 'SR',
  },
];

const SPENDING_DATA = [
  { month: 'Nov', amount: 320 },
  { month: 'Dec', amount: 580 },
  { month: 'Jan', amount: 450 },
  { month: 'Feb', amount: 720 },
  { month: 'Mar', amount: 890 },
  { month: 'Apr', amount: 1100 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusVariantMap: Record<Task['status'], BadgeProps['variant']> = {
  open: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger',
};

const statusLabelMap: Record<Task['status'], string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | Task['status']>('all');

  const companyName = 'TechVenture Labs'; // demo company name
  const userName = profile?.full_name || 'Alex Morgan';

  // Stats
  const activeTasks = MOCK_TASKS.filter(
    (t) => t.status === 'open' || t.status === 'in_progress'
  ).length;
  const totalSpent = 2670;
  const hiredFreelancers = MOCK_RECENT_HIRES.length;
  const openApplications = MOCK_TASKS.reduce(
    (sum, t) => sum + t.applications_count,
    0
  );

  // Filtering
  const filteredTasks =
    activeTab === 'all'
      ? MOCK_TASKS
      : MOCK_TASKS.filter((t) => t.status === activeTab);

  const maxSpending = Math.max(...SPENDING_DATA.map((d) => d.amount));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---------------------------------------------------------------- */}
        {/* Welcome Header                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, {userName}
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              {companyName} &middot; Here is what is happening with your projects
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]">
            <Plus className="w-5 h-5" />
            Post a Task
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats Grid                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            label="Active Tasks"
            value={activeTasks}
            icon={<Briefcase className="w-6 h-6" />}
            trend={{ value: 12, positive: true }}
            color="emerald"
          />
          <StatsCard
            label="Total Spent"
            value={formatCurrency(totalSpent)}
            icon={<DollarSign className="w-6 h-6" />}
            trend={{ value: 8, positive: true }}
            color="blue"
          />
          <StatsCard
            label="Hired Freelancers"
            value={hiredFreelancers}
            icon={<Users className="w-6 h-6" />}
            trend={{ value: 25, positive: true }}
            color="amber"
          />
          <StatsCard
            label="Open Applications"
            value={openApplications}
            icon={<FileText className="w-6 h-6" />}
            trend={{ value: 5, positive: false }}
            color="rose"
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Content: Tasks + Sidebar                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Recent Tasks */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    My Recent Tasks
                  </h2>
                  <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 transition-colors duration-200">
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {(['all', 'open', 'in_progress', 'completed', 'cancelled'] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                          activeTab === tab
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {tab === 'all'
                          ? 'All'
                          : statusLabelMap[tab]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Task list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTasks.length === 0 && (
                  <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No tasks match this filter.
                  </div>
                )}
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {task.title}
                          </h3>
                          <Badge
                            label={statusLabelMap[task.status]}
                            variant={statusVariantMap[task.status]}
                          />
                          {task.is_urgent && (
                            <Badge label="Urgent" variant="danger" size="sm" />
                          )}
                          {task.is_micro && (
                            <Badge label="Micro" variant="default" size="sm" />
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {formatCurrency(task.budget_min)} &ndash;{' '}
                            {formatCurrency(task.budget_max)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {task.views}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {task.applications_count} applications
                          </span>
                          {task.deadline && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Spending Overview                                                 */}
            {/* ---------------------------------------------------------------- */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Spending Overview
                </h2>
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +18% this month
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-3 h-44">
                {SPENDING_DATA.map((item) => {
                  const heightPct = (item.amount / maxSpending) * 100;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {formatCurrency(item.amount)}
                      </span>
                      <div className="w-full relative group">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 transition-all duration-500 hover:from-emerald-400 hover:to-teal-300 cursor-pointer"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Summary row */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total this period
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(
                      SPENDING_DATA.reduce((s, d) => s + d.amount, 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Monthly average
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(
                      Math.round(
                        SPENDING_DATA.reduce((s, d) => s + d.amount, 0) /
                          SPENDING_DATA.length
                      )
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest month
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(maxSpending)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    label: 'Post a Task',
                    icon: Plus,
                    color:
                      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
                  },
                  {
                    label: 'Browse Gigs',
                    icon: Briefcase,
                    color:
                      'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
                  },
                  {
                    label: 'View Messages',
                    icon: MessageSquare,
                    color:
                      'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
                  },
                  {
                    label: 'Add Funds',
                    icon: DollarSign,
                    color:
                      'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} transition-transform duration-200 group-hover:scale-110`}
                    >
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 text-left">
                      {action.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Hires */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Recent Hires
                </h2>
                <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 transition-colors duration-200">
                  All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {MOCK_RECENT_HIRES.map((hire) => (
                  <div
                    key={hire.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {hire.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {hire.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {hire.task}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {hire.rating}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatDate(hire.hiredDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity tip card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <h3 className="font-semibold text-sm">Pro Tip</h3>
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Tasks with clear descriptions and realistic budgets receive{' '}
                <span className="font-semibold text-white">3x more</span>{' '}
                qualified applications. Be specific about your requirements!
              </p>
              <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-emerald-100 transition-colors duration-200">
                Learn more <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
