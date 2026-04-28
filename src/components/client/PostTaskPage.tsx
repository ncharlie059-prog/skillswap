import { useState, useMemo, useCallback } from 'react';
import {
  DollarSign,
  Clock,
  Tag,
  Zap,
  AlertCircle,
  Send,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Category, Skill } from '../../types';
import { AITaskDescriber } from '../ai/AIAssistant';

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
  { id: 'sk-11', name: 'Node.js', created_at: '' },
  { id: 'sk-12', name: 'Canva', created_at: '' },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TaskFormData {
  title: string;
  description: string;
  category_id: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  skill_ids: string[];
  is_micro: boolean;
  is_urgent: boolean;
  is_instant_hire: boolean;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  category_id: '',
  budget_min: 500,
  budget_max: 2000,
  deadline: '',
  skill_ids: [],
  is_micro: false,
  is_urgent: false,
  is_instant_hire: false,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateShort(dateStr: string): string {
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PostTaskPage() {
  const { profile } = useAuth();

  /* --- State --- */
  const [formData, setFormData] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /* --- Derived --- */
  const selectedCategory = useMemo(
    () => MOCK_CATEGORIES.find((c) => c.id === formData.category_id),
    [formData.category_id]
  );

  const selectedSkills = useMemo(
    () => MOCK_SKILLS.filter((s) => formData.skill_ids.includes(s.id)),
    [formData.skill_ids]
  );

  const isFormValid = useMemo(() => {
    return (
      formData.title.trim().length >= 5 &&
      formData.description.trim().length >= 20 &&
      formData.category_id !== '' &&
      formData.budget_min > 0 &&
      formData.budget_max >= formData.budget_min &&
      formData.budget_min < 100000 &&
      formData.budget_max < 100000
    );
  }, [formData]);

  /* --- Handlers --- */
  const updateField = useCallback(
    <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const toggleSkill = useCallback((skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter((id) => id !== skillId)
        : [...prev.skill_ids, skillId],
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }
    if (formData.budget_min <= 0) {
      newErrors.budget_min = 'Minimum budget must be greater than 0';
    }
    if (formData.budget_max < formData.budget_min) {
      newErrors.budget_max = 'Maximum budget must be at least the minimum';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    // In production, this would call supabase to insert the task
    setSubmitted(true);
  }, [validate]);

  const handleReset = useCallback(() => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setShowPreview(false);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render: Submitted State                                          */
  /* ---------------------------------------------------------------- */

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5">
              <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Task Posted Successfully!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 max-w-md mx-auto">
              Your task "<span className="font-medium text-slate-700 dark:text-slate-300">{formData.title}</span>" is now live and visible to freelancers across campus.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">
              Budget: {formatCurrencyINR(formData.budget_min)} &ndash; {formatCurrencyINR(formData.budget_max)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Post Another Task
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
                View My Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render: Form                                                     */
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Post a New Task</h1>
            <p className="mt-1 text-emerald-100 text-sm sm:text-base max-w-xl">
              Describe what you need, set your budget, and let talented freelancers on campus apply to your project.
            </p>
          </div>
        </div>

        {/* ===== Form + Preview Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ===== Left: Form (2 cols) ===== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 transition-colors duration-300">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., Build a responsive portfolio website"
                  maxLength={120}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                    errors.title ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {formData.title.length}/120 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your task in detail. Include deliverables, requirements, and any specific tools or technologies you prefer..."
                  rows={6}
                  maxLength={2000}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                    errors.description ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                  } text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {formData.description.length}/2000 characters (minimum 20)
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.category_id}
                    onChange={(e) => updateField('category_id', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl appearance-none bg-white dark:bg-slate-900 border ${
                      errors.category_id ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                    } text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all cursor-pointer`}
                  >
                    <option value="">Select a category</option>
                    {MOCK_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.category_id && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.category_id}
                  </p>
                )}
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget Range (INR) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={100}
                        max={99999}
                        value={formData.budget_min}
                        onChange={(e) => updateField('budget_min', Number(e.target.value))}
                        placeholder="Min budget"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                          errors.budget_min ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                        } text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.budget_min && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.budget_min}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={100}
                        max={99999}
                        value={formData.budget_max}
                        onChange={(e) => updateField('budget_max', Number(e.target.value))}
                        placeholder="Max budget"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                          errors.budget_max ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                        } text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all`}
                      />
                    </div>
                    {errors.budget_max && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.budget_max}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  Set a realistic range to attract qualified freelancers
                </p>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deadline
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateField('deadline', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  Leave empty for a flexible deadline
                </p>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Required Skills
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
                {selectedSkills.length > 0 && (
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                    {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Task Options
                </h3>

                {/* Micro Task */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Micro Task</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Small tasks that can be completed in under a day
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateField('is_micro', !formData.is_micro)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      formData.is_micro ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        formData.is_micro ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Urgent */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Urgent</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Mark as urgent to attract faster responses
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateField('is_urgent', !formData.is_urgent)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      formData.is_urgent ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        formData.is_urgent ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Hire */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Instant Hire</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Skip the application process and hire directly
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateField('is_instant_hire', !formData.is_instant_hire)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      formData.is_instant_hire ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        formData.is_instant_hire ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none"
                >
                  <Send className="w-4 h-4" />
                  Post Task
                </button>
              </div>
            </div>
          </div>

          {/* ===== Right: Preview Card ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* AI Task Describer */}
              <AITaskDescriber onApply={(desc) => {
                updateField('title', desc.title);
                updateField('description', desc.description);
                updateField('budget_min', desc.budgetMin);
                updateField('budget_max', desc.budgetMax);
              }} />
              {/* Preview toggle (mobile) */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="lg:hidden w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span>Preview Task Card</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showPreview ? 'rotate-180' : ''}`} />
              </button>

              <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300 ${showPreview ? 'block' : 'hidden lg:block'}`}>
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Live Preview
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    How your task will appear to freelancers
                  </p>
                </div>

                <div className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {selectedCategory && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {selectedCategory.name}
                      </span>
                    )}
                    {formData.is_urgent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Urgent
                      </span>
                    )}
                    {formData.is_micro && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Micro Task
                      </span>
                    )}
                    {formData.is_instant_hire && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Zap className="w-3 h-3" />
                        Instant Hire
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug min-h-[1.5rem]">
                    {formData.title || 'Your task title will appear here...'}
                  </h4>

                  {/* Description */}
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed min-h-[2.5rem]">
                    {formData.description || 'Add a description to help freelancers understand your requirements.'}
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold">
                      {profile?.full_name
                        ? profile.full_name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
                        : 'YO'}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {profile?.full_name || 'You'}
                    </span>
                  </div>

                  {/* Skills */}
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedSkills.map((s) => (
                        <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm">
                        <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrencyINR(formData.budget_min)}
                        </span>
                        <span className="text-slate-400">&ndash;</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrencyINR(formData.budget_max)}
                        </span>
                      </div>
                    </div>
                    {formData.deadline && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className={`${daysUntil(formData.deadline) !== null && daysUntil(formData.deadline)! <= 3 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                          {daysUntil(formData.deadline) !== null ? `${daysUntil(formData.deadline)}d left` : 'No deadline'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">
                          ({formatDateShort(formData.deadline)})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Apply CTA */}
                  <button
                    disabled
                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold opacity-70 cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply Now
                  </button>
                </div>
              </div>

              {/* Tip card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Tips for a Great Task</h3>
                </div>
                <ul className="text-sm text-emerald-100 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Be specific about deliverables</li>
                  <li>Set a realistic budget range</li>
                  <li>Mention required tools or tech</li>
                  <li>Add a deadline for urgency</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

