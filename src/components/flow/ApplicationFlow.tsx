import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Send,
  ArrowRight,
  ArrowLeft,
  FileText,
  Upload,
  MessageSquare,
  Shield,
  AlertCircle,
  ChevronRight,
  Briefcase,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  X,
  Download,
  IndianRupee,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Application, Order, OrderStatus, Review } from '../../types';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

export type FlowMode = 'freelancer' | 'client';

export type FlowStep =
  | 'applied'
  | 'hired'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'completed'
  | 'paid'
  | 'reviewed';

const FLOW_STEPS: { key: FlowStep; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'hired', label: 'Hired' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'completed', label: 'Completed' },
  { key: 'paid', label: 'Paid' },
  { key: 'reviewed', label: 'Reviewed' },
];

const STEP_INDEX: Record<FlowStep, number> = Object.fromEntries(
  FLOW_STEPS.map((s, i) => [s.key, i])
) as Record<FlowStep, number>;

const QUICK_TAGS: string[] = [
  'Great Communication',
  'On Time',
  'Quality Work',
  'Professional',
  'Responsive',
  'Creative',
  'Easy to Work With',
  'Exceeded Expectations',
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const MOCK_TASK = {
  id: 'task-001',
  title: 'Build a Portfolio Website with React & Tailwind',
  description:
    'Need a modern, responsive portfolio website for a design student. Must include project gallery, about section, contact form, and dark mode support. Mobile-first approach required.',
  budget_min: 3000,
  budget_max: 8000,
  deadline: '2026-05-15',
  category: 'Web Development',
  skills: ['React', 'Tailwind CSS', 'TypeScript', 'Figma'],
  is_micro: false,
  is_urgent: false,
  client_name: 'Priya Sharma',
  client_avatar: 'PS',
  client_rating: 4.8,
  client_orders: 12,
};

const MOCK_ORDER: Order = {
  id: 'ord-001',
  gig_id: null,
  task_id: 'task-001',
  client_id: 'client-001',
  freelancer_id: 'freelancer-001',
  title: 'Build a Portfolio Website with React & Tailwind',
  description: 'Portfolio website with project gallery, about section, contact form, and dark mode.',
  price: 5500,
  deadline: '2026-05-15',
  status: 'open',
  revisions_count: 0,
  max_revisions: 3,
  files: [],
  created_at: '2026-04-20T10:00:00Z',
  updated_at: '2026-04-20T10:00:00Z',
};

const MOCK_APPLICATION: Application = {
  id: 'app-001',
  task_id: 'task-001',
  freelancer_id: 'freelancer-001',
  cover_letter:
    'I have 2+ years of experience building React applications with Tailwind CSS. I have previously built portfolio sites for design students and understand the aesthetic requirements. I can deliver within the deadline with all requested features.',
  proposed_budget: 5000,
  proposed_deadline: '2026-05-10',
  status: 'pending',
  created_at: '2026-04-22T14:30:00Z',
};

// ---------------------------------------------------------------------------
// Sub-Components
// ---------------------------------------------------------------------------

function FlowTracker({ currentStep, mode: _mode }: { currentStep: FlowStep; mode: FlowMode }) {
  const currentIndex = STEP_INDEX[currentStep];

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-[640px] gap-0">
        {FLOW_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          void isUpcoming;

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step circle + label */}
              <div className="flex flex-col items-center min-w-[64px]">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-500
                    ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : isCurrent
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/40 animate-pulse ring-4 ring-teal-500/20'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-1.5 text-[10px] sm:text-xs font-medium text-center leading-tight whitespace-nowrap
                    ${
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-slate-400 dark:text-slate-500'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < FLOW_STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 rounded-full relative overflow-hidden">
                  <div
                    className={`
                      absolute inset-0 transition-all duration-700
                      ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : isCurrent
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-slate-200 dark:bg-slate-700'
                      }
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ApplicationStep({
  mode,
  onApply,
  onQuickApply,
}: {
  mode: FlowMode;
  onApply: (data: { coverLetter: string; budget: number; deadline: string }) => void;
  onQuickApply: () => void;
}) {
  const [coverLetter, setCoverLetter] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const canSubmit = coverLetter.length >= 20 && budget && Number(budget) > 0 && deadline;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
          <Send className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {mode === 'freelancer' ? 'Apply to This Task' : 'View Application'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'freelancer'
              ? 'Tell the client why you are the best fit'
              : 'Review the freelancer application'}
          </p>
        </div>
      </div>

      {/* Task summary card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {MOCK_TASK.title}
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {MOCK_TASK.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {MOCK_TASK.skills.map((s) => (
                <Badge key={s} label={s} variant="info" size="sm" />
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <IndianRupee className="w-4 h-4" />
              {MOCK_TASK.budget_min.toLocaleString()} - {MOCK_TASK.budget_max.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Due {MOCK_TASK.deadline}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {MOCK_TASK.client_avatar}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {MOCK_TASK.client_name}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-slate-500">{MOCK_TASK.client_rating}</span>
              <span className="text-xs text-slate-400 ml-1">
                ({MOCK_TASK.client_orders} orders)
              </span>
            </div>
          </div>
        </div>
      </div>

      {mode === 'freelancer' && (
        <>
          {/* Quick apply for micro-tasks */}
          {MOCK_TASK.is_micro && (
            <div className="rounded-2xl border border-dashed border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Quick Apply
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      One-click apply for micro-tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={onQuickApply}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-all active:scale-95"
                >
                  Quick Apply
                </button>
              </div>
            </div>
          )}

          {/* Cover letter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Explain why you are the best fit for this task. Highlight relevant experience, skills, and your approach..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">
                Minimum 20 characters
              </span>
              <span
                className={`text-xs ${
                  coverLetter.length >= 20
                    ? 'text-emerald-500'
                    : 'text-slate-400'
                }`}
              >
                {coverLetter.length} / 20+
              </span>
            </div>
          </div>

          {/* Proposed budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Proposed Budget (INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
                />
              </div>
              {budget && Number(budget) > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Platform fee (10%): Rs. {Math.round(Number(budget) * 0.1).toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Proposed Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={() =>
              onApply({
                coverLetter,
                budget: Number(budget),
                deadline,
              })
            }
            disabled={!canSubmit}
            className={`
              w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-[0.98]
              ${
                canSubmit
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
            Submit Application
          </button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function HiredStep({
  mode,
  onStartWork,
  onViewProgress,
  order,
}: {
  mode: FlowMode;
  onStartWork: () => void;
  onViewProgress: () => void;
  order: Order;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Congratulations banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {mode === 'freelancer'
            ? 'Congratulations! You Got the Job!'
            : 'Freelancer Hired!'}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mode === 'freelancer'
            ? 'Your application was accepted. Time to get to work!'
            : 'The freelancer has been notified. Wait for them to start work.'}
        </p>
      </div>

      {/* Order details */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-teal-500" />
          <h4 className="font-semibold text-slate-900 dark:text-white">Order Details</h4>
          <Badge label={order.status} variant="success" size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Order ID</p>
            <p className="font-medium text-slate-900 dark:text-white">{order.id}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Title</p>
            <p className="font-medium text-slate-900 dark:text-white">{order.title}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Budget</p>
            <p className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              {order.price.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Deadline</p>
            <p className="font-medium text-slate-900 dark:text-white">{order.deadline}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Max Revisions</p>
            <p className="font-medium text-slate-900 dark:text-white">{order.max_revisions}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Created</p>
            <p className="font-medium text-slate-900 dark:text-white">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Escrow notice */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Escrow Protection Active
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            {mode === 'client'
              ? 'Your payment is held in escrow and will only be released when you approve the work.'
              : 'Your payment is secured in escrow. You will receive it once the client approves your work.'}
          </p>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={mode === 'freelancer' ? onStartWork : onViewProgress}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98]"
      >
        {mode === 'freelancer' ? (
          <>
            <Zap className="w-4 h-4" />
            Start Work
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            View Progress
          </>
        )}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function WorkStep({
  onSubmitWork,
  order,
}: {
  onSubmitWork: (files: UploadedFile[], notes: string) => void;
  order: Order;
}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Deadline countdown
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const deadlineDate = new Date(order.deadline);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadlineDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Overdue');
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.deadline]);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const additions: UploadedFile[] = Array.from(newFiles).map((f) => ({
      id: Math.random().toString(36).slice(2, 9),
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...additions]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isOverdue = timeLeft === 'Overdue';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Working on Order</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {order.title}
            </p>
          </div>
        </div>
        {/* Deadline countdown */}
        <div
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
            ${
              isOverdue
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            }
          `}
        >
          <Clock className="w-4 h-4" />
          {isOverdue ? 'Overdue!' : timeLeft}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar value={60} max={100} color="emerald" size="md" showLabel />

      {/* File upload zone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Upload Work Files
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`
            rounded-2xl border-2 border-dashed cursor-pointer transition-all p-8 text-center
            ${
              isDragging
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }
          `}
        >
          <Upload
            className={`w-10 h-10 mx-auto mb-3 ${
              isDragging ? 'text-teal-500' : 'text-slate-400'
            }`}
          />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Drag & drop files here or{' '}
            <span className="text-teal-500 underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            ZIP, PDF, PNG, JPG up to 50MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Uploaded Files ({files.length})
          </p>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-teal-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Progress Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Describe what you have completed, any issues, or notes for the client..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition resize-none"
        />
      </div>

      {/* Submit work */}
      <button
        onClick={() => onSubmitWork(files, notes)}
        disabled={files.length === 0}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold
          transition-all active:scale-[0.98]
          ${
            files.length > 0
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }
        `}
      >
        <Send className="w-4 h-4" />
        Submit Work
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ReviewSubmissionStep({
  mode,
  onApprove,
  onRequestRevision,
  order,
  submittedFiles,
  freelancerNotes,
  revisionCount,
}: {
  mode: FlowMode;
  onApprove: () => void;
  onRequestRevision: (feedback: string) => void;
  order: Order;
  submittedFiles: UploadedFile[];
  freelancerNotes: string;
  revisionCount: number;
}) {
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);

  if (mode === 'freelancer') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-200 dark:border-teal-800 p-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-teal-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Work Submitted
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Your work has been submitted. Waiting for the client to review and approve.
          </p>
          {revisionCount > 0 && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Revisions used: {revisionCount} / {order.max_revisions}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Client view
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
          <Eye className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Review Submission
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review the submitted work and approve or request revisions
          </p>
        </div>
      </div>

      {/* Revision count */}
      {revisionCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-amber-700 dark:text-amber-400">
            Revision {revisionCount} of {order.max_revisions} max
          </span>
        </div>
      )}

      {/* Freelancer notes */}
      {freelancerNotes && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-teal-500" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Freelancer Notes
            </h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {freelancerNotes}
          </p>
        </div>
      )}

      {/* Submitted files */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          Submitted Files ({submittedFiles.length})
        </h4>
        {submittedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-500 transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onApprove}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]"
        >
          <ThumbsUp className="w-4 h-4" />
          Approve & Release Payment
        </button>

        {!showRevisionInput ? (
          <button
            onClick={() => setShowRevisionInput(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-sm font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all active:scale-[0.98]"
          >
            <ThumbsDown className="w-4 h-4" />
            Request Revision
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-300">
              Revision Feedback
            </label>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              rows={3}
              placeholder="Explain what needs to be changed..."
              className="w-full rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (revisionFeedback.trim()) {
                    onRequestRevision(revisionFeedback);
                    setRevisionFeedback('');
                    setShowRevisionInput(false);
                  }
                }}
                disabled={!revisionFeedback.trim()}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all active:scale-[0.98]
                  ${
                    revisionFeedback.trim()
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                Send Revision Request
              </button>
              <button
                onClick={() => {
                  setShowRevisionInput(false);
                  setRevisionFeedback('');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function PaymentStep({
  mode,
  onContinue,
  order,
}: {
  mode: FlowMode;
  onContinue: () => void;
  order: Order;
}) {
  const [_animating, setAnimating] = useState(true);
  const [showRelease, setShowRelease] = useState(false);

  const commission = Math.round(order.price * 0.1);
  const netAmount = order.price - commission;

  useEffect(() => {
    const t1 = setTimeout(() => setShowRelease(true), 600);
    const t2 = setTimeout(() => setAnimating(false), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div
          className={`
            w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
            transition-all duration-700
            ${
              showRelease
                ? 'bg-emerald-500 scale-100 shadow-2xl shadow-emerald-500/40'
                : 'bg-slate-200 dark:bg-slate-700 scale-75'
            }
          `}
        >
          <IndianRupee
            className={`w-10 h-10 transition-all duration-700 ${
              showRelease ? 'text-white' : 'text-slate-400'
            }`}
          />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {mode === 'freelancer'
            ? 'Payment Released to Your Wallet!'
            : 'Payment Released from Escrow!'}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {mode === 'freelancer'
            ? `${MOCK_TASK.client_name} approved your work. Funds have been transferred.`
            : 'Escrow funds have been released to the freelancer.'}
        </p>
      </div>

      {/* Payment breakdown */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-teal-500" />
          Payment Breakdown
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Order Amount</span>
            <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              {order.price.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Platform Commission (10%)
            </span>
            <span className="font-medium text-red-500 flex items-center gap-1">
              - <IndianRupee className="w-3.5 h-3.5" />
              {commission.toLocaleString()}
            </span>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-sm">
            <span className="font-semibold text-slate-900 dark:text-white">
              {mode === 'freelancer' ? 'Net Earnings' : 'Total Paid'}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-base">
              <IndianRupee className="w-4 h-4" />
              {netAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Wallet update */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              Wallet Balance Updated
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {mode === 'freelancer'
                ? (12500 + netAmount).toLocaleString()
                : '0'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98]"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ReviewStep({
  onReview,
  mode,
  order: _order,
}: {
  onReview: (rating: number, comment: string, tags: string[]) => void;
  mode: FlowMode;
  order: Order;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canSubmit = rating > 0 && comment.length >= 10;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {mode === 'freelancer'
            ? 'Review Your Client'
            : 'Review the Freelancer'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your feedback helps build trust in the community
        </p>
      </div>

      {/* Star rating */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          How would you rate this experience?
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hovered || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      {/* Quick tags */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Quick Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  selectedTags.includes(tag)
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience working on this project..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">
          Minimum 10 characters ({comment.length}/10+)
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={() => onReview(rating, comment, selectedTags)}
        disabled={!canSubmit}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold
          transition-all active:scale-[0.98]
          ${
            canSubmit
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/25'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }
        `}
      >
        <Star className="w-4 h-4" />
        Submit Review
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function CompletionStep({
  mode,
  order,
  onBrowseMore,
  onRehire,
}: {
  mode: FlowMode;
  order: Order;
  onBrowseMore: () => void;
  onRehire: () => void;
}) {
  const commission = Math.round(order.price * 0.1);
  const netAmount = order.price - commission;
  const xpEarned = Math.round(netAmount / 10);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Order Completed!
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {mode === 'freelancer'
            ? 'Great work! You have successfully delivered this project.'
            : 'Project delivered successfully! Thank you for using SkillSwap Campus.'}
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-500" />
          Order Summary
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Order</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {order.title}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Order ID</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {order.id}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {mode === 'freelancer' ? 'Total Earned' : 'Total Spent'}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {mode === 'freelancer'
                ? netAmount.toLocaleString()
                : order.price.toLocaleString()}
            </span>
          </div>
          {mode === 'freelancer' && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Platform Fee
              </span>
              <span className="font-medium text-slate-400 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                {commission.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Revisions</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {order.revisions_count}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Completed On
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* XP earned */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
              XP Earned
            </p>
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              +{xpEarned} XP
            </p>
          </div>
        </div>
        <p className="text-xs text-teal-600 dark:text-teal-400 max-w-[160px] text-right">
          Keep completing orders to level up and unlock badges!
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {mode === 'client' ? (
          <button
            onClick={onRehire}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 transition-all active:scale-[0.98]"
          >
            <Briefcase className="w-4 h-4" />
            Rehire Freelancer
          </button>
        ) : null}
        <button
          onClick={onBrowseMore}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          Browse More Tasks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ApplicationFlow Component
// ---------------------------------------------------------------------------

interface ApplicationFlowProps {
  mode: FlowMode;
  initialStep?: number;
  demoMode?: boolean;
}

export default function ApplicationFlow({
  mode,
  initialStep = 0,
  demoMode = false,
}: ApplicationFlowProps) {
  const { profile } = useAuth();

  // State machine
  const [currentStep, setCurrentStep] = useState<FlowStep>(
    FLOW_STEPS[initialStep]?.key ?? 'applied'
  );
  const [order, setOrder] = useState<Order>({ ...MOCK_ORDER });
  const [application, setApplication] = useState<Application>({
    ...MOCK_APPLICATION,
  });
  const [submittedFiles, setSubmittedFiles] = useState<UploadedFile[]>([]);
  const [freelancerNotes, setFreelancerNotes] = useState('');
  const [revisionCount, setRevisionCount] = useState(0);
  const [_review, setReview] = useState<Review | null>(null);

  // Demo navigation
  const [showDemoNav, setShowDemoNav] = useState(false);

  // Toast-like notification
  const [notification, setNotification] = useState<string | null>(null);
  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // ---- Handlers ----

  const handleApply = (data: {
    coverLetter: string;
    budget: number;
    deadline: string;
  }) => {
    setApplication({
      ...application,
      cover_letter: data.coverLetter,
      proposed_budget: data.budget,
      proposed_deadline: data.deadline,
      status: 'pending',
    });
    setCurrentStep('applied');
    showNotif('Application submitted successfully!');
  };

  const handleQuickApply = () => {
    setApplication({
      ...application,
      cover_letter: 'Quick Apply - I am interested in this task!',
      proposed_budget: MOCK_TASK.budget_min,
      proposed_deadline: MOCK_TASK.deadline,
      status: 'pending',
    });
    setCurrentStep('applied');
    showNotif('Quick application submitted!');
  };

  const handleStartWork = () => {
    setOrder((prev) => ({ ...prev, status: 'in_progress' as OrderStatus }));
    setCurrentStep('in_progress');
    showNotif('Work started! Good luck!');
  };

  const handleViewProgress = () => {
    setCurrentStep('in_progress');
  };

  const handleSubmitWork = (files: UploadedFile[], notes: string) => {
    setSubmittedFiles(files);
    setFreelancerNotes(notes);
    setOrder((prev) => ({ ...prev, status: 'submitted' as OrderStatus }));
    setCurrentStep('submitted');
    showNotif('Work submitted for review!');
  };

  const handleApprove = () => {
    setOrder((prev) => ({ ...prev, status: 'completed' as OrderStatus }));
    setCurrentStep('under_review');
    // Brief review then complete
    setTimeout(() => {
      setCurrentStep('completed');
    }, 800);
    showNotif('Work approved! Payment is being processed.');
  };

  const handleRequestRevision = (feedback: string) => {
    setRevisionCount((prev) => prev + 1);
    setOrder((prev) => ({
      ...prev,
      status: 'revision' as OrderStatus,
      revisions_count: prev.revisions_count + 1,
    }));
    setFreelancerNotes('');
    setSubmittedFiles([]);
    setCurrentStep('in_progress');
    showNotif('Revision requested. Notes: ' + feedback.slice(0, 50) + '...');
  };

  const handlePaymentContinue = () => {
    setCurrentStep('paid');
    // Auto-advance to review
    setTimeout(() => {
      setCurrentStep('reviewed');
    }, 600);
  };

  const handleReview = (
    rating: number,
    comment: string,
    tags: string[]
  ) => {
    setReview({
      id: 'rev-001',
      order_id: order.id,
      reviewer_id: profile?.id ?? 'user-001',
      reviewee_id:
        mode === 'freelancer' ? order.client_id : order.freelancer_id,
      rating,
      comment: comment + (tags.length > 0 ? ` | Tags: ${tags.join(', ')}` : ''),
      created_at: new Date().toISOString(),
    });
    setCurrentStep('reviewed');
    showNotif('Review submitted! Thank you for your feedback.');
  };

  const handleBrowseMore = () => {
    showNotif('Navigating to marketplace...');
  };

  const handleRehire = () => {
    showNotif('Rehire request sent to the freelancer!');
  };

  // ---- Render current step ----

  const renderStep = () => {
    switch (currentStep) {
      case 'applied':
        return (
          <ApplicationStep
            mode={mode}
            onApply={handleApply}
            onQuickApply={handleQuickApply}
          />
        );
      case 'hired':
        return (
          <HiredStep
            mode={mode}
            onStartWork={handleStartWork}
            onViewProgress={handleViewProgress}
            order={order}
          />
        );
      case 'in_progress':
        return mode === 'freelancer' ? (
          <WorkStep
            onSubmitWork={handleSubmitWork}
            order={order}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border border-teal-200 dark:border-teal-800 p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-teal-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Freelancer is Working
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                The freelancer is working on your order. You will be notified when
                they submit work for review.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Order</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {order.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-3">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <Badge label="In Progress" variant="info" size="sm" />
              </div>
            </div>
            {/* Demo: allow client to fast-forward */}
            {demoMode && (
              <button
                onClick={() => {
                  setSubmittedFiles([
                    { id: 'f1', name: 'portfolio-v1.zip', size: 2457600, type: 'application/zip' },
                    { id: 'f2', name: 'wireframes.pdf', size: 512000, type: 'application/pdf' },
                  ]);
                  setFreelancerNotes(
                    'Completed the portfolio website with all requested features. Dark mode included. Ready for review.'
                  );
                  setOrder((prev) => ({
                    ...prev,
                    status: 'submitted' as OrderStatus,
                  }));
                  setCurrentStep('submitted');
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-dashed border-teal-400 text-teal-600 dark:text-teal-400 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition"
              >
                [Demo] Simulate Freelancer Submission
              </button>
            )}
          </div>
        );
      case 'submitted':
        return (
          <ReviewSubmissionStep
            mode={mode}
            onApprove={handleApprove}
            onRequestRevision={handleRequestRevision}
            order={order}
            submittedFiles={submittedFiles}
            freelancerNotes={freelancerNotes}
            revisionCount={revisionCount}
          />
        );
      case 'under_review':
        return (
          <div className="space-y-6 animate-fade-in text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-teal-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Under Review
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The client is reviewing your submission...
            </p>
          </div>
        );
      case 'completed':
        return (
          <PaymentStep
            mode={mode}
            onContinue={handlePaymentContinue}
            order={order}
          />
        );
      case 'paid':
        return (
          <ReviewStep
            mode={mode}
            onReview={handleReview}
            order={order}
          />
        );
      case 'reviewed':
        return (
          <CompletionStep
            mode={mode}
            order={order}
            onBrowseMore={handleBrowseMore}
            onRehire={handleRehire}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Inline notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {notification}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Application Flow
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'freelancer'
                ? 'Manage your application and delivery'
                : 'Review and manage your hired freelancer'}
            </p>
          </div>
          {demoMode && (
            <button
              onClick={() => setShowDemoNav(!showDemoNav)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  showDemoNav
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }
              `}
            >
              <Zap className="w-4 h-4" />
              Demo Nav
            </button>
          )}
        </div>

        {/* Demo step navigator */}
        {demoMode && showDemoNav && (
          <div className="mb-6 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-4">
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mb-3">
              STEP NAVIGATOR (Demo Mode)
            </p>
            <div className="flex flex-wrap gap-2">
              {FLOW_STEPS.map((step) => (
                <button
                  key={step.key}
                  onClick={() => {
                    setCurrentStep(step.key);
                    // Set up mock data for later steps
                    if (STEP_INDEX[step.key] >= STEP_INDEX['submitted']) {
                      setSubmittedFiles([
                        { id: 'f1', name: 'portfolio-v1.zip', size: 2457600, type: 'application/zip' },
                        { id: 'f2', name: 'wireframes.pdf', size: 512000, type: 'application/pdf' },
                      ]);
                      setFreelancerNotes(
                        'Completed the portfolio website with all requested features. Dark mode included.'
                      );
                    }
                    if (STEP_INDEX[step.key] >= STEP_INDEX['completed']) {
                      setOrder((prev) => ({
                        ...prev,
                        status: 'completed' as OrderStatus,
                        revisions_count: 1,
                      }));
                      setRevisionCount(1);
                    }
                  }}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${
                      currentStep === step.key
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:border-teal-400'
                    }
                  `}
                >
                  {step.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  const idx = STEP_INDEX[currentStep];
                  if (idx > 0) setCurrentStep(FLOW_STEPS[idx - 1].key);
                }}
                disabled={STEP_INDEX[currentStep] === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:border-teal-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3 h-3" />
                Prev
              </button>
              <button
                onClick={() => {
                  const idx = STEP_INDEX[currentStep];
                  if (idx < FLOW_STEPS.length - 1) {
                    const nextStep = FLOW_STEPS[idx + 1].key;
                    setCurrentStep(nextStep);
                    if (STEP_INDEX[nextStep] >= STEP_INDEX['submitted']) {
                      setSubmittedFiles([
                        { id: 'f1', name: 'portfolio-v1.zip', size: 2457600, type: 'application/zip' },
                        { id: 'f2', name: 'wireframes.pdf', size: 512000, type: 'application/pdf' },
                      ]);
                      setFreelancerNotes(
                        'Completed the portfolio website with all requested features.'
                      );
                    }
                    if (STEP_INDEX[nextStep] >= STEP_INDEX['completed']) {
                      setOrder((prev) => ({
                        ...prev,
                        status: 'completed' as OrderStatus,
                        revisions_count: 1,
                      }));
                      setRevisionCount(1);
                    }
                  }
                }}
                disabled={STEP_INDEX[currentStep] === FLOW_STEPS.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:border-teal-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Flow tracker */}
        <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5">
          <FlowTracker currentStep={currentStep} mode={mode} />
        </div>

        {/* Mode badge */}
        <div className="mb-4 flex items-center gap-2">
          <Badge
            label={mode === 'freelancer' ? 'Freelancer View' : 'Client View'}
            variant={mode === 'freelancer' ? 'success' : 'info'}
            size="md"
          />
          <Badge
            label={order.status.replace('_', ' ')}
            variant={
              order.status === 'completed'
                ? 'success'
                : order.status === 'in_progress'
                  ? 'info'
                  : 'default'
            }
            size="sm"
          />
          {revisionCount > 0 && (
            <Badge
              label={`Revisions: ${revisionCount}/${order.max_revisions}`}
              variant="warning"
              size="sm"
            />
          )}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 sm:p-8">
          {renderStep()}
        </div>
      </div>

      {/* Mobile-optimized: bottom padding for scrolling */}
      <div className="h-8" />
    </div>
  );
}
