import { useState, useMemo } from 'react';
import { Heart, Star, Clock, DollarSign, Trash2, Briefcase, Search, Filter, Eye, ArrowRight, BookmarkPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Gig, Task } from '../../types';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Web Development', slug: 'web-dev', icon: 'code', created_at: '' },
  { id: 'cat-2', name: 'Graphic Design', slug: 'graphic-design', icon: 'palette', created_at: '' },
  { id: 'cat-3', name: 'Video Editing', slug: 'video-editing', icon: 'video', created_at: '' },
  { id: 'cat-4', name: 'Content Writing', slug: 'content-writing', icon: 'pen', created_at: '' },
];

const MOCK_SAVED_GIGS: Gig[] = [
  {
    id: 'gig-1', freelancer_id: 'u-1', category_id: 'cat-1',
    title: 'Build a Responsive React Landing Page',
    description: 'Modern, responsive landing page using React and Tailwind CSS.',
    price: 45, delivery_days: 3, revisions: 3, image_url: '',
    status: 'active', rating: 4.9, review_count: 127, views: 1840,
    is_featured: true, created_at: '2026-03-15', updated_at: '2026-04-20',
    category: MOCK_CATEGORIES[0],
    skills: [{ id: 'sk-1', name: 'React', created_at: '' }, { id: 'sk-10', name: 'TypeScript', created_at: '' }],
    freelancer: {
      id: 'u-1', email: 'ara@campus.edu', full_name: 'Ara Patel', avatar_url: '',
      role: 'freelancer', phone: '', college: 'MIT', college_id_verified: true,
      is_verified: true, is_online: true, last_seen: '', created_at: '', updated_at: '',
      freelancer_profile: { id: 'fp-1', user_id: 'u-1', headline: 'Full-Stack Developer', bio: '', portfolio_url: '', education: 'MIT CS', experience_years: 3, hourly_rate: 25, completion_rate: 98, response_rate: 95, on_time_delivery: 97, total_earnings: 12500, total_orders: 64, completed_orders: 62, xp: 4800, level: 8, profile_completion: 100, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-2', freelancer_id: 'u-2', category_id: 'cat-2',
    title: 'Design a Professional Logo & Brand Kit',
    description: 'Complete brand identity package including logo and color palette.',
    price: 60, delivery_days: 5, revisions: 5, image_url: '',
    status: 'active', rating: 4.8, review_count: 89, views: 1230,
    is_featured: true, created_at: '2026-02-10', updated_at: '2026-04-18',
    category: MOCK_CATEGORIES[1],
    skills: [{ id: 'sk-2', name: 'Figma', created_at: '' }, { id: 'sk-4', name: 'Illustrator', created_at: '' }],
    freelancer: {
      id: 'u-2', email: 'mia@campus.edu', full_name: 'Mia Chen', avatar_url: '',
      role: 'freelancer', phone: '', college: 'RISD', college_id_verified: true,
      is_verified: true, is_online: true, last_seen: '', created_at: '', updated_at: '',
      freelancer_profile: { id: 'fp-2', user_id: 'u-2', headline: 'Brand Designer', bio: '', portfolio_url: '', education: 'RISD Graphic Design', experience_years: 2, hourly_rate: 30, completion_rate: 100, response_rate: 92, on_time_delivery: 96, total_earnings: 8700, total_orders: 42, completed_orders: 42, xp: 3100, level: 5, profile_completion: 95, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-6', freelancer_id: 'u-6', category_id: 'cat-1',
    title: 'Build Interactive Data Dashboards',
    description: 'Custom dashboards with real-time data visualization using Python and Streamlit.',
    price: 80, delivery_days: 7, revisions: 4, image_url: '',
    status: 'active', rating: 4.9, review_count: 42, views: 670,
    is_featured: true, created_at: '2026-01-05', updated_at: '2026-04-19',
    category: MOCK_CATEGORIES[0],
    skills: [{ id: 'sk-3', name: 'Python', created_at: '' }],
    freelancer: {
      id: 'u-6', email: 'lee@campus.edu', full_name: 'Lee Kim', avatar_url: '',
      role: 'freelancer', phone: '', college: 'UC Berkeley', college_id_verified: true,
      is_verified: true, is_online: true, last_seen: '', created_at: '', updated_at: '',
      freelancer_profile: { id: 'fp-6', user_id: 'u-6', headline: 'Data Scientist', bio: '', portfolio_url: '', education: 'UC Berkeley Data Science', experience_years: 2, hourly_rate: 28, completion_rate: 97, response_rate: 94, on_time_delivery: 100, total_earnings: 7200, total_orders: 30, completed_orders: 29, xp: 2800, level: 5, profile_completion: 92, created_at: '', updated_at: '' },
    },
  },
];

const MOCK_SAVED_TASKS: Task[] = [
  {
    id: 'task-1', client_id: 'c-1', category_id: 'cat-1',
    title: 'Redesign Student Organization Website',
    description: 'Our campus club needs a complete website overhaul with event calendar and signup form.',
    budget_min: 200, budget_max: 350, deadline: '2026-05-20',
    status: 'open', is_micro: false, is_urgent: true, is_instant_hire: false,
    views: 320, applications_count: 8, created_at: '2026-04-10', updated_at: '2026-04-25',
    category: MOCK_CATEGORIES[0],
    skills: [{ id: 'sk-1', name: 'React', created_at: '' }, { id: 'sk-6', name: 'WordPress', created_at: '' }],
    client: { id: 'c-1', email: 'org@campus.edu', full_name: 'Campus Coding Club', avatar_url: '', role: 'client', phone: '', college: 'MIT', college_id_verified: true, is_verified: true, is_online: true, last_seen: '', created_at: '', updated_at: '' },
  },
  {
    id: 'task-2', client_id: 'c-2', category_id: 'cat-2',
    title: 'Create Social Media Graphics Pack',
    description: 'Need 20 branded social media templates for Instagram and LinkedIn.',
    budget_min: 80, budget_max: 150, deadline: '2026-05-10',
    status: 'open', is_micro: false, is_urgent: false, is_instant_hire: true,
    views: 180, applications_count: 5, created_at: '2026-04-18', updated_at: '2026-04-24',
    category: MOCK_CATEGORIES[1],
    skills: [{ id: 'sk-2', name: 'Figma', created_at: '' }],
    client: { id: 'c-2', email: 'startup@campus.edu', full_name: 'LaunchPad Startup', avatar_url: '', role: 'client', phone: '', college: 'Stanford', college_id_verified: true, is_verified: true, is_online: false, last_seen: '', created_at: '', updated_at: '' },
  },
  {
    id: 'task-3', client_id: 'c-3', category_id: 'cat-4',
    title: 'Write Product Descriptions for 10 Items',
    description: 'We need compelling, conversion-focused product descriptions for our campus merch store.',
    budget_min: 30, budget_max: 50, deadline: '2026-05-02',
    status: 'open', is_micro: true, is_urgent: true, is_instant_hire: false,
    views: 90, applications_count: 12, created_at: '2026-04-22', updated_at: '2026-04-26',
    category: MOCK_CATEGORIES[3],
    skills: [{ id: 'sk-8', name: 'SEO', created_at: '' }],
    client: { id: 'c-3', email: 'store@campus.edu', full_name: 'Campus Merch Co.', avatar_url: '', role: 'client', phone: '', college: 'UCLA', college_id_verified: true, is_verified: false, is_online: true, last_seen: '', created_at: '', updated_at: '' },
  },
];

interface SavedFreelancer {
  id: string;
  full_name: string;
  avatar_url: string;
  headline: string;
  skills: string[];
  rating: number;
  review_count: number;
  hourly_rate: number;
  is_online: boolean;
  college: string;
  level: number;
}

const MOCK_SAVED_FREELANCERS: SavedFreelancer[] = [
  { id: 'u-1', full_name: 'Ara Patel', avatar_url: '', headline: 'Full-Stack Developer', skills: ['React', 'TypeScript', 'Node.js'], rating: 4.9, review_count: 127, hourly_rate: 25, is_online: true, college: 'MIT', level: 8 },
  { id: 'u-2', full_name: 'Mia Chen', avatar_url: '', headline: 'Brand Designer', skills: ['Figma', 'Illustrator', 'Photoshop'], rating: 4.8, review_count: 89, hourly_rate: 30, is_online: true, college: 'RISD', level: 5 },
  { id: 'u-5', full_name: 'Sam Okonkwo', avatar_url: '', headline: 'Mobile Developer', skills: ['Flutter', 'Dart', 'Firebase'], rating: 4.6, review_count: 18, hourly_rate: 35, is_online: false, college: 'Georgia Tech', level: 6 },
  { id: 'u-6', full_name: 'Lee Kim', avatar_url: '', headline: 'Data Scientist', skills: ['Python', 'Pandas', 'ML'], rating: 4.9, review_count: 42, hourly_rate: 28, is_online: true, college: 'UC Berkeley', level: 5 },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabKey = 'gigs' | 'tasks' | 'freelancers';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FavoritesPage() {
  const { profile: _profile } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('gigs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [savedGigs, setSavedGigs] = useState<Gig[]>(MOCK_SAVED_GIGS);
  const [savedTasks, setSavedTasks] = useState<Task[]>(MOCK_SAVED_TASKS);
  const [savedFreelancers, setSavedFreelancers] = useState<SavedFreelancer[]>(MOCK_SAVED_FREELANCERS);

  const totalSaved = savedGigs.length + savedTasks.length + savedFreelancers.length;

  /* --- Filtered data --- */
  const filteredGigs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return savedGigs;
    return savedGigs.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.freelancer?.full_name ?? '').toLowerCase().includes(q) ||
        (g.category?.name ?? '').toLowerCase().includes(q)
    );
  }, [searchQuery, savedGigs]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return savedTasks;
    return savedTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.client?.full_name ?? '').toLowerCase().includes(q) ||
        (t.category?.name ?? '').toLowerCase().includes(q)
    );
  }, [searchQuery, savedTasks]);

  const filteredFreelancers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return savedFreelancers;
    return savedFreelancers.filter(
      (f) =>
        f.full_name.toLowerCase().includes(q) ||
        f.headline.toLowerCase().includes(q) ||
        f.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery, savedFreelancers]);

  /* --- Handlers --- */
  const removeGig = (id: string) => setSavedGigs((prev) => prev.filter((g) => g.id !== id));
  const removeTask = (id: string) => setSavedTasks((prev) => prev.filter((t) => t.id !== id));
  const removeFreelancer = (id: string) => setSavedFreelancers((prev) => prev.filter((f) => f.id !== id));

  /* ---------------------------------------------------------------- */
  /*  Sub-components                                                   */
  /* ---------------------------------------------------------------- */

  const SavedGigCard = ({ gig }: { gig: Gig }) => (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
      {/* Image placeholder */}
      <div className="relative h-36 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-emerald-300 dark:text-emerald-700" />
        </div>
        <button
          onClick={() => removeGig(gig.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors shadow-sm"
          title="Remove from saved"
        >
          <Heart className="w-4 h-4 fill-rose-500" />
        </button>
        {gig.is_featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{gig.category?.name}</span>
        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {gig.title}
        </h3>

        {/* Freelancer */}
        <div className="flex items-center gap-2 mt-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(gig.freelancer?.full_name ?? 'U')}
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">{gig.freelancer?.full_name}</span>
          {gig.freelancer?.freelancer_profile && (
            <span className="text-xs text-slate-400 dark:text-slate-500">Lvl {gig.freelancer.freelancer_profile.level}</span>
          )}
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            {renderStars(gig.rating)}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{gig.rating}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">({gig.review_count})</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-lg font-bold">{gig.price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => removeGig(gig.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 ml-auto">
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        </div>
      </div>
    </div>
  );

  const SavedTaskCard = ({ task }: { task: Task }) => {
    const daysLeft = daysUntil(task.deadline);
    return (
      <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-3">
            <BookmarkPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
            <Badge label={task.category?.name ?? ''} variant="info" size="sm" />
            {task.is_urgent && <Badge label="Urgent" variant="danger" size="sm" />}
            {task.is_micro && <Badge label="Micro" variant="warning" size="sm" />}
          </div>
          <button
            onClick={() => removeTask(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            title="Remove from saved"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {task.title}
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Skills */}
        {task.skills && task.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {task.skills.map((s) => (
              <Badge key={s.id} label={s.name} variant="default" size="sm" />
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-white">${task.budget_min}</span>
              <span className="text-slate-400">-</span>
              <span className="font-semibold text-slate-900 dark:text-white">${task.budget_max}</span>
            </div>
            {daysLeft !== null && (
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className={`${daysLeft <= 3 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {daysLeft}d left
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => removeTask(task.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
              Apply
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SavedFreelancerCard = ({ freelancer }: { freelancer: SavedFreelancer }) => (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(freelancer.full_name)}
            </div>
            {freelancer.is_online && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {freelancer.full_name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{freelancer.headline}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{freelancer.college} &middot; Level {freelancer.level}</p>
          </div>
        </div>
        <button
          onClick={() => removeFreelancer(freelancer.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          title="Remove from saved"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {freelancer.skills.map((skill) => (
          <Badge key={skill} label={skill} variant="default" size="sm" />
        ))}
      </div>

      {/* Rating + Rate */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {renderStars(freelancer.rating)}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{freelancer.rating}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">({freelancer.review_count})</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-semibold">{freelancer.hourly_rate}/hr</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => removeFreelancer(freelancer.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 ml-auto">
          Message
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Your
              <span className="block text-emerald-200">Saved Favorites</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
              Keep track of the gigs, tasks, and freelancers you love. All your bookmarks in one place.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white">
              <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
              <span className="text-lg font-bold">{totalSaved}</span>
              <span className="text-sm text-emerald-100">Total Saved</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white">
              <Briefcase className="w-5 h-5" />
              <span className="text-lg font-bold">{savedGigs.length}</span>
              <span className="text-sm text-emerald-100">Gigs</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white">
              <BookmarkPlus className="w-5 h-5" />
              <span className="text-lg font-bold">{savedTasks.length}</span>
              <span className="text-sm text-emerald-100">Tasks</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-sm text-white">
              <Eye className="w-5 h-5" />
              <span className="text-lg font-bold">{savedFreelancers.length}</span>
              <span className="text-sm text-emerald-100">Freelancers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
            {([
              { key: 'gigs' as TabKey, label: 'Saved Gigs', count: filteredGigs.length },
              { key: 'tasks' as TabKey, label: 'Saved Tasks', count: filteredTasks.length },
              { key: 'freelancers' as TabKey, label: 'Saved Freelancers', count: filteredFreelancers.length },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-xs ${activeTab === key ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved items..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilter
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        {activeTab === 'gigs' && (
          <>
            {filteredGigs.length === 0 ? (
              <EmptyState
                icon={<Heart className="w-8 h-8" />}
                title={savedGigs.length === 0 ? 'No saved gigs yet' : 'No matching gigs'}
                description={savedGigs.length === 0 ? 'Start browsing the marketplace and save gigs you are interested in.' : 'Try adjusting your search to find what you are looking for.'}
                action={
                  savedGigs.length === 0 ? (
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                      <Briefcase className="w-4 h-4" />
                      Browse Gigs
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredGigs.map((gig) => (
                  <SavedGigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'tasks' && (
          <>
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={<BookmarkPlus className="w-8 h-8" />}
                title={savedTasks.length === 0 ? 'No saved tasks yet' : 'No matching tasks'}
                description={savedTasks.length === 0 ? 'Save interesting tasks so you can apply later when you are ready.' : 'Try adjusting your search to find what you are looking for.'}
                action={
                  savedTasks.length === 0 ? (
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                      <Briefcase className="w-4 h-4" />
                      Browse Tasks
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredTasks.map((task) => (
                  <SavedTaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'freelancers' && (
          <>
            {filteredFreelancers.length === 0 ? (
              <EmptyState
                icon={<Eye className="w-8 h-8" />}
                title={savedFreelancers.length === 0 ? 'No saved freelancers yet' : 'No matching freelancers'}
                description={savedFreelancers.length === 0 ? 'Bookmark talented freelancers so you can reach out when you need them.' : 'Try adjusting your search to find what you are looking for.'}
                action={
                  savedFreelancers.length === 0 ? (
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" />
                      Browse Freelancers
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredFreelancers.map((freelancer) => (
                  <SavedFreelancerCard key={freelancer.id} freelancer={freelancer} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
