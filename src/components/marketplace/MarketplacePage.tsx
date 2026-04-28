import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Star, Clock, DollarSign, Zap, Briefcase, ArrowRight, Grid2x2 as Grid, List, ChevronDown, X, TrendingUp, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Gig, Task, Category, Skill } from '../../types';
import Badge from '../common/Badge';

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

const MOCK_GIGS: Gig[] = [
  {
    id: 'gig-1',
    freelancer_id: 'u-1',
    category_id: 'cat-1',
    title: 'Build a Responsive React Landing Page',
    description: 'I will create a modern, responsive landing page using React and Tailwind CSS. Pixel-perfect design with smooth animations.',
    price: 45,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 127,
    views: 1840,
    is_featured: true,
    created_at: '2026-03-15',
    updated_at: '2026-04-20',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[9]],
    freelancer: {
      id: 'u-1',
      email: 'ara@campus.edu',
      full_name: 'Ara Patel',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'MIT',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-1', user_id: 'u-1', headline: 'Full-Stack Developer', bio: '', portfolio_url: '', education: 'MIT CS', experience_years: 3, hourly_rate: 25, completion_rate: 98, response_rate: 95, on_time_delivery: 97, total_earnings: 12500, total_orders: 64, completed_orders: 62, xp: 4800, level: 8, profile_completion: 100, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-2',
    freelancer_id: 'u-2',
    category_id: 'cat-2',
    title: 'Design a Professional Logo & Brand Kit',
    description: 'Complete brand identity package including logo, color palette, typography guide, and social media templates.',
    price: 60,
    delivery_days: 5,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 4.8,
    review_count: 89,
    views: 1230,
    is_featured: true,
    created_at: '2026-02-10',
    updated_at: '2026-04-18',
    category: MOCK_CATEGORIES[1],
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[3]],
    freelancer: {
      id: 'u-2',
      email: 'mia@campus.edu',
      full_name: 'Mia Chen',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'RISD',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-2', user_id: 'u-2', headline: 'Brand Designer', bio: '', portfolio_url: '', education: 'RISD Graphic Design', experience_years: 2, hourly_rate: 30, completion_rate: 100, response_rate: 92, on_time_delivery: 96, total_earnings: 8700, total_orders: 42, completed_orders: 42, xp: 3100, level: 5, profile_completion: 95, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-3',
    freelancer_id: 'u-3',
    category_id: 'cat-3',
    title: 'Edit a Cinematic YouTube Video',
    description: 'Professional video editing with color grading, transitions, sound design, and motion graphics for your YouTube channel.',
    price: 35,
    delivery_days: 2,
    revisions: 2,
    image_url: '',
    status: 'active',
    rating: 4.7,
    review_count: 56,
    views: 780,
    is_featured: false,
    created_at: '2026-01-20',
    updated_at: '2026-04-15',
    category: MOCK_CATEGORIES[2],
    skills: [MOCK_SKILLS[4]],
    freelancer: {
      id: 'u-3',
      email: 'jake@campus.edu',
      full_name: 'Jake Rivera',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'USC',
      college_id_verified: true,
      is_verified: false,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-3', user_id: 'u-3', headline: 'Video Editor', bio: '', portfolio_url: '', education: 'USC Film', experience_years: 4, hourly_rate: 20, completion_rate: 94, response_rate: 88, on_time_delivery: 91, total_earnings: 6200, total_orders: 38, completed_orders: 36, xp: 2400, level: 4, profile_completion: 80, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-4',
    freelancer_id: 'u-4',
    category_id: 'cat-4',
    title: 'Write SEO-Optimized Blog Articles',
    description: 'High-quality, researched blog posts that rank. Includes keyword research, meta descriptions, and internal linking strategy.',
    price: 25,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 5.0,
    review_count: 34,
    views: 560,
    is_featured: false,
    created_at: '2026-03-01',
    updated_at: '2026-04-10',
    category: MOCK_CATEGORIES[3],
    skills: [MOCK_SKILLS[7]],
    freelancer: {
      id: 'u-4',
      email: 'priya@campus.edu',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'Stanford',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-4', user_id: 'u-4', headline: 'Content Strategist', bio: '', portfolio_url: '', education: 'Stanford English', experience_years: 2, hourly_rate: 18, completion_rate: 100, response_rate: 100, on_time_delivery: 100, total_earnings: 4100, total_orders: 28, completed_orders: 28, xp: 1900, level: 3, profile_completion: 90, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-5',
    freelancer_id: 'u-5',
    category_id: 'cat-5',
    title: 'Develop a Cross-Platform Flutter App',
    description: 'End-to-end mobile app development with Flutter. Includes UI design, API integration, and deployment to both stores.',
    price: 120,
    delivery_days: 14,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 4.6,
    review_count: 18,
    views: 920,
    is_featured: false,
    created_at: '2026-02-28',
    updated_at: '2026-04-22',
    category: MOCK_CATEGORIES[4],
    skills: [MOCK_SKILLS[6]],
    freelancer: {
      id: 'u-5',
      email: 'sam@campus.edu',
      full_name: 'Sam Okonkwo',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'Georgia Tech',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-5', user_id: 'u-5', headline: 'Mobile Developer', bio: '', portfolio_url: '', education: 'Georgia Tech CS', experience_years: 3, hourly_rate: 35, completion_rate: 90, response_rate: 85, on_time_delivery: 88, total_earnings: 9800, total_orders: 22, completed_orders: 20, xp: 3500, level: 6, profile_completion: 85, created_at: '', updated_at: '' },
    },
  },
  {
    id: 'gig-6',
    freelancer_id: 'u-6',
    category_id: 'cat-6',
    title: 'Build Interactive Data Dashboards',
    description: 'Custom dashboards with real-time data visualization using Python, Plotly, and Streamlit. Turn your data into insights.',
    price: 80,
    delivery_days: 7,
    revisions: 4,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 42,
    views: 670,
    is_featured: true,
    created_at: '2026-01-05',
    updated_at: '2026-04-19',
    category: MOCK_CATEGORIES[5],
    skills: [MOCK_SKILLS[2]],
    freelancer: {
      id: 'u-6',
      email: 'lee@campus.edu',
      full_name: 'Lee Kim',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'UC Berkeley',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: { id: 'fp-6', user_id: 'u-6', headline: 'Data Scientist', bio: '', portfolio_url: '', education: 'UC Berkeley Data Science', experience_years: 2, hourly_rate: 28, completion_rate: 97, response_rate: 94, on_time_delivery: 100, total_earnings: 7200, total_orders: 30, completed_orders: 29, xp: 2800, level: 5, profile_completion: 92, created_at: '', updated_at: '' },
    },
  },
];

const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    client_id: 'c-1',
    category_id: 'cat-1',
    title: 'Redesign Student Organization Website',
    description: 'Our campus club needs a complete website overhaul. Must include event calendar, member gallery, and signup form. Current site is outdated and not mobile-friendly.',
    budget_min: 200,
    budget_max: 350,
    deadline: '2026-05-20',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 320,
    applications_count: 8,
    created_at: '2026-04-10',
    updated_at: '2026-04-25',
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
    description: 'Need 20 branded social media templates for Instagram and LinkedIn. Includes story templates, post templates, and carousel designs with our brand colors.',
    budget_min: 80,
    budget_max: 150,
    deadline: '2026-05-10',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: true,
    views: 180,
    applications_count: 5,
    created_at: '2026-04-18',
    updated_at: '2026-04-24',
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
    description: 'We need compelling, conversion-focused product descriptions for our campus merch store. Each description should be 150-200 words with SEO keywords.',
    budget_min: 30,
    budget_max: 50,
    deadline: '2026-05-02',
    status: 'open',
    is_micro: true,
    is_urgent: true,
    is_instant_hire: false,
    views: 90,
    applications_count: 12,
    created_at: '2026-04-22',
    updated_at: '2026-04-26',
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
    description: 'We have a 2000-row survey dataset with missing values and inconsistent formatting. Need it cleaned, analyzed, and visualized with key insights in a report.',
    budget_min: 40,
    budget_max: 75,
    deadline: '2026-05-05',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: true,
    views: 145,
    applications_count: 7,
    created_at: '2026-04-20',
    updated_at: '2026-04-25',
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
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabKey = 'gigs' | 'tasks' | 'micro';
type ViewMode = 'grid' | 'list';
type PriceRange = 'all' | '0-25' | '25-50' | '50-100' | '100+';
type RatingFilter = 'all' | '4.5+' | '4.0+' | '3.5+';
type DeliveryFilter = 'all' | '1-2' | '3-5' | '7+';

interface FilterState {
  category: string;
  priceRange: PriceRange;
  rating: RatingFilter;
  delivery: DeliveryFilter;
  skills: string[];
}

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

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

/* ------------------------------------------------------------------ */
/*  Trending Data                                                      */
/* ------------------------------------------------------------------ */

const TRENDING_ITEMS = [
  { label: 'React Development', change: '+34%', icon: TrendingUp },
  { label: 'AI/ML Integration', change: '+28%', icon: Flame },
  { label: 'Brand Design', change: '+22%', icon: TrendingUp },
  { label: 'Video Editing', change: '+19%', icon: Flame },
  { label: 'Data Analysis', change: '+15%', icon: TrendingUp },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MarketplacePage() {
  const { profile: _profile } = useAuth();

  /* --- State --- */
  const [activeTab, setActiveTab] = useState<TabKey>('gigs');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    delivery: 'all',
    skills: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  /* --- Filtered data --- */
  const priceInRange = useCallback(
    (price: number) => {
      switch (filters.priceRange) {
        case '0-25':
          return price <= 25;
        case '25-50':
          return price > 25 && price <= 50;
        case '50-100':
          return price > 50 && price <= 100;
        case '100+':
          return price > 100;
        default:
          return true;
      }
    },
    [filters.priceRange],
  );

  const ratingInRange = useCallback(
    (rating: number) => {
      switch (filters.rating) {
        case '4.5+':
          return rating >= 4.5;
        case '4.0+':
          return rating >= 4.0;
        case '3.5+':
          return rating >= 3.5;
        default:
          return true;
      }
    },
    [filters.rating],
  );

  const deliveryInRange = useCallback(
    (days: number) => {
      switch (filters.delivery) {
        case '1-2':
          return days >= 1 && days <= 2;
        case '3-5':
          return days >= 3 && days <= 5;
        case '7+':
          return days >= 7;
        default:
          return true;
      }
    },
    [filters.delivery],
  );

  const filteredGigs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_GIGS.filter((g) => {
      if (q && !g.title.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) return false;
      if (filters.category !== 'all' && g.category_id !== filters.category) return false;
      if (!priceInRange(g.price)) return false;
      if (!ratingInRange(g.rating)) return false;
      if (!deliveryInRange(g.delivery_days)) return false;
      if (filters.skills.length > 0) {
        const gigSkillNames = (g.skills ?? []).map((s) => s.name);
        if (!filters.skills.some((fs) => gigSkillNames.includes(fs))) return false;
      }
      return true;
    });
  }, [searchQuery, filters, priceInRange, ratingInRange, deliveryInRange]);

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_TASKS.filter((t) => {
      if (activeTab === 'micro' && !t.is_micro) return false;
      if (activeTab === 'tasks' && t.is_micro) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      if (filters.category !== 'all' && t.category_id !== filters.category) return false;
      if (!priceInRange(t.budget_min)) return false;
      if (filters.skills.length > 0) {
        const taskSkillNames = (t.skills ?? []).map((s) => s.name);
        if (!filters.skills.some((fs) => taskSkillNames.includes(fs))) return false;
      }
      return true;
    });
  }, [searchQuery, filters, activeTab, priceInRange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.rating !== 'all') count++;
    if (filters.delivery !== 'all') count++;
    if (filters.skills.length > 0) count++;
    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters({ category: 'all', priceRange: 'all', rating: 'all', delivery: 'all', skills: [] });
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

  const displayedGigs = filteredGigs.slice(0, visibleCount);
  const displayedTasks = filteredTasks.slice(0, visibleCount);
  const hasMore = activeTab === 'gigs' ? filteredGigs.length > visibleCount : filteredTasks.length > visibleCount;

  /* --- Render helpers --- */

  const FilterSidebar = () => (
    <aside
      className={`${
        showFilters ? 'fixed inset-0 z-40 bg-black/40 lg:relative lg:bg-transparent' : 'hidden lg:block'
      }`}
    >
      <div
        className={`${
          showFilters ? 'fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl lg:relative lg:shadow-none lg:w-full' : 'w-full'
        } p-5 lg:p-0 overflow-y-auto`}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
          <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
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

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {activeTab === 'gigs' ? 'Price Range' : 'Budget Range'}
          </h4>
          <div className="space-y-1">
            {([
              ['all', 'Any Price'],
              ['0-25', 'Under $25'],
              ['25-50', '$25 - $50'],
              ['50-100', '$50 - $100'],
              ['100+', '$100+'],
            ] as [PriceRange, string][]).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilters((p) => ({ ...p, priceRange: val }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.priceRange === val
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating (gigs only) */}
        {activeTab === 'gigs' && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Minimum Rating</h4>
            <div className="space-y-1">
              {([
                ['all', 'Any Rating'],
                ['4.5+', '4.5+ Stars'],
                ['4.0+', '4.0+ Stars'],
                ['3.5+', '3.5+ Stars'],
              ] as [RatingFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilters((p) => ({ ...p, rating: val }))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.rating === val
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Time (gigs only) */}
        {activeTab === 'gigs' && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Delivery Time</h4>
            <div className="space-y-1">
              {([
                ['all', 'Any Time'],
                ['1-2', '1-2 Days'],
                ['3-5', '3-5 Days'],
                ['7+', '7+ Days'],
              ] as [DeliveryFilter, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilters((p) => ({ ...p, delivery: val }))}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filters.delivery === val
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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
  );

  const GigCard = ({ gig }: { gig: Gig }) => (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
      {/* Image placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase className="w-10 h-10 text-emerald-300 dark:text-emerald-700" />
        </div>
        {gig.is_featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Featured
          </span>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 backdrop-blur-sm">
          {gig.views.toLocaleString()} views
        </div>
      </div>

      <div className="p-4">
        {/* Category */}
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{gig.category?.name}</span>

        {/* Title */}
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
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Lvl {gig.freelancer.freelancer_profile.level}
            </span>
          )}
        </div>

        {/* Rating + Delivery */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            {renderStars(gig.rating)}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{gig.rating}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">({gig.review_count})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{gig.delivery_days}d</span>
          </div>
        </div>

        {/* Skills */}
        {gig.skills && gig.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {gig.skills.slice(0, 3).map((s) => (
              <Badge key={s.id} label={s.name} variant="default" size="sm" />
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">${gig.price}</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );

  const GigListCard = ({ gig }: { gig: Gig }) => (
    <div className="group flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
      {/* Image placeholder */}
      <div className="hidden sm:flex w-32 h-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 items-center justify-center">
        <Briefcase className="w-6 h-6 text-emerald-300 dark:text-emerald-700" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{gig.category?.name}</span>
            <h3 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-white leading-snug truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {gig.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold">
                {getInitials(gig.freelancer?.full_name ?? 'U')}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">{gig.freelancer?.full_name}</span>
              <span className="text-xs text-slate-400">|</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{gig.rating}</span>
                <span className="text-xs text-slate-400">({gig.review_count})</span>
              </div>
              <span className="text-xs text-slate-400">|</span>
              <div className="flex items-center gap-0.5 text-slate-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{gig.delivery_days}d delivery</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-bold text-slate-900 dark:text-white">${gig.price}</span>
          </div>
        </div>

        {gig.skills && gig.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {gig.skills.slice(0, 4).map((s) => (
              <Badge key={s.id} label={s.name} variant="default" size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const TaskCard = ({ task }: { task: Task }) => {
    const daysLeft = daysUntil(task.deadline);
    const isMicro = task.is_micro;

    return (
      <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge label={task.category?.name ?? ''} variant="info" size="sm" />
          {task.is_urgent && <Badge label="Urgent" variant="danger" size="sm" />}
          {isMicro && <Badge label="Micro" variant="warning" size="sm" />}
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
            {/* Budget */}
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-900 dark:text-white">${task.budget_min}</span>
              <span className="text-slate-400">-</span>
              <span className="font-semibold text-slate-900 dark:text-white">${task.budget_max}</span>
            </div>
            {/* Deadline */}
            {daysLeft !== null && (
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className={`${daysLeft <= 3 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {daysLeft}d left
                </span>
              </div>
            )}
            {/* Applications */}
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{task.applications_count} apps</span>
            </div>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
            Apply Now
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  };

  const MicroTaskCard = ({ task }: { task: Task }) => {
    const daysLeft = daysUntil(task.deadline);
    const deadlineVariant = daysLeft !== null && daysLeft <= 1 ? 'danger' : daysLeft !== null && daysLeft <= 3 ? 'warning' : 'default';

    return (
      <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {task.is_urgent && <Badge label="Urgent" variant="danger" size="sm" />}
              <Badge label={`${daysLeft ?? '?'}hr left`} variant={deadlineVariant} size="sm" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {task.title}
            </h4>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${task.budget_min}</span>
            {task.budget_max > task.budget_min && (
              <span className="text-sm text-slate-400 dark:text-slate-500">-${task.budget_max}</span>
            )}
          </div>
        </div>

        {/* Skills */}
        {task.skills && task.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.skills.map((s) => (
              <Badge key={s.id} label={s.name} variant="default" size="sm" />
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Briefcase className="w-3 h-3" />
            <span>{task.applications_count} apps</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
            Quick Apply
          </button>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ---------------------------------------------------------- */}
      {/* HERO SECTION                                                */}
      {/* ---------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-950">
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-300/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Find Your Next
              <span className="block text-emerald-200">Campus Collaboration</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
              Browse gigs, tasks, and micro-projects from verified students. Get things done by talented peers on your campus.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Search gigs, tasks, skills..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-lg shadow-black/5 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilters((p) => ({ ...p, category: filters.category === cat.id ? 'all' : cat.id }));
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === cat.id
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* TRENDING BAR                                                */}
      {/* ---------------------------------------------------------- */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Trending
            </span>
            {TRENDING_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setSearchQuery(item.label.split(' ')[0]);
                    setVisibleCount(6);
                  }}
                  className="flex items-center gap-1.5 flex-shrink-0 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{item.change}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* MAIN CONTENT                                                */}
      {/* ---------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
            {([
              { key: 'gigs' as TabKey, label: 'Gigs', count: filteredGigs.length },
              { key: 'tasks' as TabKey, label: 'Tasks', count: MOCK_TASKS.filter((t) => !t.is_micro).length },
              { key: 'micro' as TabKey, label: 'Micro Tasks', count: MOCK_TASKS.filter((t) => t.is_micro).length },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setVisibleCount(6);
                }}
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

          {/* View toggle + filter btn */}
          <div className="flex items-center gap-3">
            {/* View mode toggle (gigs only) */}
            {activeTab === 'gigs' && (
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Filter button (mobile) */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
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
              <select className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer">
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
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
            {filters.priceRange !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, priceRange: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.priceRange === '100+' ? '$100+' : `$${filters.priceRange.replace('-', ' - $')}`}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.rating !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, rating: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.rating} Stars
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.delivery !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, delivery: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.delivery === '7+' ? '7+ days' : `${filters.delivery} days`}
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

        {/* Layout: sidebar + content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile filter overlay */}
          {showFilters && <FilterSidebar />}

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {/* Gigs tab */}
            {activeTab === 'gigs' && (
              <>
                {filteredGigs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No gigs found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {displayedGigs.map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedGigs.map((gig) => (
                      <GigListCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Tasks tab */}
            {activeTab === 'tasks' && (
              <>
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No tasks found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {displayedTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Micro Tasks tab */}
            {activeTab === 'micro' && (
              <>
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No micro tasks found</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {displayedTasks.map((task) => (
                      <MicroTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </>
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

            {/* Results count */}
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {activeTab === 'gigs'
                ? `Showing ${Math.min(visibleCount, filteredGigs.length)} of ${filteredGigs.length} gigs`
                : `Showing ${Math.min(visibleCount, filteredTasks.length)} of ${filteredTasks.length} ${activeTab === 'micro' ? 'micro tasks' : 'tasks'}`}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
