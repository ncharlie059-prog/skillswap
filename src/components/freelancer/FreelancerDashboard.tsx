import { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Search,
  Plus,
  Mail,
  Star,
  Zap,
  Trophy,
  TrendingUp,
  Clock,
  Package,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Order, OrderStatus, FreelancerProfile } from '../../types';
import StatsCard from '../common/StatsCard';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';

// ---------- mock data ----------

const MOCK_FREELANCER_PROFILE: FreelancerProfile = {
  id: 'fp-1',
  user_id: 'u-1',
  headline: 'Full-Stack Developer & UI Designer',
  bio: '',
  portfolio_url: '',
  education: 'B.Tech Computer Science',
  experience_years: 3,
  hourly_rate: 25,
  completion_rate: 96,
  response_rate: 92,
  on_time_delivery: 98,
  total_earnings: 4850,
  total_orders: 24,
  completed_orders: 23,
  xp: 2750,
  level: 7,
  profile_completion: 78,
  created_at: '2025-09-01T00:00:00Z',
  updated_at: '2026-04-20T00:00:00Z',
};

const MOCK_ORDERS: (Order & { client_name: string })[] = [
  {
    id: 'ord-1',
    gig_id: 'gig-1',
    task_id: null,
    client_id: 'c-1',
    freelancer_id: 'u-1',
    title: 'E-commerce Landing Page Design',
    description: 'Design a modern landing page for our new product launch',
    price: 350,
    deadline: '2026-05-10T00:00:00Z',
    status: 'in_progress',
    revisions_count: 0,
    max_revisions: 3,
    files: [],
    created_at: '2026-04-22T10:00:00Z',
    updated_at: '2026-04-22T10:00:00Z',
    client_name: 'Priya Sharma',
  },
  {
    id: 'ord-2',
    gig_id: null,
    task_id: 't-2',
    client_id: 'c-2',
    freelancer_id: 'u-1',
    title: 'React Dashboard with Charts',
    description: 'Build an admin dashboard with real-time data visualization',
    price: 500,
    deadline: '2026-05-15T00:00:00Z',
    status: 'submitted',
    revisions_count: 1,
    max_revisions: 2,
    files: [],
    created_at: '2026-04-18T09:00:00Z',
    updated_at: '2026-04-25T14:00:00Z',
    client_name: 'Arjun Mehta',
  },
  {
    id: 'ord-3',
    gig_id: 'gig-3',
    task_id: null,
    client_id: 'c-3',
    freelancer_id: 'u-1',
    title: 'Mobile App UI Kit',
    description: 'Create a comprehensive UI kit for a food delivery app',
    price: 275,
    deadline: '2026-04-28T00:00:00Z',
    status: 'revision',
    revisions_count: 2,
    max_revisions: 3,
    files: [],
    created_at: '2026-04-10T08:00:00Z',
    updated_at: '2026-04-26T16:00:00Z',
    client_name: 'Sneha Patel',
  },
  {
    id: 'ord-4',
    gig_id: null,
    task_id: 't-4',
    client_id: 'c-4',
    freelancer_id: 'u-1',
    title: 'Python Script for Data Scraping',
    description: 'Automated web scraper for research data collection',
    price: 150,
    deadline: '2026-04-20T00:00:00Z',
    status: 'completed',
    revisions_count: 0,
    max_revisions: 2,
    files: [],
    created_at: '2026-04-05T11:00:00Z',
    updated_at: '2026-04-19T17:00:00Z',
    client_name: 'Rohan Gupta',
  },
  {
    id: 'ord-5',
    gig_id: 'gig-5',
    task_id: null,
    client_id: 'c-5',
    freelancer_id: 'u-1',
    title: 'WordPress Blog Customization',
    description: 'Customize theme and add essential plugins',
    price: 200,
    deadline: '2026-04-12T00:00:00Z',
    status: 'reviewed',
    revisions_count: 1,
    max_revisions: 2,
    files: [],
    created_at: '2026-03-28T07:00:00Z',
    updated_at: '2026-04-11T12:00:00Z',
    client_name: 'Kavita Reddy',
  },
];

const MOCK_EARNINGS: { month: string; amount: number }[] = [
  { month: 'Nov', amount: 620 },
  { month: 'Dec', amount: 890 },
  { month: 'Jan', amount: 740 },
  { month: 'Feb', amount: 1100 },
  { month: 'Mar', amount: 950 },
  { month: 'Apr', amount: 1250 },
];

const MOCK_XP_THRESHOLDS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 200 },
  { level: 3, xpRequired: 500 },
  { level: 4, xpRequired: 900 },
  { level: 5, xpRequired: 1400 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 2700 },
  { level: 8, xpRequired: 3500 },
  { level: 9, xpRequired: 4500 },
  { level: 10, xpRequired: 5700 },
];

// ---------- helpers ----------

const statusVariantMap: Record<OrderStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  open: 'info',
  in_progress: 'warning',
  submitted: 'info',
  revision: 'warning',
  completed: 'success',
  reviewed: 'success',
  cancelled: 'danger',
};

const statusLabelMap: Record<OrderStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  revision: 'Revision',
  completed: 'Completed',
  reviewed: 'Reviewed',
  cancelled: 'Cancelled',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ---------- component ----------

export default function FreelancerDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  // Use profile data if available, otherwise fall back to mock
  const displayName = profile?.full_name || 'Alex Rivera';
  const freelancerProfile = MOCK_FREELANCER_PROFILE;

  // Level / XP calculations
  const currentLevel = freelancerProfile.level;
  const currentXP = freelancerProfile.xp;
  const currentThreshold = MOCK_XP_THRESHOLDS.find(t => t.level === currentLevel) || MOCK_XP_THRESHOLDS[0];
  const nextThreshold = MOCK_XP_THRESHOLDS.find(t => t.level === currentLevel + 1);
  const xpInCurrentLevel = currentXP - currentThreshold.xpRequired;
  const xpForNextLevel = nextThreshold ? nextThreshold.xpRequired - currentThreshold.xpRequired : currentThreshold.xpRequired;

  // Filter orders
  const activeStatuses: OrderStatus[] = ['in_progress', 'submitted', 'revision'];
  const displayedOrders =
    activeTab === 'active'
      ? MOCK_ORDERS.filter(o => activeStatuses.includes(o.status))
      : MOCK_ORDERS;

  // Earnings chart max
  const maxEarning = Math.max(...MOCK_EARNINGS.map(e => e.amount));

  // Recent month earnings
  const thisMonthEarnings = MOCK_EARNINGS[MOCK_EARNINGS.length - 1].amount;

  // Quick actions
  const quickActions = [
    { label: 'Browse Tasks', icon: Search, href: '/marketplace/tasks', color: 'from-emerald-500 to-teal-600' },
    { label: 'Create Gig', icon: Plus, href: '/freelancer/gigs/new', color: 'from-teal-500 to-cyan-600' },
    { label: 'View Messages', icon: Mail, href: '/messages', color: 'from-emerald-600 to-green-600' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* ===== Welcome Header ===== */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <circle cx="350" cy="30" r="120" fill="white" />
              <circle cx="50" cy="180" r="80" fill="white" />
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Welcome back, {displayName.split(' ')[0]}!
                </h1>
                <p className="mt-1 text-emerald-100 text-sm sm:text-base">
                  {freelancerProfile.headline}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                <Trophy className="h-5 w-5 text-amber-300" />
                <div>
                  <p className="text-xs text-emerald-100">Level {currentLevel}</p>
                  <p className="text-sm font-semibold">{currentXP.toLocaleString()} XP</p>
                </div>
              </div>
            </div>
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-emerald-100">Profile Completion</span>
                <span className="text-xs font-semibold">{freelancerProfile.profile_completion}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${freelancerProfile.profile_completion}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stats Grid ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            label="Active Orders"
            value={MOCK_ORDERS.filter(o => activeStatuses.includes(o.status)).length}
            icon={<Briefcase className="h-5 w-5" />}
            trend={{ value: 12, positive: true }}
            color="emerald"
          />
          <StatsCard
            label="This Month"
            value={formatCurrency(thisMonthEarnings)}
            icon={<DollarSign className="h-5 w-5" />}
            trend={{ value: 31, positive: true }}
            color="blue"
          />
          <StatsCard
            label="Completion Rate"
            value={`${freelancerProfile.completion_rate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            trend={{ value: 2, positive: true }}
            color="amber"
          />
          <StatsCard
            label="Response Rate"
            value={`${freelancerProfile.response_rate}%`}
            icon={<MessageSquare className="h-5 w-5" />}
            trend={{ value: 5, positive: true }}
            color="rose"
          />
        </section>

        {/* ===== Main Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Recent Orders + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Orders */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Recent Orders
                </h2>
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'active'
                        ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'all'
                        ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              {displayedOrders.length === 0 ? (
                <div className="p-10 text-center text-slate-400 dark:text-slate-500">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No orders to display</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {displayedOrders.map(order => (
                    <li
                      key={order.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors duration-150 cursor-pointer group"
                    >
                      <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {order.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{order.client_name}</span>
                          <span className="hidden sm:inline">&middot;</span>
                          <span className="hidden sm:inline">{formatDate(order.created_at)}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 hidden sm:block">
                          {formatCurrency(order.price)}
                        </span>
                        <Badge
                          label={statusLabelMap[order.status]}
                          variant={statusVariantMap[order.status]}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
                  View All Orders
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map(action => (
                <a
                  key={action.label}
                  href={action.href}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {action.label === 'Browse Tasks' && 'Find new opportunities'}
                    {action.label === 'Create Gig' && 'Showcase your skills'}
                    {action.label === 'View Messages' && 'Stay in touch'}
                  </p>
                  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                </a>
              ))}
            </section>
          </div>

          {/* Right Column: Earnings Chart + XP/Level */}
          <div className="space-y-6">

            {/* Earnings Chart */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  Earnings
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">Last 6 months</span>
              </div>
              <div className="flex items-end justify-between gap-2" style={{ height: '140px' }}>
                {MOCK_EARNINGS.map(entry => {
                  const heightPercent = Math.max((entry.amount / maxEarning) * 100, 5);
                  const isLatest = entry === MOCK_EARNINGS[MOCK_EARNINGS.length - 1];
                  return (
                    <div key={entry.month} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {formatCurrency(entry.amount).replace(/[^\d.]/g, '').slice(0, 5)}
                      </span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                            isLatest
                              ? 'bg-gradient-to-t from-emerald-600 to-teal-500'
                              : 'bg-emerald-200/60 dark:bg-emerald-800/40'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-medium ${isLatest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {entry.month}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Earned</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatCurrency(freelancerProfile.total_earnings)}
                </span>
              </div>
            </section>

            {/* XP & Level Progress */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Zap className="h-4.5 w-4.5 text-amber-500" />
                XP & Level
              </h2>

              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-2xl font-bold text-white">{currentLevel}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-amber-900 fill-amber-900" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Level {currentLevel} {nextThreshold ? 'Freelancer' : 'Master'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentXP.toLocaleString()} XP total
                  </p>
                  {nextThreshold && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {(nextThreshold.xpRequired - currentXP).toLocaleString()} XP to Level {currentLevel + 1}
                    </p>
                  )}
                </div>
              </div>

              <ProgressBar
                value={nextThreshold ? xpInCurrentLevel : xpForNextLevel}
                max={nextThreshold ? xpForNextLevel : xpForNextLevel}
                color="emerald"
                size="md"
                showLabel
              />

              {/* Level milestones */}
              <div className="mt-5 space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Level Milestones
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {MOCK_XP_THRESHOLDS.slice(0, 10).map(t => {
                    const isUnlocked = currentLevel >= t.level;
                    const isCurrent = currentLevel === t.level;
                    return (
                      <div
                        key={t.level}
                        className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors duration-200 ${
                          isCurrent
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-700'
                            : isUnlocked
                              ? 'bg-slate-50 dark:bg-slate-700/50'
                              : 'bg-slate-50 dark:bg-slate-800/50 opacity-40'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : isUnlocked ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                          {t.level}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {t.xpRequired >= 1000 ? `${(t.xpRequired / 1000).toFixed(1)}k` : t.xpRequired}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats summary */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-teal-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">On-Time</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{freelancerProfile.on_time_delivery}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Completed</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{freelancerProfile.completed_orders}/{freelancerProfile.total_orders}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
