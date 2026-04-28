import { useState } from 'react';
import {
  HelpCircle,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { SupportTicket } from '../../types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface TicketMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'user' | 'admin';
  content: string;
  created_at: string;
}

interface TicketWithMessages extends SupportTicket {
  messages: TicketMessage[];
}

interface HelpCenterLink {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I create my first gig as a freelancer?',
    answer:
      'Navigate to your Freelancer Dashboard and click "Create New Gig". Fill in the title, description, pricing, delivery timeframe, and applicable skills. Make sure your profile is complete and verified before publishing -- clients are more likely to hire freelancers with completed profiles and portfolio samples.',
  },
  {
    id: 'faq-2',
    question: 'How does the escrow payment system work?',
    answer:
      'When a client hires a freelancer, the payment is deposited into escrow. This protects both parties: the freelancer knows the funds are available, and the client knows the payment is only released once they approve the delivered work. After the freelancer submits the deliverable and the client marks it as approved, the funds are released to the freelancer\'s wallet minus the platform commission.',
  },
  {
    id: 'faq-3',
    question: 'What happens if there is a dispute between a client and freelancer?',
    answer:
      'Both parties can raise a dispute through the order page. Our mediation team reviews the order details, communication history, and delivered work. We aim to resolve disputes within 48 hours. During the dispute, the escrowed funds remain locked until a resolution is reached. If no agreement can be made, the platform may issue a partial or full refund based on the evidence provided.',
  },
  {
    id: 'faq-4',
    question: 'How do I withdraw earnings to my bank account?',
    answer:
      'Go to your Wallet page and click "Withdraw". Enter your bank account details and the amount you wish to withdraw. Withdrawals are processed within 1-3 business days. Minimum withdrawal amount is INR 500. Ensure your KYC and bank details are verified to avoid delays.',
  },
  {
    id: 'faq-5',
    question: 'Can I apply to multiple tasks at the same time?',
    answer:
      'Yes! You can apply to as many open tasks as you want. However, make sure you can commit to the deadlines and workload before accepting. Once a client accepts your application, you are expected to deliver on time. Missing deadlines repeatedly can negatively affect your rating and platform reputation.',
  },
  {
    id: 'faq-6',
    question: 'How is the platform commission calculated?',
    answer:
      'SkillSwap Campus charges a 10% commission on each completed order. This is deducted automatically from the freelancer\'s earnings when the escrow payment is released. For example, on a INR 5,000 order, the freelancer receives INR 4,500 and the platform collects INR 500. There are no hidden fees or charges for clients.',
  },
  {
    id: 'faq-7',
    question: 'How do I verify my college ID?',
    answer:
      'Go to your Profile Settings and click "Verify College ID". Upload a photo of your college ID card or student identity document. Our verification team will review and approve it within 24 hours. Verified students get a badge on their profile, which increases trust and visibility on the platform.',
  },
];

const MOCK_TICKETS: TicketWithMessages[] = [
  {
    id: 'ticket-1',
    user_id: 'u-1',
    subject: 'Unable to withdraw funds to my bank account',
    description:
      'I have been trying to withdraw INR 3000 from my wallet for the past two days but keep getting an error. My bank details are verified.',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-04-25T09:15:00Z',
    updated_at: '2026-04-26T14:30:00Z',
    messages: [
      {
        id: 'msg-t1-1',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content:
          'I have been trying to withdraw INR 3000 from my wallet for the past two days but keep getting an error saying "Transaction failed. Please try again later." My bank details are verified and I have sufficient balance.',
        created_at: '2026-04-25T09:15:00Z',
      },
      {
        id: 'msg-t1-2',
        sender_id: 'admin-1',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'Hi there! Thank you for reaching out. We are sorry for the inconvenience. This appears to be related to a temporary issue with our payment processor. Could you share the exact error message and the bank account number (last 4 digits) you are trying to withdraw to?',
        created_at: '2026-04-25T11:40:00Z',
      },
      {
        id: 'msg-t1-3',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content:
          'The error says "Bank transfer initiation failed. Error code: RPC_0042." The bank account ends in 4521 (HDFC).',
        created_at: '2026-04-25T12:05:00Z',
      },
      {
        id: 'msg-t1-4',
        sender_id: 'admin-1',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'Thank you for providing those details. We have identified the issue with our Razorpay integration and our engineering team is working on a fix. We expect this to be resolved within the next 24 hours. We will update you as soon as the withdrawal is processed successfully.',
        created_at: '2026-04-26T14:30:00Z',
      },
    ],
  },
  {
    id: 'ticket-2',
    user_id: 'u-1',
    subject: 'Client not responding after submitting deliverable',
    description:
      'I submitted my work 5 days ago but the client has not responded or approved the deliverable. The order is stuck in "submitted" status.',
    status: 'open',
    priority: 'medium',
    created_at: '2026-04-22T16:00:00Z',
    updated_at: '2026-04-22T16:00:00Z',
    messages: [
      {
        id: 'msg-t2-1',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content:
          'I submitted my work for order #ORD-2045 exactly 5 days ago. The client has not responded to any of my messages or approved the deliverable. The order is still in "submitted" status. The escrow amount is INR 4500. Can you help?',
        created_at: '2026-04-22T16:00:00Z',
      },
    ],
  },
  {
    id: 'ticket-3',
    user_id: 'u-1',
    subject: 'Request for profile verification badge',
    description:
      'I have completed all my profile details and uploaded my college ID. How long does verification take?',
    status: 'resolved',
    priority: 'low',
    created_at: '2026-04-18T10:30:00Z',
    updated_at: '2026-04-19T09:00:00Z',
    messages: [
      {
        id: 'msg-t3-1',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content:
          'I have completed all my profile details including bio, portfolio, and skills. I also uploaded my college ID for verification yesterday. How long does the verification process typically take?',
        created_at: '2026-04-18T10:30:00Z',
      },
      {
        id: 'msg-t3-2',
        sender_id: 'admin-2',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'Hello! Verification typically takes 24-48 hours. I checked your profile and your college ID document looks good. I have escalated it for priority review.',
        created_at: '2026-04-18T14:00:00Z',
      },
      {
        id: 'msg-t3-3',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content: 'That is great, thank you for the quick response!',
        created_at: '2026-04-18T14:15:00Z',
      },
      {
        id: 'msg-t3-4',
        sender_id: 'admin-2',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'Great news! Your profile has been verified and you should now see the verified badge on your profile. Happy freelancing on SkillSwap Campus!',
        created_at: '2026-04-19T09:00:00Z',
      },
    ],
  },
  {
    id: 'ticket-4',
    user_id: 'u-1',
    subject: 'Incorrect commission deducted from my earnings',
    description:
      'I was charged 15% commission on my last order instead of the standard 10%. Order ID: ORD-1998.',
    status: 'closed',
    priority: 'medium',
    created_at: '2026-04-10T08:45:00Z',
    updated_at: '2026-04-12T11:00:00Z',
    messages: [
      {
        id: 'msg-t4-1',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content:
          'I noticed that 15% commission was deducted from my earnings on order #ORD-1998 instead of the standard 10%. The order amount was INR 6000 and I received INR 5100 instead of INR 5400. Can you please look into this?',
        created_at: '2026-04-10T08:45:00Z',
      },
      {
        id: 'msg-t4-2',
        sender_id: 'admin-1',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'Thank you for bringing this to our attention. We have reviewed the transaction and confirmed it was a system error. The excess commission of INR 300 has been refunded to your wallet. We apologize for the inconvenience.',
        created_at: '2026-04-11T10:00:00Z',
      },
      {
        id: 'msg-t4-3',
        sender_id: 'u-1',
        sender_name: 'You',
        sender_role: 'user',
        content: 'I received the refund. Thank you for resolving this quickly!',
        created_at: '2026-04-11T12:30:00Z',
      },
      {
        id: 'msg-t4-4',
        sender_id: 'admin-1',
        sender_name: 'SkillSwap Support',
        sender_role: 'admin',
        content:
          'You are welcome! We have also implemented additional checks to prevent this from happening again. This ticket is now closed. Feel free to reach out if you need anything else.',
        created_at: '2026-04-12T11:00:00Z',
      },
    ],
  },
];

const HELP_CENTER_LINKS: HelpCenterLink[] = [
  {
    id: 'hc-1',
    title: 'Getting Started',
    description: 'Learn how to set up your profile, create gigs, and start earning on SkillSwap Campus.',
    icon: <BookOpen className="w-5 h-5" />,
    href: '#getting-started',
  },
  {
    id: 'hc-2',
    title: 'Payment Guide',
    description: 'Understand escrow, withdrawals, commissions, and how payments flow on the platform.',
    icon: <CheckCircle className="w-5 h-5" />,
    href: '#payment-guide',
  },
  {
    id: 'hc-3',
    title: 'Dispute Resolution',
    description: 'Step-by-step guide on how to raise and resolve disputes between clients and freelancers.',
    icon: <AlertCircle className="w-5 h-5" />,
    href: '#dispute-resolution',
  },
  {
    id: 'hc-4',
    title: 'Contact Us',
    description: 'Reach out to our support team directly via email or live chat for urgent issues.',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '#contact-us',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date('2026-04-27T10:35:00Z');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: SupportTicket['status'] }) {
  const config: Record<SupportTicket['status'], { label: string; icon: React.ReactNode; cls: string }> = {
    open: {
      label: 'Open',
      icon: <AlertCircle className="w-3 h-3" />,
      cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    in_progress: {
      label: 'In Progress',
      icon: <Clock className="w-3 h-3" />,
      cls: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    },
    resolved: {
      label: 'Resolved',
      icon: <CheckCircle className="w-3 h-3" />,
      cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    closed: {
      label: 'Closed',
      icon: <CheckCircle className="w-3 h-3" />,
      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    },
  };

  const entry = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${entry.cls}`}>
      {entry.icon}
      {entry.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Priority Badge                                                     */
/* ------------------------------------------------------------------ */

function PriorityBadge({ priority }: { priority: SupportTicket['priority'] }) {
  const config: Record<SupportTicket['priority'], { label: string; cls: string }> = {
    low: { label: 'Low', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
    medium: { label: 'Medium', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    high: { label: 'High', cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };

  const entry = config[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left
          bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50
          transition-colors duration-150"
      >
        <span className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-3">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ticket List Item                                                   */
/* ------------------------------------------------------------------ */

function TicketListItem({
  ticket,
  isSelected,
  onClick,
}: {
  ticket: TicketWithMessages;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 border ${
        isSelected
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-sm'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {ticket.subject}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {ticket.description}
          </p>
        </div>
        <MessageSquare className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
      </div>
      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
        <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
          {formatRelativeDate(ticket.created_at)}
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Message Bubble                                                     */
/* ------------------------------------------------------------------ */

function TicketMessageBubble({ message }: { message: TicketMessage }) {
  const isAdmin = message.sender_role === 'admin';

  return (
    <div className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] ${isAdmin ? 'items-start' : 'items-end'} flex flex-col`}>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 px-1">
          {message.sender_name}
        </span>
        <div
          className={`px-4 py-2.5 rounded-2xl shadow-sm ${
            isAdmin
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-600'
              : 'bg-emerald-500 text-white rounded-br-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 px-1">
          {formatDate(message.created_at)} at {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function SupportPage() {
  const { profile: _profile } = useAuth();

  /* ---- state ---- */
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'help'>('faq');
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  const [tickets] = useState<TicketWithMessages[]>(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | SupportTicket['status']>('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<SupportTicket['priority']>('medium');
  const [replyText, setReplyText] = useState('');

  /* ---- derived ---- */
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  const filteredTickets = tickets.filter((t) => {
    if (ticketStatusFilter !== 'all' && t.status !== ticketStatusFilter) return false;
    if (ticketSearch) {
      const q = ticketSearch.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  /* ---- handlers ---- */
  const toggleFAQ = (id: string) => {
    setExpandedFAQs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim() || !newTicketDescription.trim()) return;
    setShowNewTicketForm(false);
    setNewTicketSubject('');
    setNewTicketDescription('');
    setNewTicketPriority('medium');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
  };

  /* ---- stats ---- */
  const ticketStats = {
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  /* ================================================================== */
  /*  RENDER                                                            */
  /* ================================================================== */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ---- header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              Support Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 ml-[52px]">
              Find answers, manage tickets, and get help with your account
            </p>
          </div>

          <button
            onClick={() => {
              setShowNewTicketForm(true);
              setActiveTab('tickets');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-emerald-600 to-teal-600 text-white
              hover:from-emerald-700 hover:to-teal-700
              focus:outline-none focus:ring-2 focus:ring-emerald-500/40
              transition-all duration-200 shadow-sm hover:shadow-md shadow-emerald-500/20 self-start"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* ---- quick stats ---- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Open', count: ticketStats.open, icon: <AlertCircle className="w-4 h-4" />, cls: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30' },
            { label: 'In Progress', count: ticketStats.in_progress, icon: <Clock className="w-4 h-4" />, cls: 'text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30' },
            { label: 'Resolved', count: ticketStats.resolved, icon: <CheckCircle className="w-4 h-4" />, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30' },
            { label: 'Closed', count: ticketStats.closed, icon: <CheckCircle className="w-4 h-4" />, cls: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3"
            >
              <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.cls}`}>
                {stat.icon}
              </span>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---- tab navigation ---- */}
        <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
          {[
            { key: 'faq' as const, label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
            { key: 'tickets' as const, label: 'My Tickets', icon: <MessageSquare className="w-4 h-4" /> },
            { key: 'help' as const, label: 'Help Center', icon: <BookOpen className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  FAQ TAB                                                      */}
        {/* ============================================================ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quick answers to common questions</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {MOCK_FAQS.map((faq) => (
                  <FAQAccordion
                    key={faq.id}
                    faq={faq}
                    isOpen={expandedFAQs.has(faq.id)}
                    onToggle={() => toggleFAQ(faq.id)}
                  />
                ))}
              </div>
            </div>

            {/* still need help card */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Still need help?</h3>
                <p className="text-emerald-100 text-sm mb-5 max-w-md">
                  If you could not find what you were looking for, our support team is ready to assist you. Create a ticket and we will get back to you within 24 hours.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setShowNewTicketForm(true);
                      setActiveTab('tickets');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                      bg-white text-emerald-700 hover:bg-emerald-50
                      transition-colors duration-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Ticket
                  </button>
                  <button
                    onClick={() => setActiveTab('help')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                      bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm
                      border border-white/20 transition-colors duration-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    Help Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TICKETS TAB                                                  */}
        {/* ============================================================ */}
        {activeTab === 'tickets' && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ---- left: ticket list ---- */}
            <div className={`w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 space-y-4 ${selectedTicket ? 'hidden lg:block' : ''}`}>
              {/* search & filter */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border-0 rounded-xl text-sm
                      text-slate-900 dark:text-white placeholder-slate-400
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setTicketStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                        ticketStatusFilter === status
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* ticket list */}
              <div className="space-y-2.5">
                {filteredTickets.map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    isSelected={ticket.id === selectedTicketId}
                    onClick={() => setSelectedTicketId(ticket.id)}
                  />
                ))}

                {filteredTickets.length === 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center">
                    <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">No tickets found</p>
                  </div>
                )}
              </div>
            </div>

            {/* ---- right: ticket detail / new ticket form ---- */}
            <div className={`flex-1 min-w-0 ${!selectedTicket && !showNewTicketForm ? 'hidden lg:block' : ''}`}>

              {/* ---- ticket detail view ---- */}
              {selectedTicket && !showNewTicketForm && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  {/* ticket header */}
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0 flex-1">
                        {/* mobile back button */}
                        <button
                          onClick={() => setSelectedTicketId(null)}
                          className="lg:hidden inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-2 transition-colors"
                        >
                          <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
                          Back to tickets
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {selectedTicket.subject}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Ticket #{selectedTicket.id} &middot; Created {formatDate(selectedTicket.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <StatusBadge status={selectedTicket.status} />
                        <PriorityBadge priority={selectedTicket.priority} />
                      </div>
                    </div>

                    {/* original description */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Original Description
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </div>

                  {/* conversation thread */}
                  <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
                    {selectedTicket.messages.map((msg) => (
                      <TicketMessageBubble key={msg.id} message={msg} />
                    ))}
                  </div>

                  {/* reply input */}
                  {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            rows={2}
                            className="w-full resize-none rounded-xl bg-slate-100 dark:bg-slate-700 border-0 px-4 py-3 text-sm
                              text-slate-900 dark:text-white placeholder-slate-400
                              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow max-h-[120px]"
                          />
                        </div>
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
                            replyText.trim()
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-100'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 scale-95'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* closed/resolved notice */}
                  {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        This ticket is {selectedTicket.status}. Reply is disabled.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ---- new ticket form ---- */}
              {showNewTicketForm && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Ticket</h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Describe your issue and we will get back to you</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowNewTicketForm(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* subject */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        placeholder="Brief summary of your issue"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                          text-sm text-slate-900 dark:text-white placeholder-slate-400
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {/* description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={newTicketDescription}
                        onChange={(e) => setNewTicketDescription(e.target.value)}
                        placeholder="Provide details about your issue. Include order IDs, error messages, or steps to reproduce if applicable."
                        rows={5}
                        className="w-full resize-none px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                          text-sm text-slate-900 dark:text-white placeholder-slate-400 leading-relaxed
                          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {/* priority */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                      </label>
                      <div className="flex gap-2.5">
                        {(['low', 'medium', 'high'] as const).map((p) => {
                          const priorityConfig = {
                            low: { label: 'Low', cls: 'border-gray-300 dark:border-gray-600', activeCls: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-500' },
                            medium: { label: 'Medium', cls: 'border-amber-300 dark:border-amber-700', activeCls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-400 dark:border-amber-600' },
                            high: { label: 'High', cls: 'border-red-300 dark:border-red-700', activeCls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-400 dark:border-red-600' },
                          };
                          const config = priorityConfig[p];
                          return (
                            <button
                              key={p}
                              onClick={() => setNewTicketPriority(p)}
                              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                                newTicketPriority === p
                                  ? config.activeCls
                                  : `bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 ${config.cls} hover:bg-slate-50 dark:hover:bg-slate-700`
                              }`}
                            >
                              {config.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* submit */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setShowNewTicketForm(false)}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium
                          bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                          hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateTicket}
                        disabled={!newTicketSubject.trim() || !newTicketDescription.trim()}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          newTicketSubject.trim() && newTicketDescription.trim()
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md shadow-emerald-500/20'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        Submit Ticket
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- empty state when no ticket selected ---- */}
              {!selectedTicket && !showNewTicketForm && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-5">
                    <MessageSquare className="h-7 w-7 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select a Ticket</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                    Choose a ticket from the list to view the conversation and details, or create a new support ticket.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  HELP CENTER TAB                                              */}
        {/* ============================================================ */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            {/* hero */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Help Center</h2>
                <p className="text-emerald-100 text-sm sm:text-base max-w-lg">
                  Explore our guides and resources to get the most out of SkillSwap Campus. Whether you are a freelancer or a client, we have got you covered.
                </p>
              </div>
            </div>

            {/* help cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HELP_CENTER_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700
                    hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg hover:shadow-emerald-500/5
                    transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                      {link.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {link.title}
                        </h3>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* additional resources */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Additional Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { title: 'Community Forums', desc: 'Connect with other students and freelancers' },
                  { title: 'Video Tutorials', desc: 'Step-by-step guides for platform features' },
                  { title: 'Blog & Updates', desc: 'Platform news, tips, and announcements' },
                  { title: 'API Documentation', desc: 'For developers integrating with SkillSwap' },
                  { title: 'Safety Guidelines', desc: 'Protect yourself while using the platform' },
                  { title: 'Terms of Service', desc: 'Our policies and terms of use' },
                ].map((resource) => (
                  <a
                    key={resource.title}
                    href="#"
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700
                      hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10
                      transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {resource.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{resource.desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                ))}
              </div>
            </div>

            {/* contact card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Need direct assistance?</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Our support team is available Monday to Saturday, 9 AM to 8 PM IST.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setShowNewTicketForm(true);
                      setActiveTab('tickets');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                      bg-gradient-to-r from-emerald-600 to-teal-600 text-white
                      hover:from-emerald-700 hover:to-teal-700
                      transition-all duration-200 shadow-sm hover:shadow-md shadow-emerald-500/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Open Ticket
                  </button>
                  <a
                    href="mailto:support@skillswapcampus.in"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                      bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                      hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
