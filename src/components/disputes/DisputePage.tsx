import { useState, useMemo, useRef } from 'react';
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  FileText,
  Upload,
  Eye,
  Gavel,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Order } from '../../types';
import Badge from '../common/Badge';
import Modal from '../common/Modal';

// ---------------------------------------------------------------------------
// Extended types
// ---------------------------------------------------------------------------

type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'dismissed';
type DisputePriority = 'low' | 'medium' | 'high' | 'critical';
type DisputeReason =
  | 'Work Quality'
  | 'Missed Deadline'
  | 'Communication Issue'
  | 'Payment Issue'
  | 'Other';

interface DisputeMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'client' | 'freelancer' | 'admin';
  sender_avatar: string;
  content: string;
  created_at: string;
}

interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface DisputeEvent {
  id: string;
  type: 'created' | 'response' | 'evidence' | 'status_change' | 'resolution' | 'message';
  description: string;
  timestamp: string;
  actor?: string;
}

interface Dispute {
  id: string;
  order_id: string;
  order_title: string;
  reporter_id: string;
  reporter_name: string;
  reporter_avatar: string;
  respondent_id: string;
  respondent_name: string;
  respondent_avatar: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  priority: DisputePriority;
  created_at: string;
  updated_at: string;
  messages: DisputeMessage[];
  evidence: EvidenceFile[];
  timeline: DisputeEvent[];
  resolution?: string;
  resolution_type?: 'refund' | 'release' | 'split' | 'dismiss';
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    order_id: 'o1',
    order_title: 'Professional Logo Design',
    reporter_id: 'u1',
    reporter_name: 'Alice Johnson',
    reporter_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    respondent_id: 'u2',
    respondent_name: 'Ben Carter',
    respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
    reason: 'Work Quality',
    description:
      'The delivered logo does not match the specifications provided in the brief. Colors are off, and the font choice is different from what was agreed upon.',
    status: 'open',
    priority: 'high',
    created_at: '2026-04-25T09:00:00Z',
    updated_at: '2026-04-25T09:00:00Z',
    messages: [
      {
        id: 'm1',
        sender_id: 'u1',
        sender_name: 'Alice Johnson',
        sender_role: 'client',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        content:
          'I am filing a dispute because the final logo does not match the agreed design. The colors should have been teal and white, not blue and gray.',
        created_at: '2026-04-25T09:05:00Z',
      },
      {
        id: 'm2',
        sender_id: 'u2',
        sender_name: 'Ben Carter',
        sender_role: 'freelancer',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
        content:
          'I followed the brief as I understood it. The color was described as "ocean-themed" which I interpreted as blue. I am happy to revise with the exact colors.',
        created_at: '2026-04-25T10:30:00Z',
      },
      {
        id: 'm3',
        sender_id: 'u1',
        sender_name: 'Alice Johnson',
        sender_role: 'client',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        content:
          'I have already used all my revisions. The issue is the final delivery still does not match what was described.',
        created_at: '2026-04-25T11:15:00Z',
      },
    ],
    evidence: [
      {
        id: 'e1',
        name: 'design_brief.pdf',
        type: 'application/pdf',
        size: '2.4 MB',
        uploaded_at: '2026-04-25T09:02:00Z',
        uploaded_by: 'Alice Johnson',
      },
      {
        id: 'e2',
        name: 'delivered_logo.png',
        type: 'image/png',
        size: '1.1 MB',
        uploaded_at: '2026-04-25T09:03:00Z',
        uploaded_by: 'Alice Johnson',
      },
    ],
    timeline: [
      { id: 't1', type: 'created', description: 'Dispute filed by Alice Johnson', timestamp: '2026-04-25T09:00:00Z', actor: 'Alice Johnson' },
      { id: 't2', type: 'evidence', description: '2 evidence files uploaded', timestamp: '2026-04-25T09:02:00Z', actor: 'Alice Johnson' },
      { id: 't3', type: 'response', description: 'Ben Carter responded to the dispute', timestamp: '2026-04-25T10:30:00Z', actor: 'Ben Carter' },
      { id: 't4', type: 'message', description: 'Alice Johnson replied', timestamp: '2026-04-25T11:15:00Z', actor: 'Alice Johnson' },
    ],
  },
  {
    id: 'd2',
    order_id: 'o2',
    order_title: 'Website Redesign',
    reporter_id: 'u3',
    reporter_name: 'Carol Martinez',
    reporter_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
    respondent_id: 'u2',
    respondent_name: 'Ben Carter',
    respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
    reason: 'Missed Deadline',
    description:
      'The freelancer missed the agreed deadline by 5 days with no prior communication about the delay. This caused significant issues for my project timeline.',
    status: 'under_review',
    priority: 'medium',
    created_at: '2026-04-22T14:00:00Z',
    updated_at: '2026-04-23T08:00:00Z',
    messages: [
      {
        id: 'm4',
        sender_id: 'u3',
        sender_name: 'Carol Martinez',
        sender_role: 'client',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        content:
          'The project was due on April 17th. It was delivered on April 22nd with no explanation for the delay.',
        created_at: '2026-04-22T14:05:00Z',
      },
      {
        id: 'm5',
        sender_id: 'admin1',
        sender_name: 'Admin Sarah',
        sender_role: 'admin',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        content: 'I am reviewing this dispute. Freelancer, please provide your response within 24 hours.',
        created_at: '2026-04-23T08:00:00Z',
      },
    ],
    evidence: [
      {
        id: 'e3',
        name: 'chat_history.pdf',
        type: 'application/pdf',
        size: '890 KB',
        uploaded_at: '2026-04-22T14:02:00Z',
        uploaded_by: 'Carol Martinez',
      },
    ],
    timeline: [
      { id: 't5', type: 'created', description: 'Dispute filed by Carol Martinez', timestamp: '2026-04-22T14:00:00Z', actor: 'Carol Martinez' },
      { id: 't6', type: 'evidence', description: '1 evidence file uploaded', timestamp: '2026-04-22T14:02:00Z', actor: 'Carol Martinez' },
      { id: 't7', type: 'status_change', description: 'Status changed to Under Review', timestamp: '2026-04-23T08:00:00Z', actor: 'Admin Sarah' },
    ],
  },
  {
    id: 'd3',
    order_id: 'o3',
    order_title: 'Mobile App Prototype',
    reporter_id: 'u4',
    reporter_name: 'Dave Kim',
    reporter_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
    respondent_id: 'u2',
    respondent_name: 'Ben Carter',
    respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
    reason: 'Communication Issue',
    description:
      'The freelancer was unresponsive for over a week during the project, making it impossible to provide feedback or get updates.',
    status: 'resolved',
    priority: 'low',
    created_at: '2026-04-10T16:00:00Z',
    updated_at: '2026-04-15T10:00:00Z',
    messages: [
      {
        id: 'm6',
        sender_id: 'u4',
        sender_name: 'Dave Kim',
        sender_role: 'client',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
        content: 'I tried reaching out multiple times but got no response for over a week.',
        created_at: '2026-04-10T16:05:00Z',
      },
      {
        id: 'm7',
        sender_id: 'admin1',
        sender_name: 'Admin Sarah',
        sender_role: 'admin',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        content:
          'After reviewing the evidence, a partial refund of 30% has been approved. The freelancer acknowledged the communication lapse.',
        created_at: '2026-04-15T10:00:00Z',
      },
    ],
    evidence: [],
    timeline: [
      { id: 't8', type: 'created', description: 'Dispute filed by Dave Kim', timestamp: '2026-04-10T16:00:00Z', actor: 'Dave Kim' },
      { id: 't9', type: 'status_change', description: 'Status changed to Under Review', timestamp: '2026-04-11T09:00:00Z', actor: 'Admin Sarah' },
      { id: 't10', type: 'resolution', description: 'Split resolution: 30% refund, 70% released', timestamp: '2026-04-15T10:00:00Z', actor: 'Admin Sarah' },
    ],
    resolution: 'Split resolution: 30% refund to client, 70% payment released to freelancer.',
    resolution_type: 'split',
  },
  {
    id: 'd4',
    order_id: 'o4',
    order_title: 'Data Analysis Report',
    reporter_id: 'u2',
    reporter_name: 'Ben Carter',
    reporter_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
    respondent_id: 'u5',
    respondent_name: 'Eve Thompson',
    respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    reason: 'Payment Issue',
    description:
      'The client has not released the escrow payment despite the work being completed and approved a week ago.',
    status: 'dismissed',
    priority: 'medium',
    created_at: '2026-04-05T11:00:00Z',
    updated_at: '2026-04-08T15:00:00Z',
    messages: [
      {
        id: 'm8',
        sender_id: 'u2',
        sender_name: 'Ben Carter',
        sender_role: 'freelancer',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
        content: 'The payment was released after the dispute was filed. Resolving this now.',
        created_at: '2026-04-07T10:00:00Z',
      },
      {
        id: 'm9',
        sender_id: 'admin1',
        sender_name: 'Admin Sarah',
        sender_role: 'admin',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        content: 'Payment has been confirmed as released. Dismissed as resolved outside the platform.',
        created_at: '2026-04-08T15:00:00Z',
      },
    ],
    evidence: [],
    timeline: [
      { id: 't11', type: 'created', description: 'Dispute filed by Ben Carter', timestamp: '2026-04-05T11:00:00Z', actor: 'Ben Carter' },
      { id: 't12', type: 'status_change', description: 'Status changed to Under Review', timestamp: '2026-04-06T09:00:00Z', actor: 'Admin Sarah' },
      { id: 't13', type: 'resolution', description: 'Dismissed - payment released externally', timestamp: '2026-04-08T15:00:00Z', actor: 'Admin Sarah' },
    ],
    resolution: 'Payment was released by the client. Dispute dismissed.',
    resolution_type: 'dismiss',
  },
  {
    id: 'd5',
    order_id: 'o5',
    order_title: 'Social Media Graphics',
    reporter_id: 'u6',
    reporter_name: 'Frank Lee',
    reporter_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    respondent_id: 'u2',
    respondent_name: 'Ben Carter',
    respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
    reason: 'Work Quality',
    description:
      'The delivered graphics were low resolution and did not match the brand guidelines provided.',
    status: 'open',
    priority: 'critical',
    created_at: '2026-04-26T08:00:00Z',
    updated_at: '2026-04-26T08:00:00Z',
    messages: [
      {
        id: 'm10',
        sender_id: 'u6',
        sender_name: 'Frank Lee',
        sender_role: 'client',
        sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
        content:
          'The graphics are unusable at this resolution. I need this resolved urgently as my campaign launch is in 3 days.',
        created_at: '2026-04-26T08:05:00Z',
      },
    ],
    evidence: [
      {
        id: 'e4',
        name: 'brand_guidelines.pdf',
        type: 'application/pdf',
        size: '5.2 MB',
        uploaded_at: '2026-04-26T08:02:00Z',
        uploaded_by: 'Frank Lee',
      },
      {
        id: 'e5',
        name: 'delivered_graphics.zip',
        type: 'application/zip',
        size: '12.8 MB',
        uploaded_at: '2026-04-26T08:03:00Z',
        uploaded_by: 'Frank Lee',
      },
      {
        id: 'e6',
        name: 'screenshot_comparison.png',
        type: 'image/png',
        size: '3.4 MB',
        uploaded_at: '2026-04-26T08:04:00Z',
        uploaded_by: 'Frank Lee',
      },
    ],
    timeline: [
      { id: 't14', type: 'created', description: 'Dispute filed by Frank Lee', timestamp: '2026-04-26T08:00:00Z', actor: 'Frank Lee' },
      { id: 't15', type: 'evidence', description: '3 evidence files uploaded', timestamp: '2026-04-26T08:02:00Z', actor: 'Frank Lee' },
    ],
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'o6',
    gig_id: 'g3',
    task_id: null,
    client_id: 'u1',
    freelancer_id: 'u2',
    title: 'Video Editing Project',
    description: 'Edit a 5-minute promo video',
    price: 80,
    deadline: '2026-05-01T00:00:00Z',
    status: 'completed',
    revisions_count: 1,
    max_revisions: 2,
    files: [],
    created_at: '2026-04-10T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
  },
  {
    id: 'o7',
    gig_id: null,
    task_id: 't2',
    client_id: 'u3',
    freelancer_id: 'u2',
    title: 'Resume Writing Service',
    description: 'Write a professional resume',
    price: 35,
    deadline: '2026-04-28T00:00:00Z',
    status: 'completed',
    revisions_count: 0,
    max_revisions: 1,
    files: [],
    created_at: '2026-04-15T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
  },
  {
    id: 'o8',
    gig_id: 'g4',
    task_id: null,
    client_id: 'u4',
    freelancer_id: 'u2',
    title: 'Python Script Automation',
    description: 'Automate a data processing workflow',
    price: 150,
    deadline: '2026-05-05T00:00:00Z',
    status: 'submitted',
    revisions_count: 0,
    max_revisions: 3,
    files: [],
    created_at: '2026-04-05T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DISPUTE_REASONS: DisputeReason[] = [
  'Work Quality',
  'Missed Deadline',
  'Communication Issue',
  'Payment Issue',
  'Other',
];

const STATUS_CONFIG: Record<
  DisputeStatus,
  { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string }
> = {
  open: { variant: 'danger', label: 'Open' },
  under_review: { variant: 'warning', label: 'Under Review' },
  resolved: { variant: 'success', label: 'Resolved' },
  dismissed: { variant: 'default', label: 'Dismissed' },
};

const PRIORITY_CONFIG: Record<DisputePriority, { variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  low: { variant: 'default', label: 'Low' },
  medium: { variant: 'warning', label: 'Medium' },
  high: { variant: 'danger', label: 'High' },
  critical: { variant: 'danger', label: 'Critical' },
};

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const timeAgo = (iso: string) => {
  const now = new Date('2026-04-27T12:00:00Z');
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffD > 0) return `${diffD}d ago`;
  if (diffH > 0) return `${diffH}h ago`;
  return 'Just now';
};

// ---------------------------------------------------------------------------
// DisputeStats
// ---------------------------------------------------------------------------

interface DisputeStatsProps {
  disputes: Dispute[];
}

function DisputeStats({ disputes }: DisputeStatsProps) {
  const counts = useMemo(() => {
    const open = disputes.filter((d) => d.status === 'open').length;
    const underReview = disputes.filter((d) => d.status === 'under_review').length;
    const resolved = disputes.filter((d) => d.status === 'resolved').length;
    const dismissed = disputes.filter((d) => d.status === 'dismissed').length;
    return { open, underReview, resolved, dismissed, total: disputes.length };
  }, [disputes]);

  const stats = [
    {
      label: 'Open',
      value: counts.open,
      icon: AlertTriangle,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
    },
    {
      label: 'Under Review',
      value: counts.underReview,
      icon: Clock,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800/50',
    },
    {
      label: 'Resolved',
      value: counts.resolved,
      icon: CheckCircle,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    {
      label: 'Dismissed',
      value: counts.dismissed,
      icon: XCircle,
      color: 'text-slate-400 dark:text-slate-500',
      bg: 'bg-slate-50 dark:bg-slate-700/50',
      border: 'border-slate-200 dark:border-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl border ${s.border} ${s.bg} p-5 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {s.label}
            </span>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DisputeCard
// ---------------------------------------------------------------------------

interface DisputeCardProps {
  dispute: Dispute;
  onClick: () => void;
}

function DisputeCard({ dispute, onClick }: DisputeCardProps) {
  const statusCfg = STATUS_CONFIG[dispute.status];
  const priorityCfg = PRIORITY_CONFIG[dispute.priority];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 transition-all duration-200 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge label={statusCfg.label} variant={statusCfg.variant} size="sm" />
          <Badge label={priorityCfg.label} variant={priorityCfg.variant} size="sm" />
          <Badge label={dispute.reason} variant="default" size="sm" />
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(dispute.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
        {dispute.order_title}
      </h3>

      {/* Parties */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {dispute.reporter_name} vs {dispute.respondent_name}
      </p>

      {/* Description preview */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
        {dispute.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {dispute.messages.length}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {dispute.evidence.length}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-200" />
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// CreateDisputeModal
// ---------------------------------------------------------------------------

interface CreateDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSubmit: (dispute: {
    order_id: string;
    reason: DisputeReason;
    description: string;
    evidence_files: { name: string; size: string }[];
  }) => void;
}

function CreateDisputeModal({ isOpen, onClose, orders, onSubmit }: CreateDisputeModalProps) {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState<DisputeReason | ''>('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = selectedOrder !== '' && reason !== '' && description.trim().length >= 20;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const newFiles = Array.from(selected).map((f) => ({
      name: f.name,
      size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit({
      order_id: selectedOrder,
      reason: reason as DisputeReason,
      description: description.trim(),
      evidence_files: files,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSelectedOrder('');
    setReason('');
    setDescription('');
    setFiles([]);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="File a Dispute" size="lg">
      {submitted ? (
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dispute Filed</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
            Your dispute has been submitted. Our team will review it and respond within 24 hours.
          </p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Warning banner */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Filing a dispute should be a last resort. Please try resolving the issue directly with
              the other party first. Frivolous disputes may affect your account standing.
            </p>
          </div>

          {/* Select order */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Select Order
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 appearance-none"
            >
              <option value="">Choose an order...</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title} - ${o.price}
                </option>
              ))}
            </select>
          </div>

          {/* Dispute reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Dispute Reason
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DISPUTE_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
                    reason === r
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide a detailed explanation of the issue... (minimum 20 characters)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Be as detailed as possible to help resolve the dispute quickly.
            </p>
          </div>

          {/* Evidence upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Evidence Files <span className="text-slate-400 font-normal">(optional, up to 5)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all duration-200"
            >
              <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click to upload evidence files
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                PDF, PNG, JPG, ZIP up to 10MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.zip,.doc,.docx"
            />
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                        {f.name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {f.size}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Filing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  File Dispute
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// DisputeDetail
// ---------------------------------------------------------------------------

interface DisputeDetailProps {
  dispute: Dispute;
  onBack: () => void;
  onSendMessage: (disputeId: string, content: string) => void;
  onResolve: (disputeId: string, resolutionType: 'refund' | 'release' | 'split' | 'dismiss', note: string) => void;
}

function DisputeDetail({ dispute, onBack, onSendMessage, onResolve }: DisputeDetailProps) {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'conversation' | 'evidence' | 'timeline'>('conversation');
  const [resolutionNote, setResolutionNote] = useState('');
  const [showResolution, setShowResolution] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(dispute.id, newMessage.trim());
    setNewMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleResolve = (type: 'refund' | 'release' | 'split' | 'dismiss') => {
    if (!resolutionNote.trim()) return;
    onResolve(dispute.id, type, resolutionNote.trim());
    setShowResolution(false);
    setResolutionNote('');
  };

  const statusCfg = STATUS_CONFIG[dispute.status];
  const priorityCfg = PRIORITY_CONFIG[dispute.priority];

  const tabs = [
    { id: 'conversation' as const, label: 'Conversation', icon: MessageSquare, count: dispute.messages.length },
    { id: 'evidence' as const, label: 'Evidence', icon: FileText, count: dispute.evidence.length },
    { id: 'timeline' as const, label: 'Timeline', icon: Clock, count: dispute.timeline.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Disputes
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge label={statusCfg.label} variant={statusCfg.variant} size="md" />
              <Badge label={priorityCfg.label} variant={priorityCfg.variant} size="sm" />
              <Badge label={dispute.reason} variant="default" size="sm" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {dispute.order_title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Filed {formatDate(dispute.created_at)} by {dispute.reporter_name}
            </p>
          </div>

          {isAdmin && dispute.status !== 'resolved' && dispute.status !== 'dismissed' && (
            <button
              onClick={() => setShowResolution(!showResolution)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors duration-200"
            >
              <Gavel className="w-4 h-4" />
              Resolve Dispute
            </button>
          )}
        </div>
      </div>

      {/* Resolution panel */}
      {showResolution && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Gavel className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Admin Resolution
          </h3>

          <textarea
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            rows={3}
            placeholder="Enter resolution notes..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleResolve('refund')}
              disabled={!resolutionNote.trim()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-40 transition-all duration-200"
            >
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Refund</span>
            </button>
            <button
              onClick={() => handleResolve('release')}
              disabled={!resolutionNote.trim()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 disabled:opacity-40 transition-all duration-200"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Release</span>
            </button>
            <button
              onClick={() => handleResolve('split')}
              disabled={!resolutionNote.trim()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-teal-200 dark:border-teal-800/50 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30 disabled:opacity-40 transition-all duration-200"
            >
              <Shield className="w-5 h-5 text-teal-500" />
              <span className="text-xs font-medium text-teal-700 dark:text-teal-400">Split</span>
            </button>
            <button
              onClick={() => handleResolve('dismiss')}
              disabled={!resolutionNote.trim()}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-all duration-200"
            >
              <XCircle className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Dismiss</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing resolution display */}
      {dispute.resolution && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Gavel className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Resolution
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                {dispute.resolution}
              </p>
              <Badge
                label={
                  dispute.resolution_type === 'refund'
                    ? 'Full Refund'
                    : dispute.resolution_type === 'release'
                      ? 'Payment Released'
                      : dispute.resolution_type === 'split'
                        ? 'Split Resolution'
                        : 'Dismissed'
                }
                variant={
                  dispute.resolution_type === 'refund'
                    ? 'danger'
                    : dispute.resolution_type === 'release'
                      ? 'success'
                      : dispute.resolution_type === 'split'
                        ? 'info'
                        : 'default'
                }
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Parties info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Parties Involved</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={dispute.reporter_avatar}
              alt={dispute.reporter_name}
              className="w-10 h-10 rounded-full border-2 border-emerald-200 dark:border-emerald-800"
            />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {dispute.reporter_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reporter</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center text-slate-300 dark:text-slate-600">vs</div>
          <div className="flex items-center gap-3 flex-1">
            <img
              src={dispute.respondent_avatar}
              alt={dispute.respondent_name}
              className="w-10 h-10 rounded-full border-2 border-teal-200 dark:border-teal-800"
            />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {dispute.respondent_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Respondent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Conversation */}
        {activeTab === 'conversation' && (
          <div className="p-5 space-y-4">
            {dispute.messages.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {dispute.messages.map((msg) => {
                  const isAdminMsg = msg.sender_role === 'admin';
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <img
                        src={msg.sender_avatar}
                        alt={msg.sender_name}
                        className={`w-8 h-8 rounded-full flex-shrink-0 ${
                          isAdminMsg
                            ? 'border-2 border-emerald-400 dark:border-emerald-500'
                            : 'border border-slate-200 dark:border-slate-600'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {msg.sender_name}
                          </span>
                          {isAdminMsg && (
                            <Badge label="Admin" variant="success" size="sm" />
                          )}
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDateTime(msg.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Message input */}
            {dispute.status !== 'resolved' && dispute.status !== 'dismissed' && (
              <div className="flex items-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={2}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-40 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {activeTab === 'evidence' && (
          <div className="p-5">
            {dispute.evidence.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No evidence files</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dispute.evidence.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {file.size} &middot; Uploaded by {file.uploaded_by}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <div className="p-5">
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

              <div className="space-y-5">
                {dispute.timeline.map((event, i) => {
                  const isLast = i === dispute.timeline.length - 1;
                  void isLast;
                  const dotColor =
                    event.type === 'resolution'
                      ? 'bg-emerald-500'
                      : event.type === 'status_change'
                        ? 'bg-amber-500'
                        : event.type === 'created'
                          ? 'bg-red-500'
                          : 'bg-teal-500';
                  return (
                    <div key={event.id} className="relative">
                      <div
                        className={`absolute -left-[18px] top-1.5 w-3 h-3 rounded-full ${dotColor} ring-4 ring-white dark:ring-slate-800`}
                      />
                      <div>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                          {event.description}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {formatDateTime(event.timestamp)}
                          {event.actor && ` - by ${event.actor}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DisputePage (default export)
// ---------------------------------------------------------------------------

export default function DisputePage() {
  const { profile } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all');

  // Filter
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return disputes;
    return disputes.filter((d) => d.status === statusFilter);
  }, [disputes, statusFilter]);

  const handleSendMessage = (disputeId: string, content: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              messages: [
                ...d.messages,
                {
                  id: `m${Date.now()}`,
                  sender_id: profile?.id ?? 'u1',
                  sender_name: profile?.full_name ?? 'You',
                  sender_role: (profile?.role ?? 'client') as 'client' | 'freelancer' | 'admin',
                  sender_avatar: profile?.avatar_url ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
                  content,
                  created_at: new Date().toISOString(),
                },
              ],
              updated_at: new Date().toISOString(),
            }
          : d,
      ),
    );
    if (selectedDispute?.id === disputeId) {
      setSelectedDispute((prev) =>
        prev
          ? {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: `m${Date.now()}`,
                  sender_id: profile?.id ?? 'u1',
                  sender_name: profile?.full_name ?? 'You',
                  sender_role: (profile?.role ?? 'client') as 'client' | 'freelancer' | 'admin',
                  sender_avatar: profile?.avatar_url ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
                  content,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : null,
      );
    }
  };

  const handleResolve = (
    disputeId: string,
    resolutionType: 'refund' | 'release' | 'split' | 'dismiss',
    note: string,
  ) => {
    const resolutionLabels = {
      refund: 'Full refund approved.',
      release: 'Payment released to freelancer.',
      split: 'Split resolution: 50% refund, 50% released.',
      dismiss: 'Dispute dismissed.',
    };

    const newStatus = resolutionType === 'dismiss' ? 'dismissed' : 'resolved';

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: newStatus,
              resolution: note + ' ' + resolutionLabels[resolutionType],
              resolution_type: resolutionType,
              updated_at: new Date().toISOString(),
              timeline: [
                ...d.timeline,
                {
                  id: `t${Date.now()}`,
                  type: 'resolution' as const,
                  description: `Admin resolved: ${resolutionLabels[resolutionType]}`,
                  timestamp: new Date().toISOString(),
                  actor: profile?.full_name ?? 'Admin',
                },
              ],
            }
          : d,
      ),
    );
    if (selectedDispute?.id === disputeId) {
      setSelectedDispute((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolution: note + ' ' + resolutionLabels[resolutionType],
              resolution_type: resolutionType,
              timeline: [
                ...prev.timeline,
                {
                  id: `t${Date.now()}`,
                  type: 'resolution' as const,
                  description: `Admin resolved: ${resolutionLabels[resolutionType]}`,
                  timestamp: new Date().toISOString(),
                  actor: profile?.full_name ?? 'Admin',
                },
              ],
            }
          : null,
      );
    }
  };

  const handleCreateDispute = (input: {
    order_id: string;
    reason: DisputeReason;
    description: string;
    evidence_files: { name: string; size: string }[];
  }) => {
    const order = MOCK_ORDERS.find((o) => o.id === input.order_id);
    const newDispute: Dispute = {
      id: `d${Date.now()}`,
      order_id: input.order_id,
      order_title: order?.title ?? 'Unknown Order',
      reporter_id: profile?.id ?? 'u1',
      reporter_name: profile?.full_name ?? 'You',
      reporter_avatar: profile?.avatar_url ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      respondent_id: 'u2',
      respondent_name: 'Ben Carter',
      respondent_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben',
      reason: input.reason,
      description: input.description,
      status: 'open',
      priority: input.reason === 'Payment Issue' ? 'high' : 'medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [],
      evidence: input.evidence_files.map((f, i) => ({
        id: `e${Date.now() + i}`,
        name: f.name,
        type: 'application/octet-stream',
        size: f.size,
        uploaded_at: new Date().toISOString(),
        uploaded_by: profile?.full_name ?? 'You',
      })),
      timeline: [
        {
          id: `t${Date.now()}`,
          type: 'created',
          description: `Dispute filed by ${profile?.full_name ?? 'You'}`,
          timestamp: new Date().toISOString(),
          actor: profile?.full_name ?? 'You',
        },
      ],
    };
    setDisputes((prev) => [newDispute, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Dispute Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Resolve issues with orders and transactions
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm shadow-emerald-600/20"
          >
            <AlertTriangle className="w-4 h-4" />
            File a Dispute
          </button>
        </div>

        {/* Stats */}
        <DisputeStats disputes={disputes} />

        {/* Detail view */}
        {selectedDispute ? (
          <DisputeDetail
            dispute={selectedDispute}
            onBack={() => setSelectedDispute(null)}
            onSendMessage={handleSendMessage}
            onResolve={handleResolve}
          />
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(['all', 'open', 'under_review', 'resolved', 'dismissed'] as const).map((s) => {
                const count =
                  s === 'all' ? disputes.length : disputes.filter((d) => d.status === s).length;
                const label = s === 'all' ? 'All' : STATUS_CONFIG[s].label;
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800/50'
                    }`}
                  >
                    {label}
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        active
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dispute list */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Shield className="w-14 h-14 text-slate-200 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  No disputes found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  {statusFilter !== 'all'
                    ? `No ${STATUS_CONFIG[statusFilter as DisputeStatus]?.label?.toLowerCase() ?? ''} disputes at the moment.`
                    : 'Everything looks good! No active disputes.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((d) => (
                  <DisputeCard
                    key={d.id}
                    dispute={d}
                    onClick={() => setSelectedDispute(d)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create dispute modal */}
      <CreateDisputeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        orders={MOCK_ORDERS}
        onSubmit={handleCreateDispute}
      />
    </div>
  );
}
