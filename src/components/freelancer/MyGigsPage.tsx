import { useState, useMemo, useCallback } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, Star, Clock, DollarSign, Search, Pause, Play, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Gig, Category, Skill } from '../../types';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { AIGigSuggestor } from '../ai/AIAssistant';

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

const INITIAL_GIGS: Gig[] = [
  {
    id: 'my-gig-1',
    freelancer_id: 'u-1',
    category_id: 'cat-1',
    title: 'Build a Responsive React Landing Page',
    description:
      'I will create a modern, responsive landing page using React and Tailwind CSS. Pixel-perfect design with smooth animations and fully optimized for mobile.',
    price: 499,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 127,
    views: 1840,
    is_featured: true,
    created_at: '2026-03-15T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[9]],
  },
  {
    id: 'my-gig-2',
    freelancer_id: 'u-1',
    category_id: 'cat-2',
    title: 'Design a Professional Logo & Brand Kit',
    description:
      'Complete brand identity package including logo, color palette, typography guide, and social media templates tailored for your startup.',
    price: 799,
    delivery_days: 5,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 4.8,
    review_count: 89,
    views: 1230,
    is_featured: false,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-04-18T00:00:00Z',
    category: MOCK_CATEGORIES[1],
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[3]],
  },
  {
    id: 'my-gig-3',
    freelancer_id: 'u-1',
    category_id: 'cat-3',
    title: 'Edit a Cinematic YouTube Video',
    description:
      'Professional video editing with color grading, transitions, sound design, and motion graphics for your YouTube channel.',
    price: 349,
    delivery_days: 2,
    revisions: 2,
    image_url: '',
    status: 'paused',
    rating: 4.7,
    review_count: 56,
    views: 780,
    is_featured: false,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
    category: MOCK_CATEGORIES[2],
    skills: [MOCK_SKILLS[4]],
  },
  {
    id: 'my-gig-4',
    freelancer_id: 'u-1',
    category_id: 'cat-4',
    title: 'Write SEO-Optimized Blog Articles',
    description:
      'High-quality, researched blog posts that rank. Includes keyword research, meta descriptions, and internal linking strategy.',
    price: 249,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 5.0,
    review_count: 34,
    views: 560,
    is_featured: false,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
    category: MOCK_CATEGORIES[3],
    skills: [MOCK_SKILLS[7]],
  },
  {
    id: 'my-gig-5',
    freelancer_id: 'u-1',
    category_id: 'cat-5',
    title: 'Develop a Cross-Platform Flutter App',
    description:
      'End-to-end mobile app development with Flutter. Includes UI design, API integration, and deployment to both stores.',
    price: 1999,
    delivery_days: 14,
    revisions: 5,
    image_url: '',
    status: 'paused',
    rating: 4.6,
    review_count: 18,
    views: 920,
    is_featured: false,
    created_at: '2026-02-28T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    skills: [MOCK_SKILLS[6]],
  },
  {
    id: 'my-gig-6',
    freelancer_id: 'u-1',
    category_id: 'cat-6',
    title: 'Build Interactive Data Dashboards',
    description:
      'Custom dashboards with real-time data visualization using Python, Plotly, and Streamlit. Turn your data into insights.',
    price: 899,
    delivery_days: 7,
    revisions: 4,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 42,
    views: 670,
    is_featured: true,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-04-19T00:00:00Z',
    category: MOCK_CATEGORIES[5],
    skills: [MOCK_SKILLS[2]],
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GigStatusFilter = 'all' | 'active' | 'paused' | 'deleted';

interface GigFormData {
  title: string;
  description: string;
  category_id: string;
  price: number;
  delivery_days: number;
  revisions: number;
  skill_ids: string[];
}

const EMPTY_FORM: GigFormData = {
  title: '',
  description: '',
  category_id: '',
  price: 500,
  delivery_days: 3,
  revisions: 2,
  skill_ids: [],
};

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

const statusVariantMap: Record<Gig['status'], 'success' | 'warning' | 'danger' | 'default'> = {
  active: 'success',
  paused: 'warning',
  deleted: 'danger',
};

const statusLabelMap: Record<Gig['status'], string> = {
  active: 'Active',
  paused: 'Paused',
  deleted: 'Deleted',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MyGigsPage() {
  const { profile } = useAuth();

  /* --- State --- */
  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [statusFilter, setStatusFilter] = useState<GigStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [deletingGig, setDeletingGig] = useState<Gig | null>(null);
  const [formData, setFormData] = useState<GigFormData>(EMPTY_FORM);

  // Dropdown state for each gig card
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* --- Derived data --- */
  const filteredGigs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return gigs.filter((g) => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;
      if (g.status === 'deleted' && statusFilter !== 'deleted') return false;
      if (q && !g.title.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [gigs, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const visible = gigs.filter((g) => g.status !== 'deleted');
    return {
      total: visible.length,
      active: visible.filter((g) => g.status === 'active').length,
      paused: visible.filter((g) => g.status === 'paused').length,
    };
  }, [gigs]);

  /* --- Handlers --- */
  const handleCreate = useCallback(() => {
    setFormData(EMPTY_FORM);
    setEditingGig(null);
    setShowCreateModal(true);
  }, []);

  const handleEdit = useCallback((gig: Gig) => {
    setFormData({
      title: gig.title,
      description: gig.description,
      category_id: gig.category_id,
      price: gig.price,
      delivery_days: gig.delivery_days,
      revisions: gig.revisions,
      skill_ids: (gig.skills ?? []).map((s) => s.id),
    });
    setEditingGig(gig);
    setShowCreateModal(true);
    setOpenMenuId(null);
  }, []);

  const handleTogglePause = useCallback((gig: Gig) => {
    setGigs((prev) =>
      prev.map((g) =>
        g.id === gig.id
          ? { ...g, status: g.status === 'paused' ? ('active' as const) : ('paused' as const) }
          : g
      )
    );
    setOpenMenuId(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deletingGig) return;
    setGigs((prev) => prev.filter((g) => g.id !== deletingGig.id));
    setDeletingGig(null);
  }, [deletingGig]);

  const handleSave = useCallback(() => {
    if (!formData.title.trim() || !formData.category_id) return;

    const selectedSkills = MOCK_SKILLS.filter((s) => formData.skill_ids.includes(s.id));
    const selectedCategory = MOCK_CATEGORIES.find((c) => c.id === formData.category_id);

    if (editingGig) {
      setGigs((prev) =>
        prev.map((g) =>
          g.id === editingGig.id
            ? {
                ...g,
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id,
                price: formData.price,
                delivery_days: formData.delivery_days,
                revisions: formData.revisions,
                category: selectedCategory,
                skills: selectedSkills,
                updated_at: new Date().toISOString(),
              }
            : g
        )
      );
    } else {
      const newGig: Gig = {
        id: `gig-new-${Date.now()}`,
        freelancer_id: profile?.id ?? 'u-1',
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        delivery_days: formData.delivery_days,
        revisions: formData.revisions,
        image_url: '',
        status: 'active',
        rating: 0,
        review_count: 0,
        views: 0,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: selectedCategory,
        skills: selectedSkills,
      };
      setGigs((prev) => [newGig, ...prev]);
    }

    setShowCreateModal(false);
    setEditingGig(null);
    setFormData(EMPTY_FORM);
  }, [formData, editingGig, profile]);

  const toggleSkill = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter((id) => id !== skillId)
        : [...prev.skill_ids, skillId],
    }));
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Gigs
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your service offerings and track their performance
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            Create New Gig
          </button>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Gigs</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <Play className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Paused</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.paused}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <Pause className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Search & Filter Bar ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your gigs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
            {([
              { key: 'all' as GigStatusFilter, label: 'All' },
              { key: 'active' as GigStatusFilter, label: 'Active' },
              { key: 'paused' as GigStatusFilter, label: 'Paused' },
            ]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === key
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Gig List ===== */}
        {filteredGigs.length === 0 ? (
          <EmptyState
            icon={<Plus className="w-7 h-7" />}
            title="No gigs yet"
            description="Create your first gig to start offering your skills to the campus community"
            action={
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Your First Gig
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredGigs.map((gig) => (
              <div
                key={gig.id}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image placeholder */}
                  <div className="sm:w-48 flex-shrink-0 h-32 sm:h-auto bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-emerald-300 dark:text-emerald-700" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Title + badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {gig.title}
                          </h3>
                          <Badge
                            label={statusLabelMap[gig.status]}
                            variant={statusVariantMap[gig.status]}
                            size="sm"
                          />
                          {gig.is_featured && (
                            <Badge label="Featured" variant="info" size="sm" />
                          )}
                        </div>

                        {/* Category */}
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                          {gig.category?.name}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {gig.description}
                        </p>

                        {/* Skills */}
                        {gig.skills && gig.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {gig.skills.map((s) => (
                              <Badge key={s.id} label={s.name} variant="default" size="sm" />
                            ))}
                          </div>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(gig.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{gig.delivery_days}d delivery</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                            <span>{gig.revisions} revisions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(gig.rating)}
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">
                              {gig.rating > 0 ? gig.rating : 'New'}
                            </span>
                            {gig.review_count > 0 && (
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                ({gig.review_count})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{gig.views.toLocaleString()} views</span>
                          </div>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            Updated {formatDate(gig.updated_at)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === gig.id ? null : gig.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>

                        {/* Dropdown menu */}
                        {openMenuId === gig.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 w-44 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button
                                onClick={() => handleEdit(gig)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                <Edit className="w-4 h-4 text-slate-400" />
                                Edit Gig
                              </button>
                              <button
                                onClick={() => handleTogglePause(gig)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                {gig.status === 'paused' ? (
                                  <>
                                    <Play className="w-4 h-4 text-emerald-500" />
                                    Resume Gig
                                  </>
                                ) : (
                                  <>
                                    <Pause className="w-4 h-4 text-amber-500" />
                                    Pause Gig
                                  </>
                                )}
                              </button>
                              <div className="my-1.5 border-t border-slate-100 dark:border-slate-700" />
                              <button
                                onClick={() => {
                                  setDeletingGig(gig);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Gig
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Create / Edit Gig Modal ===== */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingGig(null);
            setFormData(EMPTY_FORM);
          }}
          title={editingGig ? 'Edit Gig' : 'Create New Gig'}
          size="lg"
        >
          <div className="space-y-5">
            {/* AI Gig Suggestor */}
            <AIGigSuggestor onApply={(suggestion) => {
              setFormData((p) => ({
                ...p,
                title: suggestion.title,
                description: suggestion.description,
                price: suggestion.priceMin,
                delivery_days: suggestion.deliveryDays,
              }));
            }} />

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Gig Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g., I will design a modern logo for your brand"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe what you offer, what's included, and any requirements..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData((p) => ({ ...p, category_id: e.target.value }))}
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

            {/* Price, Delivery, Revisions row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Price (INR)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={100}
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Delivery Days
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.delivery_days}
                    onChange={(e) => setFormData((p) => ({ ...p, delivery_days: Number(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Revisions
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={formData.revisions}
                  onChange={(e) => setFormData((p) => ({ ...p, revisions: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {MOCK_SKILLS.map((skill) => {
                  const active = formData.skill_ids.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        active
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                      }`}
                    >
                      {skill.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingGig(null);
                  setFormData(EMPTY_FORM);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim() || !formData.category_id}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
              >
                {editingGig ? 'Save Changes' : 'Create Gig'}
              </button>
            </div>
          </div>
        </Modal>

        {/* ===== Delete Confirmation Modal ===== */}
        <Modal
          isOpen={!!deletingGig}
          onClose={() => setDeletingGig(null)}
          title="Delete Gig"
          size="sm"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 mx-auto">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Are you sure you want to delete
              <span className="font-semibold text-slate-900 dark:text-white"> "{deletingGig?.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingGig(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Delete Gig
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
