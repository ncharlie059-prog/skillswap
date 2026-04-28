import { useState, useMemo, useCallback } from 'react';
import { Briefcase, Clock, Users, DollarSign, Eye, CreditCard as Edit, Trash2, MoreVertical, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Task, Application } from '../../types';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', created_at: '' },
  { id: 'cat-2', name: 'Graphic Design', slug: 'graphic-design', icon: 'palette', created_at: '' },
  { id: 'cat-3', name: 'Video Editing', slug: 'video-editing', icon: 'video', created_at: '' },
  { id: 'cat-4', name: 'Content Writing', slug: 'content-writing', icon: 'pen', created_at: '' },
  { id: 'cat-5', name: 'Mobile Apps', slug: 'mobile-apps', icon: 'smartphone', created_at: '' },
  { id: 'cat-6', name: 'Data & Analytics', slug: 'data-analytics', icon: 'chart', created_at: '' },
];

const MOCK_SKILLS = [
  { id: 'sk-1', name: 'React', created_at: '' },
  { id: 'sk-2', name: 'Figma', created_at: '' },
  { id: 'sk-3', name: 'Python', created_at: '' },
  { id: 'sk-4', name: 'Illustrator', created_at: '' },
  { id: 'sk-5', name: 'WordPress', created_at: '' },
  { id: 'sk-6', name: 'TypeScript', created_at: '' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    client_id: 'demo',
    category_id: 'cat-1',
    title: 'Mobile App UI Design for Campus Events',
    description: 'Design a modern mobile app interface for campus event discovery. Includes home feed, event detail, map view, and RSVP screens.',
    budget_min: 5000,
    budget_max: 12000,
    deadline: '2026-05-15T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 87,
    applications_count: 5,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[1]],
  },
  {
    id: 't-2',
    client_id: 'demo',
    category_id: 'cat-3',
    title: 'Edit a 3-Minute Campus Promo Video',
    description: 'Need professional video editing with color grading, transitions, and background music for a campus startup promo.',
    budget_min: 2000,
    budget_max: 5000,
    deadline: '2026-05-01T00:00:00Z',
    status: 'in_progress',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 142,
    applications_count: 3,
    created_at: '2026-04-10T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z',
    category: MOCK_CATEGORIES[2],
    skills: [],
  },
  {
    id: 't-3',
    client_id: 'demo',
    category_id: 'cat-2',
    title: 'Logo Design for Tech Society',
    description: 'Create a professional logo for the campus tech society. Modern, clean design with brand guidelines.',
    budget_min: 1000,
    budget_max: 3000,
    deadline: null,
    status: 'completed',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 34,
    applications_count: 2,
    created_at: '2026-03-15T00:00:00Z',
    updated_at: '2026-04-01T00:00:00Z',
    category: MOCK_CATEGORIES[1],
    skills: [MOCK_SKILLS[3]],
  },
  {
    id: 't-4',
    client_id: 'demo',
    category_id: 'cat-6',
    title: 'Data Analysis for Research Project',
    description: 'Analyze survey data and create visualizations for a psychology research project. Need cleaned dataset and summary report.',
    budget_min: 3000,
    budget_max: 7000,
    deadline: '2026-04-30T00:00:00Z',
    status: 'cancelled',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 56,
    applications_count: 1,
    created_at: '2026-03-28T00:00:00Z',
    updated_at: '2026-04-05T00:00:00Z',
    category: MOCK_CATEGORIES[5],
    skills: [MOCK_SKILLS[2]],
  },
  {
    id: 't-5',
    client_id: 'demo',
    category_id: 'cat-4',
    title: 'Write Product Descriptions for Merch Store',
    description: 'We need compelling product descriptions for 10 items on our campus merch store. SEO-friendly, 150-200 words each.',
    budget_min: 500,
    budget_max: 1500,
    deadline: '2026-05-20T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: false,
    views: 29,
    applications_count: 4,
    created_at: '2026-04-25T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
    category: MOCK_CATEGORIES[3],
    skills: [],
  },
  {
    id: 't-6',
    client_id: 'demo',
    category_id: 'cat-5',
    title: 'Build a Flutter Event App Prototype',
    description: 'Create a high-fidelity prototype for a campus event discovery app with event feed, map, RSVP, and social features.',
    budget_min: 8000,
    budget_max: 15000,
    deadline: '2026-06-10T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: false,
    views: 210,
    applications_count: 7,
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[5]],
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    task_id: 't-1',
    freelancer_id: 'f-1',
    cover_letter: 'I have 3 years of experience in mobile UI design using Figma. I have designed 15+ campus apps and can deliver a modern, intuitive interface for your event discovery platform.',
    proposed_budget: 8000,
    proposed_deadline: '2026-05-10',
    status: 'pending',
    created_at: '2026-04-21T00:00:00Z',
    freelancer: {
      id: 'f-1',
      email: 'aisha@campus.edu',
      full_name: 'Aisha Patel',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-1',
        user_id: 'f-1',
        headline: 'UI/UX Designer & Figma Expert',
        bio: 'Passionate about creating beautiful, user-centered designs for mobile and web applications.',
        portfolio_url: 'https://aisha.design',
        education: 'B.Des, IIT Bombay',
        experience_years: 3,
        hourly_rate: 499,
        completion_rate: 98,
        response_rate: 95,
        on_time_delivery: 97,
        total_earnings: 85000,
        total_orders: 45,
        completed_orders: 43,
        xp: 2400,
        level: 8,
        profile_completion: 90,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'app-2',
    task_id: 't-1',
    freelancer_id: 'f-2',
    cover_letter: 'As a graphic design student with strong Figma skills, I can create a stunning mobile UI for your campus events platform. I have previously designed event apps for our college fest.',
    proposed_budget: 10000,
    proposed_deadline: '2026-05-12',
    status: 'pending',
    created_at: '2026-04-22T00:00:00Z',
    freelancer: {
      id: 'f-2',
      email: 'marcus@campus.edu',
      full_name: 'Marcus Chen',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'NID Ahmedabad',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-2',
        user_id: 'f-2',
        headline: 'Brand Designer & Illustrator',
        bio: 'Specializing in brand identity and mobile UI design with a focus on clean, modern aesthetics.',
        portfolio_url: 'https://marcuschen.dribbble.com',
        education: 'B.Des, NID',
        experience_years: 4,
        hourly_rate: 799,
        completion_rate: 100,
        response_rate: 92,
        on_time_delivery: 96,
        total_earnings: 120000,
        total_orders: 60,
        completed_orders: 60,
        xp: 3100,
        level: 10,
        profile_completion: 95,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'app-3',
    task_id: 't-1',
    freelancer_id: 'f-3',
    cover_letter: 'I can create a clean, modern UI for your campus events app. I specialize in Figma prototyping and have designed apps for 3 college organizations.',
    proposed_budget: 6000,
    proposed_deadline: '2026-05-08',
    status: 'pending',
    created_at: '2026-04-23T00:00:00Z',
    freelancer: {
      id: 'f-3',
      email: 'sofia@campus.edu',
      full_name: 'Sofia Rodriguez',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'FTII Pune',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-3',
        user_id: 'f-3',
        headline: 'Video Editor & Motion Designer',
        bio: 'Creative professional with experience in video editing, motion graphics, and UI animation.',
        portfolio_url: '',
        education: 'BFA Film, FTII',
        experience_years: 2,
        hourly_rate: 349,
        completion_rate: 95,
        response_rate: 88,
        on_time_delivery: 90,
        total_earnings: 45000,
        total_orders: 30,
        completed_orders: 28,
        xp: 1500,
        level: 5,
        profile_completion: 80,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'app-4',
    task_id: 't-2',
    freelancer_id: 'f-4',
    cover_letter: 'I am a professional video editor with experience in campus promo videos. I can deliver a polished edit with color grading, transitions, and license-free music within 3 days.',
    proposed_budget: 3500,
    proposed_deadline: '2026-04-28',
    status: 'accepted',
    created_at: '2026-04-12T00:00:00Z',
    freelancer: {
      id: 'f-4',
      email: 'priya@campus.edu',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'Jamia Millia',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-4',
        user_id: 'f-4',
        headline: 'Video Editor & Content Creator',
        bio: 'Experienced in cinematic video editing, color grading, and sound design for promotional content.',
        portfolio_url: '',
        education: 'MA Mass Comm',
        experience_years: 3,
        hourly_rate: 349,
        completion_rate: 100,
        response_rate: 97,
        on_time_delivery: 100,
        total_earnings: 62000,
        total_orders: 38,
        completed_orders: 38,
        xp: 1900,
        level: 7,
        profile_completion: 88,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'app-5',
    task_id: 't-5',
    freelancer_id: 'f-5',
    cover_letter: 'I am a content writer with experience in e-commerce product descriptions. I can write SEO-optimized descriptions that convert visitors to buyers.',
    proposed_budget: 1200,
    proposed_deadline: '2026-05-15',
    status: 'pending',
    created_at: '2026-04-26T00:00:00Z',
    freelancer: {
      id: 'f-5',
      email: 'rohan@campus.edu',
      full_name: 'Rohan Gupta',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'BITS Pilani',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-5',
        user_id: 'f-5',
        headline: 'Content Writer & SEO Specialist',
        bio: 'Freelance writer specializing in product descriptions, blog posts, and SEO content.',
        portfolio_url: '',
        education: 'B.E. CS',
        experience_years: 2,
        hourly_rate: 199,
        completion_rate: 92,
        response_rate: 85,
        on_time_delivery: 88,
        total_earnings: 35000,
        total_orders: 20,
        completed_orders: 18,
        xp: 1100,
        level: 4,
        profile_completion: 75,
        created_at: '',
        updated_at: '',
      },
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StatusTab = 'all' | Task['status'];

interface TaskFormData {
  title: string;
  description: string;
  category_id: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No deadline';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

const statusVariantMap: Record<Task['status'], 'info' | 'warning' | 'success' | 'danger'> = {
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

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} className="relative">
          <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />);
    }
  }
  return stars;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MyTasksPage() {
  const { profile: _profile } = useAuth();

  /* --- State --- */
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [applicantsTask, setApplicantsTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<TaskFormData>({
    title: '',
    description: '',
    category_id: '',
    budget_min: 0,
    budget_max: 0,
    deadline: '',
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* --- Derived --- */
  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tasks.filter((t) => {
      if (activeTab !== 'all' && t.status !== activeTab) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, activeTab, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    open: tasks.filter((t) => t.status === 'open').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    cancelled: tasks.filter((t) => t.status === 'cancelled').length,
  }), [tasks]);

  const taskApplications = useMemo(() => {
    if (!applicantsTask) return [];
    return applications.filter((a) => a.task_id === applicantsTask.id);
  }, [applicantsTask, applications]);

  /* --- Handlers --- */
  const openApplicants = useCallback((task: Task) => {
    setApplicantsTask(task);
    setOpenMenuId(null);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditForm({
      title: task.title,
      description: task.description,
      category_id: task.category_id,
      budget_min: task.budget_min,
      budget_max: task.budget_max,
      deadline: task.deadline ?? '',
    });
    setEditingTask(task);
    setOpenMenuId(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingTask || !editForm.title.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: editForm.title,
              description: editForm.description,
              category_id: editForm.category_id,
              budget_min: editForm.budget_min,
              budget_max: editForm.budget_max,
              deadline: editForm.deadline || null,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    );
    setEditingTask(null);
  }, [editingTask, editForm]);

  const handleDelete = useCallback(() => {
    if (!deletingTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
    setDeletingTask(null);
  }, [deletingTask]);

  const handleAcceptApplication = useCallback((appId: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'accepted' as const }
          : a.status === 'pending' && a.task_id === applications.find((ap) => ap.id === appId)?.task_id
          ? { ...a, status: 'rejected' as const } // reject other pending for same task
          : a
      )
    );
    // Update task status to in_progress
    const app = applications.find((a) => a.id === appId);
    if (app) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === app.task_id ? { ...t, status: 'in_progress' as const } : t
        )
      );
    }
  }, [applications]);

  const handleRejectApplication = useCallback((appId: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: 'rejected' as const } : a
      )
    );
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your posted tasks and review applications
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
            <Briefcase className="w-4 h-4" />
            Post New Task
          </button>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
            { label: 'Open', value: stats.open, icon: Eye, color: 'from-blue-500 to-cyan-600' },
            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'from-amber-500 to-orange-600' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'from-emerald-500 to-green-600' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'from-red-500 to-rose-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Search + Status Tabs ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Eye className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl overflow-x-auto">
            {([
              { key: 'all' as StatusTab, label: 'All' },
              { key: 'open' as StatusTab, label: 'Open' },
              { key: 'in_progress' as StatusTab, label: 'In Progress' },
              { key: 'completed' as StatusTab, label: 'Completed' },
              { key: 'cancelled' as StatusTab, label: 'Cancelled' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Task List ===== */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No tasks found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {searchQuery ? 'Try adjusting your search' : 'You have not posted any tasks yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const daysLeft = daysUntil(task.deadline);
              const appCount = applications.filter((a) => a.task_id === task.id).length;
              const pendingCount = applications.filter((a) => a.task_id === task.id && a.status === 'pending').length;

              return (
                <div
                  key={task.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                >
                  <div className="p-5">
                    {/* Top row: badges + actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge
                            label={statusLabelMap[task.status]}
                            variant={statusVariantMap[task.status]}
                            size="sm"
                          />
                          {task.category && (
                            <Badge label={task.category.name} variant="info" size="sm" />
                          )}
                          {task.is_urgent && (
                            <Badge label="Urgent" variant="danger" size="sm" />
                          )}
                          {task.is_micro && (
                            <Badge label="Micro Task" variant="warning" size="sm" />
                          )}
                          {task.is_instant_hire && (
                            <Badge label="Instant Hire" variant="success" size="sm" />
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {task.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Skills */}
                        {task.skills && task.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {task.skills.map((s) => (
                              <Badge key={s.id} label={s.name} variant="default" size="sm" />
                            ))}
                          </div>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(task.budget_min)}
                            </span>
                            <span className="text-slate-400">&ndash;</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(task.budget_max)}
                            </span>
                          </div>

                          {task.deadline && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span
                                className={`${
                                  daysLeft !== null && daysLeft <= 3
                                    ? 'text-red-600 dark:text-red-400 font-semibold'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {daysLeft !== null ? `${daysLeft}d left` : 'No deadline'}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                ({formatDate(task.deadline)})
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{task.views} views</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                            <Users className="w-3.5 h-3.5" />
                            <span>{appCount} application{appCount !== 1 ? 's' : ''}</span>
                            {pendingCount > 0 && (
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                ({pendingCount} new)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions dropdown */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>

                        {openMenuId === task.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                              {appCount > 0 && (
                                <button
                                  onClick={() => openApplicants(task)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  <Users className="w-4 h-4 text-emerald-500" />
                                  View Applicants
                                  {pendingCount > 0 && (
                                    <span className="ml-auto w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                                      {pendingCount}
                                    </span>
                                  )}
                                </button>
                              )}
                              {task.status === 'open' && (
                                <button
                                  onClick={() => openEditModal(task)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-blue-500" />
                                  Edit Task
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setApplicantsTask(task);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                <MessageSquare className="w-4 h-4 text-teal-500" />
                                Messages
                              </button>
                              <div className="my-1.5 border-t border-slate-100 dark:border-slate-700" />
                              <button
                                onClick={() => {
                                  setDeletingTask(task);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Task
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick action row for open tasks */}
                    {task.status === 'open' && appCount > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {applications
                            .filter((a) => a.task_id === task.id)
                            .slice(0, 4)
                            .map((app) => (
                              <div
                                key={app.id}
                                className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-white dark:ring-slate-800"
                                title={app.freelancer?.full_name}
                              >
                                {getInitials(app.freelancer?.full_name ?? 'F')}
                              </div>
                            ))}
                          {appCount > 4 && (
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-[9px] font-bold ring-2 ring-white dark:ring-slate-800">
                              +{appCount - 4}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => openApplicants(task)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                        >
                          <Users className="w-3.5 h-3.5" />
                          Review Applicants ({pendingCount} new)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== View Applicants Modal ===== */}
      <Modal
        isOpen={!!applicantsTask}
        onClose={() => setApplicantsTask(null)}
        title={`Applicants: ${applicantsTask?.title ?? ''}`}
        size="lg"
      >
        {taskApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No applications received yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {taskApplications.map((app) => {
              const freelancer = app.freelancer;
              const fp = freelancer?.freelancer_profile;
              const name = freelancer?.full_name ?? 'Freelancer';
              const isPending = app.status === 'pending';
              const isAccepted = app.status === 'accepted';
              const isRejected = app.status === 'rejected';

              return (
                <div
                  key={app.id}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isAccepted
                      ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/10'
                      : isRejected
                      ? 'border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 opacity-60'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {getInitials(name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {name}
                        </h4>
                        {isAccepted && (
                          <Badge label="Accepted" variant="success" size="sm" />
                        )}
                        {isRejected && (
                          <Badge label="Rejected" variant="danger" size="sm" />
                        )}
                        {isPending && (
                          <Badge label="Pending" variant="warning" size="sm" />
                        )}
                        {freelancer?.college_id_verified && (
                          <Badge label="Verified" variant="success" size="sm" />
                        )}
                      </div>

                      {/* Headline */}
                      {fp?.headline && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          {fp.headline}
                        </p>
                      )}

                      {/* College */}
                      {freelancer?.college && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {freelancer.college}
                        </p>
                      )}

                      {/* Rating + Stats */}
                      {fp && (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(fp.completion_rate > 90 ? 5 : fp.completion_rate > 70 ? 4 : 3)}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {fp.completed_orders} orders
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {fp.completion_rate}% completion
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Lvl {fp.level}
                          </span>
                        </div>
                      )}

                      {/* Cover letter */}
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {app.cover_letter}
                      </p>

                      {/* Proposed budget + deadline */}
                      <div className="flex flex-wrap items-center gap-4 mt-2.5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(app.proposed_budget)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(app.proposed_deadline)}</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          Applied {formatDate(app.created_at)}
                        </span>
                      </div>

                      {/* Actions */}
                      {isPending && (
                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700">
                          <button
                            onClick={() => handleAcceptApplication(app.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectApplication(app.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-600 dark:hover:text-teal-400 transition-colors ml-auto">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      {/* ===== Edit Task Modal ===== */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={editForm.category_id}
              onChange={(e) => setEditForm((p) => ({ ...p, category_id: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Budget Min (INR)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={100}
                  value={editForm.budget_min}
                  onChange={(e) => setEditForm((p) => ({ ...p, budget_min: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Budget Max (INR)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={100}
                  value={editForm.budget_max}
                  onChange={(e) => setEditForm((p) => ({ ...p, budget_max: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Deadline
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={editForm.deadline}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setEditForm((p) => ({ ...p, deadline: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setEditingTask(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editForm.title.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* ===== Delete Confirmation Modal ===== */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 mx-auto">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            Are you sure you want to delete
            <span className="font-semibold text-slate-900 dark:text-white"> "{deletingTask?.title}"</span>?
            This action cannot be undone. All applications will be removed.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setDeletingTask(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Delete Task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
