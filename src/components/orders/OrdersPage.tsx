import { useState, useMemo } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  ArrowRight,
  Eye,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Order, OrderStatus } from '../../types';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FilterTab = 'all' | 'open' | 'in_progress' | 'submitted' | 'revision' | 'completed' | 'cancelled';

interface TimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

interface RevisionEntry {
  id: string;
  number: number;
  feedback: string;
  requestedAt: string;
  resolvedAt: string | null;
}

interface OrderMessage {
  id: string;
  senderName: string;
  senderRole: 'client' | 'freelancer';
  content: string;
  timestamp: string;
}

interface OrderFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
  'ord-1': [
    { status: 'open', timestamp: '2026-04-20T10:00:00Z', note: 'Order created by client' },
    { status: 'in_progress', timestamp: '2026-04-21T09:30:00Z', note: 'Freelancer accepted and started working' },
  ],
  'ord-2': [
    { status: 'open', timestamp: '2026-04-15T08:00:00Z', note: 'Order created by client' },
    { status: 'in_progress', timestamp: '2026-04-16T11:00:00Z', note: 'Work started' },
    { status: 'submitted', timestamp: '2026-04-24T16:00:00Z', note: 'Initial work submitted for review' },
    { status: 'revision', timestamp: '2026-04-25T10:00:00Z', note: 'Client requested revision on dashboard layout' },
    { status: 'submitted', timestamp: '2026-04-25T18:00:00Z', note: 'Revised work submitted' },
  ],
  'ord-3': [
    { status: 'open', timestamp: '2026-04-08T07:00:00Z', note: 'Order created' },
    { status: 'in_progress', timestamp: '2026-04-09T08:00:00Z', note: 'Work started on UI kit' },
    { status: 'submitted', timestamp: '2026-04-22T14:00:00Z', note: 'First draft submitted' },
    { status: 'revision', timestamp: '2026-04-23T09:00:00Z', note: 'Color palette needs adjustment' },
    { status: 'submitted', timestamp: '2026-04-24T11:00:00Z', note: 'Updated colors submitted' },
    { status: 'revision', timestamp: '2026-04-25T15:00:00Z', note: 'Icon set needs more variants' },
  ],
  'ord-4': [
    { status: 'open', timestamp: '2026-04-02T11:00:00Z', note: 'Order created' },
    { status: 'in_progress', timestamp: '2026-04-03T09:00:00Z', note: 'Script development started' },
    { status: 'submitted', timestamp: '2026-04-17T14:00:00Z', note: 'Script delivered with documentation' },
    { status: 'completed', timestamp: '2026-04-18T10:00:00Z', note: 'Client approved the work' },
  ],
  'ord-5': [
    { status: 'open', timestamp: '2026-03-25T07:00:00Z', note: 'Order created' },
    { status: 'in_progress', timestamp: '2026-03-26T08:00:00Z', note: 'Customization started' },
    { status: 'submitted', timestamp: '2026-04-08T16:00:00Z', note: 'Initial customization submitted' },
    { status: 'revision', timestamp: '2026-04-09T10:00:00Z', note: 'Plugin configuration issues' },
    { status: 'submitted', timestamp: '2026-04-10T12:00:00Z', note: 'Fixed plugin config' },
    { status: 'completed', timestamp: '2026-04-11T10:00:00Z', note: 'Work approved' },
  ],
  'ord-6': [
    { status: 'open', timestamp: '2026-04-10T06:00:00Z', note: 'Order created' },
    { status: 'in_progress', timestamp: '2026-04-11T09:00:00Z', note: 'Work started' },
    { status: 'cancelled', timestamp: '2026-04-18T14:00:00Z', note: 'Client cancelled due to scope change' },
  ],
  'ord-7': [
    { status: 'open', timestamp: '2026-04-24T10:00:00Z', note: 'Order placed for thesis formatting' },
  ],
};

const MOCK_REVISIONS: Record<string, RevisionEntry[]> = {
  'ord-2': [
    { id: 'rev-1', number: 1, feedback: 'Dashboard layout needs better responsive behavior on mobile breakpoints', requestedAt: '2026-04-25T10:00:00Z', resolvedAt: '2026-04-25T18:00:00Z' },
  ],
  'ord-3': [
    { id: 'rev-2', number: 1, feedback: 'Color palette should match our existing brand guidelines - use teal instead of blue', requestedAt: '2026-04-23T09:00:00Z', resolvedAt: '2026-04-24T11:00:00Z' },
    { id: 'rev-3', number: 2, feedback: 'Icon set needs 8 more variants for the delivery tracking section', requestedAt: '2026-04-25T15:00:00Z', resolvedAt: null },
  ],
  'ord-5': [
    { id: 'rev-4', number: 1, feedback: 'Yoast SEO plugin is not saving meta descriptions properly', requestedAt: '2026-04-09T10:00:00Z', resolvedAt: '2026-04-10T12:00:00Z' },
  ],
};

const MOCK_MESSAGES: Record<string, OrderMessage[]> = {
  'ord-1': [
    { id: 'msg-1', senderName: 'Priya Sharma', senderRole: 'client', content: 'Looking forward to seeing the initial design concepts!', timestamp: '2026-04-21T10:00:00Z' },
    { id: 'msg-2', senderName: 'Ara Patel', senderRole: 'freelancer', content: 'Will share the first mockups by end of day tomorrow.', timestamp: '2026-04-21T10:30:00Z' },
  ],
  'ord-2': [
    { id: 'msg-3', senderName: 'Arjun Mehta', senderRole: 'client', content: 'The chart components need to support dark mode as well.', timestamp: '2026-04-25T10:15:00Z' },
    { id: 'msg-4', senderName: 'Ara Patel', senderRole: 'freelancer', content: 'Good catch, adding dark mode support to all chart variants now.', timestamp: '2026-04-25T11:00:00Z' },
  ],
  'ord-3': [
    { id: 'msg-5', senderName: 'Sneha Patel', senderRole: 'client', content: 'We need the full icon set to include food delivery tracking states.', timestamp: '2026-04-25T15:30:00Z' },
    { id: 'msg-6', senderName: 'Mia Chen', senderRole: 'freelancer', content: 'On it! I will add the delivery status icons and update the kit.', timestamp: '2026-04-25T16:00:00Z' },
  ],
};

const MOCK_FILES: Record<string, OrderFile[]> = {
  'ord-1': [
    { id: 'f-1', name: 'landing-page-wireframe.fig', size: '4.2 MB', uploadedAt: '2026-04-22T09:00:00Z', uploadedBy: 'Ara Patel' },
  ],
  'ord-2': [
    { id: 'f-2', name: 'dashboard-v1.zip', size: '12.8 MB', uploadedAt: '2026-04-24T16:00:00Z', uploadedBy: 'Ara Patel' },
    { id: 'f-3', name: 'dashboard-v2-revised.zip', size: '13.1 MB', uploadedAt: '2026-04-25T18:00:00Z', uploadedBy: 'Ara Patel' },
    { id: 'f-4', name: 'requirements.pdf', size: '890 KB', uploadedAt: '2026-04-15T08:30:00Z', uploadedBy: 'Arjun Mehta' },
  ],
  'ord-3': [
    { id: 'f-5', name: 'ui-kit-v1.fig', size: '18.5 MB', uploadedAt: '2026-04-22T14:00:00Z', uploadedBy: 'Mia Chen' },
    { id: 'f-6', name: 'ui-kit-v2-revised.fig', size: '19.2 MB', uploadedAt: '2026-04-24T11:00:00Z', uploadedBy: 'Mia Chen' },
  ],
  'ord-4': [
    { id: 'f-7', name: 'scraper-script.py', size: '15 KB', uploadedAt: '2026-04-17T14:00:00Z', uploadedBy: 'Lee Kim' },
    { id: 'f-8', name: 'documentation.md', size: '8 KB', uploadedAt: '2026-04-17T14:05:00Z', uploadedBy: 'Lee Kim' },
  ],
};

const MOCK_ORDERS: (Order & {
  client_name: string;
  freelancer_name: string;
  client_avatar: string;
  freelancer_avatar: string;
})[] = [
  {
    id: 'ord-1',
    gig_id: 'gig-1',
    task_id: null,
    client_id: 'c-1',
    freelancer_id: 'u-1',
    title: 'E-commerce Landing Page Design',
    description: 'Design a modern, high-converting landing page for our new product launch. Must include hero section, feature highlights, testimonials, and CTA sections. Mobile-first responsive design with smooth scroll animations.',
    price: 350,
    deadline: '2026-05-10T00:00:00Z',
    status: 'in_progress',
    revisions_count: 0,
    max_revisions: 3,
    files: ['landing-page-wireframe.fig'],
    created_at: '2026-04-20T10:00:00Z',
    updated_at: '2026-04-22T10:00:00Z',
    client_name: 'Priya Sharma',
    freelancer_name: 'Ara Patel',
    client_avatar: 'PS',
    freelancer_avatar: 'AP',
  },
  {
    id: 'ord-2',
    gig_id: null,
    task_id: 't-2',
    client_id: 'c-2',
    freelancer_id: 'u-1',
    title: 'React Dashboard with Charts',
    description: 'Build a comprehensive admin dashboard with real-time data visualization using Recharts. Includes 6 chart types, filterable data tables, date range picker, and export functionality. Must support dark mode.',
    price: 500,
    deadline: '2026-05-15T00:00:00Z',
    status: 'submitted',
    revisions_count: 1,
    max_revisions: 2,
    files: ['dashboard-v1.zip', 'dashboard-v2-revised.zip'],
    created_at: '2026-04-15T08:00:00Z',
    updated_at: '2026-04-25T18:00:00Z',
    client_name: 'Arjun Mehta',
    freelancer_name: 'Ara Patel',
    client_avatar: 'AM',
    freelancer_avatar: 'AP',
  },
  {
    id: 'ord-3',
    gig_id: 'gig-3',
    task_id: null,
    client_id: 'c-3',
    freelancer_id: 'u-2',
    title: 'Mobile App UI Kit',
    description: 'Create a comprehensive UI kit for a food delivery app including 40+ screens, icon set, color system, and typography guide. Component library must be compatible with Figma auto-layout.',
    price: 275,
    deadline: '2026-04-28T00:00:00Z',
    status: 'revision',
    revisions_count: 2,
    max_revisions: 3,
    files: ['ui-kit-v1.fig', 'ui-kit-v2-revised.fig'],
    created_at: '2026-04-08T07:00:00Z',
    updated_at: '2026-04-25T15:00:00Z',
    client_name: 'Sneha Patel',
    freelancer_name: 'Mia Chen',
    client_avatar: 'SP',
    freelancer_avatar: 'MC',
  },
  {
    id: 'ord-4',
    gig_id: null,
    task_id: 't-4',
    client_id: 'c-4',
    freelancer_id: 'u-6',
    title: 'Python Script for Data Scraping',
    description: 'Automated web scraper for research data collection with rate limiting, proxy rotation, CSV/JSON export, error handling, and scheduling capability. Must handle dynamic content rendering.',
    price: 150,
    deadline: '2026-04-20T00:00:00Z',
    status: 'completed',
    revisions_count: 0,
    max_revisions: 2,
    files: ['scraper-script.py', 'documentation.md'],
    created_at: '2026-04-02T11:00:00Z',
    updated_at: '2026-04-18T10:00:00Z',
    client_name: 'Rohan Gupta',
    freelancer_name: 'Lee Kim',
    client_avatar: 'RG',
    freelancer_avatar: 'LK',
  },
  {
    id: 'ord-5',
    gig_id: 'gig-5',
    task_id: null,
    client_id: 'c-5',
    freelancer_id: 'u-1',
    title: 'WordPress Blog Customization',
    description: 'Customize WordPress theme with brand colors, add essential plugins (Yoast SEO, WPForms, WP Super Cache), configure contact form, and set up analytics tracking.',
    price: 200,
    deadline: '2026-04-12T00:00:00Z',
    status: 'completed',
    revisions_count: 1,
    max_revisions: 2,
    files: [],
    created_at: '2026-03-25T07:00:00Z',
    updated_at: '2026-04-11T10:00:00Z',
    client_name: 'Kavita Reddy',
    freelancer_name: 'Ara Patel',
    client_avatar: 'KR',
    freelancer_avatar: 'AP',
  },
  {
    id: 'ord-6',
    gig_id: null,
    task_id: 't-6',
    client_id: 'c-6',
    freelancer_id: 'u-3',
    title: 'Promotional Video Editing',
    description: 'Edit a 2-minute promotional video for campus event. Color grading, motion graphics intro, background music, and subtitles required.',
    price: 180,
    deadline: '2026-04-25T00:00:00Z',
    status: 'cancelled',
    revisions_count: 0,
    max_revisions: 2,
    files: [],
    created_at: '2026-04-10T06:00:00Z',
    updated_at: '2026-04-18T14:00:00Z',
    client_name: 'Dev Anand',
    freelancer_name: 'Jake Rivera',
    client_avatar: 'DA',
    freelancer_avatar: 'JR',
  },
  {
    id: 'ord-7',
    gig_id: 'gig-7',
    task_id: null,
    client_id: 'c-7',
    freelancer_id: 'u-4',
    title: 'Thesis Formatting & Citation Cleanup',
    description: 'Format 80-page thesis according to university APA guidelines. Fix all citations, bibliography, table of contents, and figure numbering.',
    price: 90,
    deadline: '2026-05-05T00:00:00Z',
    status: 'open',
    revisions_count: 0,
    max_revisions: 2,
    files: [],
    created_at: '2026-04-24T10:00:00Z',
    updated_at: '2026-04-24T10:00:00Z',
    client_name: 'Nisha Iyer',
    freelancer_name: 'Priya Sharma',
    client_avatar: 'NI',
    freelancer_avatar: 'PS2',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

const filterTabConfig: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'revision', label: 'Revision' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const WORKFLOW_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'completed', label: 'Completed' },
  { key: 'reviewed', label: 'Reviewed' },
];

function getWorkflowStepIndex(status: OrderStatus): number {
  const idx = WORKFLOW_STEPS.findIndex((s) => s.key === status);
  if (status === 'revision') return 2;
  if (status === 'cancelled') return -1;
  return idx >= 0 ? idx : 0;
}

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

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OrdersPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'files' | 'revisions' | 'messages' | 'timeline'>('overview');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  const selectedOrder = selectedOrderId ? MOCK_ORDERS.find((o) => o.id === selectedOrderId) ?? null : null;

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: MOCK_ORDERS.length,
      open: 0,
      in_progress: 0,
      submitted: 0,
      revision: 0,
      completed: 0,
      cancelled: 0,
    };
    MOCK_ORDERS.forEach((o) => {
      counts[o.status as FilterTab]++;
    });
    return counts;
  }, []);

  /* --- Stats summary --- */
  const activeOrders = MOCK_ORDERS.filter((o) => ['in_progress', 'submitted', 'revision'].includes(o.status)).length;
  const totalValue = MOCK_ORDERS.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.price, 0);
  const completedOrders = MOCK_ORDERS.filter((o) => o.status === 'completed' || o.status === 'reviewed').length;
  const urgentOrders = MOCK_ORDERS.filter((o) => {
    if (['completed', 'reviewed', 'cancelled'].includes(o.status)) return false;
    return daysUntil(o.deadline) <= 3;
  }).length;

  /* --- Progress indicator for cards --- */
  const WorkflowProgress = ({ status }: { status: OrderStatus }) => {
    const currentIndex = getWorkflowStepIndex(status);
    const isCancelled = status === 'cancelled';

    return (
      <div className="flex items-center gap-1 w-full">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isCompleted = isCancelled ? false : idx < currentIndex;
          const isCurrent = isCancelled ? false : idx === currentIndex;
          const isFuture = isCancelled || idx > currentIndex;
          void isFuture;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-300 dark:shadow-emerald-700'
                      : isCurrent
                        ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800 shadow-sm shadow-emerald-300 dark:shadow-emerald-700'
                        : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <span
                  className={`mt-1 text-[9px] font-medium leading-tight ${
                    isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isCurrent
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-colors duration-300 -mt-4 ${
                    isCompleted
                      ? 'bg-emerald-400 dark:bg-emerald-600'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* --- Action buttons based on status --- */
  const ActionButtons = ({ order }: { order: typeof MOCK_ORDERS[number] }) => {
    const isFreelancer = profile?.role === 'freelancer';

    if (order.status === 'in_progress') {
      return (
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
          <Upload className="w-3.5 h-3.5" />
          Submit Work
        </button>
      );
    }

    if (order.status === 'submitted') {
      if (isFreelancer) {
        return (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              Message
            </button>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Awaiting review
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            Request Revision
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      );
    }

    if (order.status === 'revision') {
      if (isFreelancer) {
        return (
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
            <Upload className="w-3.5 h-3.5" />
            Resubmit Work
          </button>
        );
      }
      return (
        <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
          <RotateCcw className="w-3.5 h-3.5" />
          Revision in progress
        </span>
      );
    }

    if (order.status === 'completed' || order.status === 'reviewed') {
      return (
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Download className="w-3.5 h-3.5" />
          Download Files
        </button>
      );
    }

    if (order.status === 'open') {
      return (
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
          <ArrowRight className="w-3.5 h-3.5" />
          Start Work
        </button>
      );
    }

    return null;
  };

  /* --- Order card --- */
  const OrderCard = ({ order }: { order: typeof MOCK_ORDERS[number] }) => {
    const daysLeft = daysUntil(order.deadline);
    const isOverdue = daysLeft < 0 && !['completed', 'reviewed', 'cancelled'].includes(order.status);
    const isUrgent = daysLeft <= 3 && !['completed', 'reviewed', 'cancelled'].includes(order.status);

    return (
      <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
        {/* Card header */}
        <div className="p-5 pb-4">
          {/* Top row: status + price */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={statusLabelMap[order.status]} variant={statusVariantMap[order.status]} size="sm" />
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  Urgent
                </span>
              )}
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <XCircle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white flex-shrink-0">
              {formatCurrency(order.price)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {order.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {order.description}
          </p>

          {/* People + Deadline row */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-800">
                  {order.client_avatar}
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-800">
                  {order.freelancer_avatar}
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">{order.client_name}</span>
                <span className="mx-1">&rarr;</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{order.freelancer_name}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : isUrgent ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
              <Clock className="w-3 h-3" />
              {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
            </div>
          </div>
        </div>

        {/* Workflow progress */}
        <div className="px-5 pb-4">
          <WorkflowProgress status={order.status} />
        </div>

        {/* Revision count if applicable */}
        {order.revisions_count > 0 && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <RotateCcw className="w-3 h-3" />
              <span>{order.revisions_count}/{order.max_revisions} revisions used</span>
            </div>
          </div>
        )}

        {/* Actions + View details */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
          <ActionButtons order={order} />
          <button
            onClick={() => {
              setSelectedOrderId(order.id);
              setDetailTab('overview');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
        </div>
      </div>
    );
  };

  /* --- Detail modal content --- */
  const DetailContent = () => {
    if (!selectedOrder) return null;

    const timeline = MOCK_TIMELINE[selectedOrder.id] ?? [];
    const revisions = MOCK_REVISIONS[selectedOrder.id] ?? [];
    const messages = MOCK_MESSAGES[selectedOrder.id] ?? [];
    const files = MOCK_FILES[selectedOrder.id] ?? [];
    const daysLeft = daysUntil(selectedOrder.deadline);

    const detailTabs = [
      { key: 'overview' as const, label: 'Overview', icon: Package },
      { key: 'files' as const, label: `Files (${files.length})`, icon: FileText },
      { key: 'revisions' as const, label: `Revisions (${revisions.length})`, icon: RotateCcw },
      { key: 'messages' as const, label: `Messages (${messages.length})`, icon: MessageSquare },
      { key: 'timeline' as const, label: 'Timeline', icon: Clock },
    ];

    return (
      <div>
        {/* Status + Price header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge label={statusLabelMap[selectedOrder.status]} variant={statusVariantMap[selectedOrder.status]} size="md" />
            {selectedOrder.revisions_count > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedOrder.revisions_count}/{selectedOrder.max_revisions} revisions
              </span>
            )}
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(selectedOrder.price)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{selectedOrder.title}</h3>

        {/* People + Deadline */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                {selectedOrder.client_avatar}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-800">
                {selectedOrder.freelancer_avatar}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.client_name} <span className="text-slate-400 font-normal">(Client)</span></div>
              <div className="font-medium text-slate-700 dark:text-slate-300">{selectedOrder.freelancer_name} <span className="text-slate-400 font-normal">(Freelancer)</span></div>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 text-sm font-medium ${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : daysLeft <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
              <Clock className="w-4 h-4" />
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Due {formatDate(selectedOrder.deadline)}
            </div>
          </div>
        </div>

        {/* Detail tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl mb-4 overflow-x-auto">
          {detailTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setDetailTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  detailTab === tab.key
                    ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {detailTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedOrder.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Last Updated</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedOrder.updated_at)}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Max Revisions</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedOrder.max_revisions}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Files Attached</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{files.length}</p>
              </div>
            </div>

            {/* Workflow in detail */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Workflow Progress</h4>
              <WorkflowProgress status={selectedOrder.status} />
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <ActionButtons order={selectedOrder} />
            </div>
          </div>
        )}

        {detailTab === 'files' && (
          <div className="space-y-3">
            {/* Upload area */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-300 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                PDF, ZIP, FIG, PSD up to 50MB
              </p>
            </div>

            {/* File list */}
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {file.size} &middot; {file.uploadedBy} &middot; {timeAgo(file.uploadedAt)}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No files attached yet</p>
              </div>
            )}
          </div>
        )}

        {detailTab === 'revisions' && (
          <div className="space-y-3">
            {revisions.length > 0 ? (
              revisions.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    rev.resolvedAt
                      ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'
                      : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rev.resolvedAt ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                        {rev.number}
                      </div>
                      <span className={`text-sm font-semibold ${rev.resolvedAt ? 'text-slate-700 dark:text-slate-300' : 'text-amber-700 dark:text-amber-400'}`}>
                        Revision #{rev.number}
                      </span>
                      {!rev.resolvedAt && (
                        <Badge label="Pending" variant="warning" size="sm" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(rev.requestedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{rev.feedback}</p>
                  {rev.resolvedAt && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Resolved {timeAgo(rev.resolvedAt)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <RotateCcw className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No revisions requested</p>
              </div>
            )}
            {selectedOrder.revisions_count >= selectedOrder.max_revisions && selectedOrder.revisions_count > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Maximum revisions ({selectedOrder.max_revisions}) have been used. Any additional changes may require a new order.
                </p>
              </div>
            )}
          </div>
        )}

        {detailTab === 'messages' && (
          <div className="space-y-3">
            {messages.length > 0 ? (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.senderRole === 'freelancer' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${msg.senderRole === 'client' ? 'bg-gradient-to-br from-teal-400 to-emerald-500' : 'bg-gradient-to-br from-emerald-400 to-cyan-500'}`}>
                        {msg.senderName.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className={`max-w-[80%] ${msg.senderRole === 'freelancer' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.senderRole === 'client' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-md' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-tr-md'}`}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 px-1">
                          {msg.senderName} &middot; {timeAgo(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Message input */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  />
                  <button className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start a conversation about this order</p>
              </div>
            )}
          </div>
        )}

        {detailTab === 'timeline' && (
          <div className="space-y-0">
            {timeline.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

                {timeline.map((event, idx) => {
                  const isLast = idx === timeline.length - 1;
                  void isLast;
                  const statusColor = statusVariantMap[event.status];

                  return (
                    <div key={idx} className="relative flex gap-4 pb-4 last:pb-0">
                      {/* Dot */}
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          statusColor === 'success'
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                            : statusColor === 'warning'
                              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                              : statusColor === 'info'
                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                : statusColor === 'danger'
                                  ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          {event.status === 'completed' || event.status === 'reviewed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : event.status === 'cancelled' ? (
                            <XCircle className="w-4 h-4" />
                          ) : event.status === 'revision' ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : event.status === 'submitted' ? (
                            <Upload className="w-4 h-4" />
                          ) : event.status === 'in_progress' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge label={statusLabelMap[event.status]} variant={statusColor} size="sm" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{event.note}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDateTime(event.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No timeline events</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Main Render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-200" />
                Orders & Workflow
              </h1>
              <p className="mt-1 text-emerald-100/80 text-sm sm:text-base">
                Track, manage, and collaborate on all your active and past orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-sm font-medium text-white">
                {activeOrders} Active
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-sm text-sm font-medium text-white">
                {completedOrders} Completed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active Orders</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{activeOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Urgent</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{urgentOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{completedOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit min-w-full">
            {filterTabConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-emerald-500 text-emerald-100'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {tabCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders grid */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeTab === 'all'
                ? 'You have no orders yet'
                : `No ${statusLabelMap[activeTab as OrderStatus]?.toLowerCase() ?? ''} orders`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredOrders.length} of {MOCK_ORDERS.length} orders
        </div>
      </main>

      {/* Detail modal */}
      <Modal
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        title="Order Details"
        size="lg"
      >
        <DetailContent />
      </Modal>
    </div>
  );
}
