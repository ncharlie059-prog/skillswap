import { useState, useMemo, useCallback } from 'react';
import {
  Zap,
  Clock,
  DollarSign,
  Flame,
  Filter,
  Search,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Task } from '../../types';
import Badge from '../common/Badge';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_MICRO_TASKS: Task[] = [
  {
    id: 'mt-1',
    client_id: 'c-1',
    category_id: 'cat-4',
    title: 'Write Product Descriptions for 10 Items',
    description:
      'We need compelling, conversion-focused product descriptions for our campus merch store. Each description should be 150-200 words with SEO keywords.',
    budget_min: 500,
    budget_max: 1500,
    deadline: '2026-04-28T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 90,
    applications_count: 12,
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-4', name: 'Content Writing', slug: 'content-writing', icon: 'pen', created_at: '' },
    skills: [
      { id: 'sk-8', name: 'SEO', created_at: '' },
      { id: 'sk-6', name: 'WordPress', created_at: '' },
    ],
    client: {
      id: 'c-1',
      email: 'store@campus.edu',
      full_name: 'Campus Merch Co.',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'UCLA',
      college_id_verified: true,
      is_verified: false,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-2',
    client_id: 'c-2',
    category_id: 'cat-6',
    title: 'Clean and Analyze Survey Dataset',
    description:
      'We have a 2000-row survey dataset with missing values and inconsistent formatting. Need it cleaned, analyzed, and visualized with key insights.',
    budget_min: 1000,
    budget_max: 2000,
    deadline: '2026-04-29T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 145,
    applications_count: 7,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
    category: { id: 'cat-6', name: 'Data & Analytics', slug: 'data-analytics', icon: 'chart', created_at: '' },
    skills: [{ id: 'sk-3', name: 'Python', created_at: '' }],
    client: {
      id: 'c-2',
      email: 'research@campus.edu',
      full_name: 'Psych Research Lab',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'Yale',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-3',
    client_id: 'c-3',
    category_id: 'cat-3',
    title: 'Edit a 5-Minute Promo Video',
    description:
      'Need a professional edit for a campus startup promo video. Raw footage will be provided. Color grading, transitions, and background music required.',
    budget_min: 800,
    budget_max: 1800,
    deadline: '2026-04-27T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: true,
    views: 95,
    applications_count: 9,
    created_at: '2026-04-23T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-3', name: 'Video Editing', slug: 'video-editing', icon: 'video', created_at: '' },
    skills: [{ id: 'sk-5', name: 'Premiere Pro', created_at: '' }],
    client: {
      id: 'c-3',
      email: 'media@campus.edu',
      full_name: 'Campus Media Lab',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'NID Ahmedabad',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-4',
    client_id: 'c-4',
    category_id: 'cat-1',
    title: 'Fix React Component Bugs',
    description:
      'We have 3 React components with rendering issues. Need someone to debug and fix them. Quick turnaround required.',
    budget_min: 300,
    budget_max: 800,
    deadline: '2026-04-28T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 200,
    applications_count: 15,
    created_at: '2026-04-25T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', created_at: '' },
    skills: [
      { id: 'sk-1', name: 'React', created_at: '' },
      { id: 'sk-10', name: 'TypeScript', created_at: '' },
    ],
    client: {
      id: 'c-4',
      email: 'dev@campus.edu',
      full_name: 'DevHub Team',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-5',
    client_id: 'c-5',
    category_id: 'cat-2',
    title: 'Design 5 Instagram Story Templates',
    description:
      'Create 5 branded Instagram story templates for a campus food festival. Must be editable in Canva. Brand colors and logo provided.',
    budget_min: 400,
    budget_max: 1000,
    deadline: '2026-04-30T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: false,
    views: 75,
    applications_count: 6,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-2', name: 'Graphic Design', slug: 'graphic-design', icon: 'palette', created_at: '' },
    skills: [
      { id: 'sk-2', name: 'Figma', created_at: '' },
      { id: 'sk-9', name: 'Photoshop', created_at: '' },
    ],
    client: {
      id: 'c-5',
      email: 'fest@campus.edu',
      full_name: 'Campus Food Fest',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'NIFT Delhi',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-6',
    client_id: 'c-6',
    category_id: 'cat-7',
    title: 'Set Up Google Analytics for Website',
    description:
      'Install and configure Google Analytics 4 on our campus newspaper website. Set up key event tracking and a basic dashboard.',
    budget_min: 600,
    budget_max: 1200,
    deadline: '2026-05-01T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 55,
    applications_count: 3,
    created_at: '2026-04-25T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-7', name: 'Marketing', slug: 'marketing', icon: 'megaphone', created_at: '' },
    skills: [{ id: 'sk-8', name: 'SEO', created_at: '' }],
    client: {
      id: 'c-6',
      email: 'news@campus.edu',
      full_name: 'Campus Chronicle',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'JNU Delhi',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-7',
    client_id: 'c-7',
    category_id: 'cat-1',
    title: 'Create a Landing Page with Next.js',
    description:
      'Build a single-page landing site for our hackathon. Must include registration form, countdown timer, and sponsor logos. Deploy to Vercel.',
    budget_min: 1500,
    budget_max: 2000,
    deadline: '2026-04-29T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 310,
    applications_count: 18,
    created_at: '2026-04-24T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', created_at: '' },
    skills: [
      { id: 'sk-1', name: 'React', created_at: '' },
      { id: 'sk-10', name: 'TypeScript', created_at: '' },
    ],
    client: {
      id: 'c-7',
      email: 'hack@campus.edu',
      full_name: 'HackCampus Org',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIIT Hyderabad',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'mt-8',
    client_id: 'c-8',
    category_id: 'cat-4',
    title: 'Proofread a 10-Page Research Paper',
    description:
      'Need a thorough proofread of a computer science research paper before submission. Check grammar, formatting, and citation consistency.',
    budget_min: 200,
    budget_max: 500,
    deadline: '2026-04-28T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 40,
    applications_count: 11,
    created_at: '2026-04-25T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: { id: 'cat-4', name: 'Content Writing', slug: 'content-writing', icon: 'pen', created_at: '' },
    skills: [{ id: 'sk-8', name: 'SEO', created_at: '' }],
    client: {
      id: 'c-8',
      email: 'phd@campus.edu',
      full_name: 'CS Research Scholar',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IISc Bangalore',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DeadlineFilter = 'all' | '24h' | '48h' | '72h';
type BudgetFilter = 'all' | '100-500' | '500-1000' | '1000-2000';

interface FilterState {
  deadline: DeadlineFilter;
  budget: BudgetFilter;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function hoursUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
}

function getDeadlineBadgeVariant(hours: number | null): 'danger' | 'warning' | 'default' {
  if (hours === null) return 'default';
  if (hours <= 24) return 'danger';
  if (hours <= 48) return 'warning';
  return 'default';
}

function getDeadlineLabel(hours: number | null): string {
  if (hours === null) return 'No deadline';
  if (hours <= 24) return `${hours}h left`;
  const days = Math.ceil(hours / 24);
  return `${days}d left`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MicroTasksPage() {
  const { profile: _profile } = useAuth();

  /* --- State --- */
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    deadline: 'all',
    budget: 'all',
  });
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);

  /* --- Computed stats --- */
  const quickStats = useMemo(() => {
    const openTasks = MOCK_MICRO_TASKS.filter((t) => t.status === 'open');
    const urgentCount = openTasks.filter((t) => t.is_urgent).length;
    const avgBudget =
      openTasks.length > 0
        ? Math.round(
            openTasks.reduce((sum, t) => sum + (t.budget_min + t.budget_max) / 2, 0) / openTasks.length
          )
        : 0;
    return {
      available: openTasks.length,
      avgBudget,
      urgentCount,
    };
  }, []);

  /* --- Filtered tasks --- */
  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_MICRO_TASKS.filter((t) => {
      if (t.status !== 'open') return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;

      const hours = hoursUntil(t.deadline);
      switch (filters.deadline) {
        case '24h':
          if (hours === null || hours > 24) return false;
          break;
        case '48h':
          if (hours === null || hours > 48) return false;
          break;
        case '72h':
          if (hours === null || hours > 72) return false;
          break;
      }

      switch (filters.budget) {
        case '100-500':
          if (t.budget_min < 100 || t.budget_max > 500) return false;
          break;
        case '500-1000':
          if (t.budget_max < 500 || t.budget_min > 1000) return false;
          break;
        case '1000-2000':
          if (t.budget_max < 1000) return false;
          break;
      }

      return true;
    }).sort((a, b) => {
      // Urgent tasks first, then by deadline
      if (a.is_urgent && !b.is_urgent) return -1;
      if (!a.is_urgent && b.is_urgent) return 1;
      const ha = hoursUntil(a.deadline) ?? Infinity;
      const hb = hoursUntil(b.deadline) ?? Infinity;
      return ha - hb;
    });
  }, [searchQuery, filters]);

  /* --- Handlers --- */
  const handleQuickApply = useCallback((taskId: string) => {
    if (appliedIds.has(taskId)) return;
    setApplyingId(taskId);
    // Simulate a brief network delay
    setTimeout(() => {
      setAppliedIds((prev) => new Set(prev).add(taskId));
      setApplyingId(null);
    }, 600);
  }, [appliedIds]);

  const clearFilters = () => {
    setFilters({ deadline: 'all', budget: 'all' });
    setSearchQuery('');
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ===== Header ===== */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-emerald-700 dark:from-teal-900 dark:via-emerald-900 dark:to-slate-950 p-6 sm:p-8 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <circle cx="360" cy="40" r="100" fill="white" />
              <circle cx="40" cy="170" r="60" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-6 h-6 text-amber-300" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Micro Tasks</h1>
              </div>
              <p className="text-teal-100 text-sm sm:text-base max-w-xl">
                Quick gigs with 24-72 hour deadlines. Perfect for earning between classes with skills you already have.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
              <Flame className="w-5 h-5 text-amber-300" />
              <span className="text-sm font-semibold">
                {quickStats.urgentCount} urgent task{quickStats.urgentCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Quick Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Available Micro-Tasks</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{quickStats.available}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg. Budget</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatCurrency(quickStats.avgBudget)}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Urgent Tasks</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{quickStats.urgentCount}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Search + Filter Bar ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search micro-tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Deadline filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
            <Clock className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
            {([
              { key: 'all' as DeadlineFilter, label: 'All' },
              { key: '24h' as DeadlineFilter, label: '24h' },
              { key: '48h' as DeadlineFilter, label: '48h' },
              { key: '72h' as DeadlineFilter, label: '72h' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilters((p) => ({ ...p, deadline: key }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filters.deadline === key
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Budget filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
            <DollarSign className="w-4 h-4 text-slate-400 ml-2 flex-shrink-0" />
            {([
              { key: 'all' as BudgetFilter, label: 'All' },
              { key: '100-500' as BudgetFilter, label: '100-500' },
              { key: '500-1000' as BudgetFilter, label: '500-1K' },
              { key: '1000-2000' as BudgetFilter, label: '1K-2K' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilters((p) => ({ ...p, budget: key }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filters.budget === key
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Active filter indicators ===== */}
        {(filters.deadline !== 'all' || filters.budget !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Showing:
            </span>
            {filters.deadline !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                Within {filters.deadline}
              </span>
            )}
            {filters.budget !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                {filters.budget === '1000-2000'
                  ? '₹1,000 - ₹2,000'
                  : `₹${filters.budget.replace('-', ' - ₹')}`}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                "{searchQuery}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ===== Micro Task Cards ===== */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No micro tasks available</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Check back later or try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTasks.map((task) => {
              const hours = hoursUntil(task.deadline);
              const deadlineVariant = getDeadlineBadgeVariant(hours);
              const deadlineLabel = getDeadlineLabel(hours);
              const isApplied = appliedIds.has(task.id);
              const isApplying = applyingId === task.id;

              return (
                <div
                  key={task.id}
                  className={`group bg-white dark:bg-slate-800 rounded-xl border overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 ${
                    task.is_urgent
                      ? 'border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="p-4">
                    {/* Urgent banner */}
                    {task.is_urgent && (
                      <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 -mx-1">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">Urgent</span>
                      </div>
                    )}

                    {/* Top row: deadline badge + category */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge label={deadlineLabel} variant={deadlineVariant} size="sm" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        {task.category?.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {task.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Skills */}
                    {task.skills && task.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {task.skills.slice(0, 2).map((s) => (
                          <Badge key={s.id} label={s.name} variant="default" size="sm" />
                        ))}
                        {task.skills.length > 2 && (
                          <Badge label={`+${task.skills.length - 2}`} variant="default" size="sm" />
                        )}
                      </div>
                    )}

                    {/* Client */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[8px] font-bold">
                        {getInitials(task.client?.full_name ?? 'C')}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {task.client?.full_name}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-3 border-t border-slate-100 dark:border-slate-700" />

                    {/* Bottom: budget + CTA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {formatCurrency(task.budget_min)}
                        </span>
                        {task.budget_max > task.budget_min && (
                          <>
                            <span className="text-xs text-slate-400">-</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {formatCurrency(task.budget_max)}
                            </span>
                          </>
                        )}
                      </div>

                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQuickApply(task.id)}
                          disabled={isApplying}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-wait text-white text-xs font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                        >
                          {isApplying ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              Quick Apply
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Applications count */}
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{task.applications_count} application{task.applications_count !== 1 ? 's' : ''}</span>
                      <span>{task.views} views</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== Results summary ===== */}
        {filteredTasks.length > 0 && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredTasks.length} micro-task{filteredTasks.length !== 1 ? 's' : ''} &middot; Budgets range {formatCurrency(100)} - {formatCurrency(2000)}
          </div>
        )}
      </div>
    </div>
  );
}
