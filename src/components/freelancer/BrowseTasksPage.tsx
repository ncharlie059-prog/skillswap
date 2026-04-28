import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Zap,
  ChevronDown,
  X,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Task, Category, Skill } from '../../types';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', created_at: '' },
  { id: 'cat-2', name: 'Graphic Design', slug: 'graphic-design', icon: 'palette', created_at: '' },
  { id: 'cat-3', name: 'Video Editing', slug: 'video-editing', icon: 'video', created_at: '' },
  { id: 'cat-4', name: 'Content Writing', slug: 'content-writing', icon: 'pen', created_at: '' },
  { id: 'cat-5', name: 'Mobile Apps', slug: 'mobile-apps', icon: 'smartphone', created_at: '' },
  { id: 'cat-6', name: 'Data & Analytics', slug: 'data-analytics', icon: 'chart', created_at: '' },
  { id: 'cat-7', name: 'Marketing', slug: 'marketing', icon: 'megaphone', created_at: '' },
  { id: 'cat-8', name: 'Music & Audio', slug: 'music-audio', icon: 'music', created_at: '' },
];

const MOCK_SKILLS: Skill[] = [
  { id: 'sk-1', name: 'React', created_at: '' },
  { id: 'sk-2', name: 'Figma', created_at: '' },
  { id: 'sk-3', name: 'Python', created_at: '' },
  { id: 'sk-4', name: 'Illustrator', created_at: '' },
  { id: 'sk-5', name: 'Premiere Pro', created_at: '' },
  { id: 'sk-6', name: 'WordPress', created_at: '' },
  { id: 'sk-7', name: 'Flutter', created_at: '' },
  { id: 'sk-8', name: 'SEO', created_at: '' },
  { id: 'sk-9', name: 'Photoshop', created_at: '' },
  { id: 'sk-10', name: 'TypeScript', created_at: '' },
];

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    client_id: 'c-1',
    category_id: 'cat-1',
    title: 'Redesign Student Organization Website',
    description:
      'Our campus club needs a complete website overhaul. Must include event calendar, member gallery, and signup form. Current site is outdated and not mobile-friendly.',
    budget_min: 2000,
    budget_max: 5000,
    deadline: '2026-05-20T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 320,
    applications_count: 8,
    created_at: '2026-04-10T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[5]],
    client: {
      id: 'c-1',
      email: 'org@campus.edu',
      full_name: 'Campus Coding Club',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'MIT',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'task-2',
    client_id: 'c-2',
    category_id: 'cat-2',
    title: 'Create Social Media Graphics Pack',
    description:
      'Need 20 branded social media templates for Instagram and LinkedIn. Includes story templates, post templates, and carousel designs with our brand colors.',
    budget_min: 800,
    budget_max: 2000,
    deadline: '2026-05-10T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: true,
    views: 180,
    applications_count: 5,
    created_at: '2026-04-18T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
    category: MOCK_CATEGORIES[1],
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[8]],
    client: {
      id: 'c-2',
      email: 'startup@campus.edu',
      full_name: 'LaunchPad Startup',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'Stanford',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'task-3',
    client_id: 'c-3',
    category_id: 'cat-4',
    title: 'Write Product Descriptions for 10 Items',
    description:
      'We need compelling, conversion-focused product descriptions for our campus merch store. Each description should be 150-200 words with SEO keywords.',
    budget_min: 500,
    budget_max: 1500,
    deadline: '2026-05-02T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 90,
    applications_count: 12,
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: MOCK_CATEGORIES[3],
    skills: [MOCK_SKILLS[7]],
    client: {
      id: 'c-3',
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
    id: 'task-4',
    client_id: 'c-4',
    category_id: 'cat-6',
    title: 'Clean and Analyze Survey Dataset',
    description:
      'We have a 2000-row survey dataset with missing values and inconsistent formatting. Need it cleaned, analyzed, and visualized with key insights in a report.',
    budget_min: 1000,
    budget_max: 3000,
    deadline: '2026-05-05T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 145,
    applications_count: 7,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
    category: MOCK_CATEGORIES[5],
    skills: [MOCK_SKILLS[2]],
    client: {
      id: 'c-4',
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
    id: 'task-5',
    client_id: 'c-5',
    category_id: 'cat-5',
    title: 'Build a Campus Event App Prototype',
    description:
      'Create a high-fidelity prototype for a campus event discovery app. Must include event feed, map view, RSVP functionality, and social features.',
    budget_min: 5000,
    budget_max: 12000,
    deadline: '2026-05-30T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 420,
    applications_count: 15,
    created_at: '2026-04-15T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    skills: [MOCK_SKILLS[6], MOCK_SKILLS[1]],
    client: {
      id: 'c-5',
      email: 'events@campus.edu',
      full_name: 'Campus Events Board',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Delhi',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'task-6',
    client_id: 'c-6',
    category_id: 'cat-7',
    title: 'Design Email Marketing Campaign',
    description:
      'Create a 5-part email sequence for our student discount platform. Includes copywriting, design templates, and A/B testing recommendations.',
    budget_min: 3000,
    budget_max: 7000,
    deadline: '2026-05-15T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 210,
    applications_count: 4,
    created_at: '2026-04-21T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
    category: MOCK_CATEGORIES[6],
    skills: [MOCK_SKILLS[7], MOCK_SKILLS[8]],
    client: {
      id: 'c-6',
      email: 'deals@campus.edu',
      full_name: 'Student Deals Hub',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'BITS Pilani',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
    },
  },
  {
    id: 'task-7',
    client_id: 'c-7',
    category_id: 'cat-3',
    title: 'Edit a 5-Minute Promo Video',
    description:
      'Need a professional edit for a campus startup promo video. Raw footage will be provided. Color grading, transitions, and background music required.',
    budget_min: 1500,
    budget_max: 4000,
    deadline: '2026-05-08T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: true,
    views: 95,
    applications_count: 9,
    created_at: '2026-04-23T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: MOCK_CATEGORIES[2],
    skills: [MOCK_SKILLS[4]],
    client: {
      id: 'c-7',
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
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SortMode = 'newest' | 'budget_high' | 'budget_low' | 'deadline';
type BudgetRange = 'all' | '0-1000' | '1000-3000' | '3000-7000' | '7000+';
type UrgencyFilter = 'all' | 'urgent' | 'standard';

interface FilterState {
  category: string;
  budgetRange: BudgetRange;
  urgency: UrgencyFilter;
  skills: string[];
}

interface ApplyFormData {
  cover_letter: string;
  proposed_budget: number;
  proposed_deadline: string;
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

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

export default function BrowseTasksPage() {
  const { profile: _profile } = useAuth();

  /* --- State --- */
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    budgetRange: 'all',
    urgency: 'all',
    skills: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [visibleCount, setVisibleCount] = useState(8);

  // Apply modal state
  const [applyTask, setApplyTask] = useState<Task | null>(null);
  const [applyForm, setApplyForm] = useState<ApplyFormData>({
    cover_letter: '',
    proposed_budget: 0,
    proposed_deadline: '',
  });
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Quick apply for micro-tasks
  const [quickApplyId, setQuickApplyId] = useState<string | null>(null);

  /* --- Filtered & sorted data --- */
  const budgetInRange = useCallback(
    (min: number, max: number) => {
      switch (filters.budgetRange) {
        case '0-1000':
          return min <= 1000;
        case '1000-3000':
          return min >= 1000 || max >= 1000;
        case '3000-7000':
          return min >= 3000 || max >= 3000;
        case '7000+':
          return max >= 7000;
        default:
          return true;
      }
    },
    [filters.budgetRange]
  );

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = MOCK_TASKS.filter((t) => {
      if (t.status !== 'open') return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      if (filters.category !== 'all' && t.category_id !== filters.category) return false;
      if (!budgetInRange(t.budget_min, t.budget_max)) return false;
      if (filters.urgency === 'urgent' && !t.is_urgent) return false;
      if (filters.urgency === 'standard' && t.is_urgent) return false;
      if (filters.skills.length > 0) {
        const taskSkillNames = (t.skills ?? []).map((s) => s.name);
        if (!filters.skills.some((fs) => taskSkillNames.includes(fs))) return false;
      }
      return true;
    });

    // Sort
    switch (sortMode) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'budget_high':
        result.sort((a, b) => b.budget_max - a.budget_max);
        break;
      case 'budget_low':
        result.sort((a, b) => a.budget_min - b.budget_min);
        break;
      case 'deadline':
        result.sort((a, b) => {
          const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return da - db;
        });
        break;
    }

    return result;
  }, [searchQuery, filters, sortMode, budgetInRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.budgetRange !== 'all') count++;
    if (filters.urgency !== 'all') count++;
    if (filters.skills.length > 0) count++;
    return count;
  }, [filters]);

  const displayedTasks = filteredTasks.slice(0, visibleCount);
  const hasMore = filteredTasks.length > visibleCount;

  /* --- Handlers --- */
  const clearFilters = () => {
    setFilters({ category: 'all', budgetRange: 'all', urgency: 'all', skills: [] });
    setSearchQuery('');
  };

  const toggleSkill = (skillName: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter((s) => s !== skillName)
        : [...prev.skills, skillName],
    }));
  };

  const openApplyModal = (task: Task) => {
    setApplyTask(task);
    setApplyForm({
      cover_letter: '',
      proposed_budget: task.budget_min,
      proposed_deadline: task.deadline ?? '',
    });
    setApplySubmitted(false);
  };

  const handleApply = useCallback(() => {
    if (!applyForm.cover_letter.trim()) return;
    // In production, this would call supabase
    setApplySubmitted(true);
  }, [applyForm]);

  const handleQuickApply = useCallback((taskId: string) => {
    setQuickApplyId(taskId);
    setTimeout(() => setQuickApplyId(null), 2000);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ===== Header ===== */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-950 p-6 sm:p-8 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <circle cx="350" cy="30" r="120" fill="white" />
              <circle cx="50" cy="180" r="80" fill="white" />
            </svg>
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse Tasks</h1>
            <p className="mt-1 text-emerald-100 text-sm sm:text-base max-w-xl">
              Find projects posted by clients across campus. Filter by category, budget, and skills to discover your next opportunity.
            </p>
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(8);
              }}
              placeholder="Search tasks by title or description..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
              <option value="deadline">Deadline: Soonest</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== Active filter chips ===== */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Active filters:</span>
            {filters.category !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {MOCK_CATEGORIES.find((c) => c.id === filters.category)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.budgetRange !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, budgetRange: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.budgetRange === '7000+'
                  ? '₹7000+'
                  : `₹${filters.budgetRange.replace('-', ' - ₹')}`}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.urgency !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, urgency: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.urgency === 'urgent' ? 'Urgent Only' : 'Standard Only'}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.skills.map((s) => (
              <button
                key={s}
                onClick={() => toggleSkill(s)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {s}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ===== Layout: Filters + Content ===== */}
        <div className="flex gap-8">
          {/* Filter sidebar */}
          <aside
            className={`${
              showFilters
                ? 'fixed inset-0 z-40 bg-black/40 lg:relative lg:bg-transparent'
                : 'hidden lg:block'
            }`}
          >
            <div
              className={`${
                showFilters
                  ? 'fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl lg:relative lg:shadow-none lg:w-full'
                  : 'w-full'
              } p-5 lg:p-0 overflow-y-auto`}
            >
              {/* Mobile close */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === 'all'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {MOCK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.category === cat.id
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Budget Range</h4>
                <div className="space-y-1">
                  {([
                    ['all', 'Any Budget'],
                    ['0-1000', 'Under ₹1,000'],
                    ['1000-3000', '₹1,000 - ₹3,000'],
                    ['3000-7000', '₹3,000 - ₹7,000'],
                    ['7000+', '₹7,000+'],
                  ] as [BudgetRange, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, budgetRange: val }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.budgetRange === val
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Urgency</h4>
                <div className="space-y-1">
                  {([
                    ['all', 'All Tasks'],
                    ['urgent', 'Urgent Only'],
                    ['standard', 'Standard Only'],
                  ] as [UrgencyFilter, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, urgency: val }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.urgency === val
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {MOCK_SKILLS.map((skill) => {
                    const active = filters.skills.includes(skill.name);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          active
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear All Filters ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
            </div>

            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No tasks found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedTasks.map((task) => {
                  const daysLeft = daysUntil(task.deadline);
                  const isMicro = task.is_micro;

                  return (
                    <div
                      key={task.id}
                      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                    >
                      <div className="p-5">
                        {/* Badges row */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge label={task.category?.name ?? ''} variant="info" size="sm" />
                          {task.is_urgent && <Badge label="Urgent" variant="danger" size="sm" />}
                          {isMicro && <Badge label="Micro Task" variant="warning" size="sm" />}
                          {task.is_instant_hire && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <Zap className="w-3 h-3" />
                              Instant Hire
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {task.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Client info */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold">
                            {getInitials(task.client?.full_name ?? 'C')}
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {task.client?.full_name}
                          </span>
                          {task.client?.college_id_verified && (
                            <Badge label="Verified" variant="success" size="sm" />
                          )}
                        </div>

                        {/* Skills */}
                        {task.skills && task.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {task.skills.map((s) => (
                              <Badge key={s.id} label={s.name} variant="default" size="sm" />
                            ))}
                          </div>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 gap-3">
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Budget */}
                            <div className="flex items-center gap-1.5 text-sm">
                              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {formatCurrency(task.budget_min)}
                              </span>
                              <span className="text-slate-400">-</span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {formatCurrency(task.budget_max)}
                              </span>
                            </div>
                            {/* Deadline */}
                            {daysLeft !== null && (
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span
                                  className={`${
                                    daysLeft <= 3
                                      ? 'text-red-600 dark:text-red-400 font-semibold'
                                      : 'text-slate-500 dark:text-slate-400'
                                  }`}
                                >
                                  {daysLeft}d left
                                </span>
                              </div>
                            )}
                            {/* Applications */}
                            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>{task.applications_count} application{task.applications_count !== 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* CTA */}
                          {isMicro ? (
                            <button
                              onClick={() => handleQuickApply(task.id)}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                quickApplyId === task.id
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30'
                              }`}
                            >
                              {quickApplyId === task.id ? (
                                <>
                                  <Star className="w-3.5 h-3.5" />
                                  Applied!
                                </>
                              ) : (
                                <>
                                  <Zap className="w-3.5 h-3.5" />
                                  Quick Apply
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => openApplyModal(task)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                            >
                              Apply Now
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all shadow-sm"
                >
                  Load More
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Apply Modal ===== */}
      <Modal
        isOpen={!!applyTask}
        onClose={() => {
          setApplyTask(null);
          setApplySubmitted(false);
        }}
        title={applySubmitted ? 'Application Submitted!' : `Apply: ${applyTask?.title ?? ''}`}
        size="lg"
      >
        {applySubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Your application has been sent!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              The client will review your proposal and get back to you. You can track the status in your applications dashboard.
            </p>
            <button
              onClick={() => {
                setApplyTask(null);
                setApplySubmitted(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Browse More Tasks
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Task summary */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {applyTask?.category?.name}
                </span>
                {applyTask?.is_urgent && <Badge label="Urgent" variant="danger" size="sm" />}
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{applyTask?.title}</h4>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(applyTask?.budget_min ?? 0)} - {formatCurrency(applyTask?.budget_max ?? 0)}
                </span>
                {applyTask?.deadline && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {daysUntil(applyTask.deadline)}d left
                  </span>
                )}
              </div>
            </div>

            {/* Cover letter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Cover Letter
              </label>
              <textarea
                value={applyForm.cover_letter}
                onChange={(e) => setApplyForm((p) => ({ ...p, cover_letter: e.target.value }))}
                placeholder="Explain why you're the best fit for this task. Include relevant experience, approach, and timeline..."
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Proposed budget + deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Proposed Budget (INR)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={100}
                    value={applyForm.proposed_budget}
                    onChange={(e) =>
                      setApplyForm((p) => ({ ...p, proposed_budget: Number(e.target.value) }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Proposed Deadline
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={applyForm.proposed_deadline}
                    onChange={(e) =>
                      setApplyForm((p) => ({ ...p, proposed_deadline: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setApplyTask(null);
                  setApplySubmitted(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!applyForm.cover_letter.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
