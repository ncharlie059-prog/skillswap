import { useState } from 'react';
import {
  Bell,
  MessageSquare,
  DollarSign,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Trash2,
  Check,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Notification } from '../../types';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    type: 'message',
    title: 'New message from Priya Sharma',
    content: 'Hey! I just sent the updated mockups for the landing page. Can you review them when you get a chance?',
    is_read: false,
    link: '/messages/conv-1',
    created_at: '2026-04-27T10:25:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    type: 'payment',
    title: 'Payment received',
    content: 'You received $250.00 for "Logo Design Package" from Vikram Desai. Funds have been added to your wallet.',
    is_read: false,
    link: '/wallet',
    created_at: '2026-04-27T09:50:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'user-1',
    type: 'order',
    title: 'New order placed',
    content: 'Ananya Reddy placed an order for your gig "Data Analysis & Visualization". Deadline: 5 days.',
    is_read: false,
    link: '/orders/notif-3',
    created_at: '2026-04-27T09:15:00Z',
  },
  {
    id: 'notif-4',
    user_id: 'user-1',
    type: 'application',
    title: 'Application accepted',
    content: 'Your application for "Mobile App Development" has been accepted by Arjun Mehta. Check the project details to get started.',
    is_read: false,
    link: '/orders/notif-4',
    created_at: '2026-04-27T08:30:00Z',
  },
  {
    id: 'notif-5',
    user_id: 'user-1',
    type: 'deadline',
    title: 'Deadline approaching',
    content: 'Your order "UI/UX Redesign for Campus App" is due in 24 hours. Make sure to submit your deliverables on time.',
    is_read: true,
    link: '/orders/notif-5',
    created_at: '2026-04-27T07:00:00Z',
  },
  {
    id: 'notif-6',
    user_id: 'user-1',
    type: 'system',
    title: 'Profile verification approved',
    content: 'Your college ID has been verified successfully. You now have access to all verified-only gigs and features.',
    is_read: true,
    link: '/settings',
    created_at: '2026-04-26T16:45:00Z',
  },
  {
    id: 'notif-7',
    user_id: 'user-1',
    type: 'payment',
    title: 'Escrow deposit confirmed',
    content: 'Rahul Joshi has deposited $180.00 into escrow for "WordPress Website Setup". You can begin working on the order.',
    is_read: false,
    link: '/orders/notif-7',
    created_at: '2026-04-26T14:20:00Z',
  },
  {
    id: 'notif-8',
    user_id: 'user-1',
    type: 'message',
    title: 'New message from Sneha Kulkarni',
    content: 'The logo designs are ready for review! I have attached all three concepts we discussed.',
    is_read: true,
    link: '/messages/conv-3',
    created_at: '2026-04-26T11:30:00Z',
  },
  {
    id: 'notif-9',
    user_id: 'user-1',
    type: 'order',
    title: 'Order revision requested',
    content: 'Vikram Desai requested a revision on "Landing Page Design". Please review the feedback and update your submission.',
    is_read: true,
    link: '/orders/notif-9',
    created_at: '2026-04-26T09:10:00Z',
  },
  {
    id: 'notif-10',
    user_id: 'user-1',
    type: 'application',
    title: 'New application received',
    content: 'Kavya Nair applied to your task "Python Script Automation". Proposed budget: $120, proposed deadline: 3 days.',
    is_read: false,
    link: '/tasks/notif-10',
    created_at: '2026-04-25T18:00:00Z',
  },
  {
    id: 'notif-11',
    user_id: 'user-1',
    type: 'deadline',
    title: 'Deadline missed',
    content: 'Your order "Social Media Banner Set" has passed its deadline. Please submit your work or contact the client immediately.',
    is_read: true,
    link: '/orders/notif-11',
    created_at: '2026-04-25T12:00:00Z',
  },
  {
    id: 'notif-12',
    user_id: 'user-1',
    type: 'system',
    title: 'New feature: Skill endorsements',
    content: 'You can now endorse skills on freelancer profiles. Try endorsing your peers to help them stand out!',
    is_read: true,
    link: '/settings',
    created_at: '2026-04-24T10:00:00Z',
  },
  {
    id: 'notif-13',
    user_id: 'user-1',
    type: 'payment',
    title: 'Wallet withdrawal processed',
    content: 'Your withdrawal of $500.00 has been processed and should appear in your bank account within 2-3 business days.',
    is_read: true,
    link: '/wallet',
    created_at: '2026-04-23T15:30:00Z',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type NotificationType = Notification['type'];
type FilterOption = 'all' | NotificationType;

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'message', label: 'Messages' },
  { value: 'payment', label: 'Payments' },
  { value: 'order', label: 'Orders' },
  { value: 'application', label: 'Applications' },
  { value: 'deadline', label: 'Deadlines' },
  { value: 'system', label: 'System' },
];

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case 'message':
      return MessageSquare;
    case 'payment':
      return DollarSign;
    case 'order':
      return FileText;
    case 'application':
      return CheckCircle;
    case 'deadline':
      return Clock;
    case 'system':
      return AlertCircle;
  }
}

function getTypeIconBg(type: NotificationType) {
  switch (type) {
    case 'message':
      return 'bg-emerald-100 dark:bg-emerald-900/30';
    case 'payment':
      return 'bg-teal-100 dark:bg-teal-900/30';
    case 'order':
      return 'bg-cyan-100 dark:bg-cyan-900/30';
    case 'application':
      return 'bg-green-100 dark:bg-green-900/30';
    case 'deadline':
      return 'bg-amber-100 dark:bg-amber-900/30';
    case 'system':
      return 'bg-gray-100 dark:bg-gray-700/50';
  }
}

function getTypeIconColor(type: NotificationType) {
  switch (type) {
    case 'message':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'payment':
      return 'text-teal-600 dark:text-teal-400';
    case 'order':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'application':
      return 'text-green-600 dark:text-green-400';
    case 'deadline':
      return 'text-amber-600 dark:text-amber-400';
    case 'system':
      return 'text-gray-600 dark:text-gray-400';
  }
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date('2026-04-27T10:35:00Z');
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getTimeGroup(iso: string): 'Today' | 'Yesterday' | 'Earlier' {
  const date = new Date(iso);
  const now = new Date('2026-04-27T10:35:00Z');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return 'Earlier';
}

/* ------------------------------------------------------------------ */
/*  Notification Card                                                  */
/* ------------------------------------------------------------------ */

function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getTypeIcon(notification.type);
  const iconBg = getTypeIconBg(notification.type);
  const iconColor = getTypeIconColor(notification.type);

  return (
    <div
      onClick={() => {
        if (!notification.is_read) onMarkRead(notification.id);
      }}
      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
        notification.is_read
          ? 'bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800'
          : 'bg-emerald-50/60 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30'
      }`}
    >
      {/* Unread indicator dot */}
      {!notification.is_read && (
        <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-900/50" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className={`text-sm font-semibold truncate ${
            notification.is_read
              ? 'text-gray-700 dark:text-gray-300'
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {notification.title}
          </h3>
        </div>
        <p className={`text-sm leading-relaxed line-clamp-2 ${
          notification.is_read
            ? 'text-gray-500 dark:text-gray-400'
            : 'text-gray-600 dark:text-gray-300'
        }`}>
          {notification.content}
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 inline-block">
          {formatTimestamp(notification.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!notification.is_read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification.id);
            }}
            className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            title="Mark as read"
          >
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Delete notification"
        >
          <Trash2 className="h-4 w-4 text-red-400 dark:text-red-500" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ filter }: { filter: FilterOption }) {
  const filterLabel = FILTER_OPTIONS.find((f) => f.value === filter)?.label ?? 'All';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No notifications
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {filter === 'all'
          ? 'You are all caught up! Notifications about messages, payments, and orders will appear here.'
          : `No ${filterLabel.toLowerCase()} notifications found. Try selecting a different filter.`}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function NotificationsPage() {
  const { profile: _profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  /* ---- derived state ---- */

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const groupedNotifications: Record<'Today' | 'Yesterday' | 'Earlier', Notification[]> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  filteredNotifications.forEach((n) => {
    const group = getTimeGroup(n.created_at);
    groupedNotifications[group].push(n);
  });

  /* ---- handlers ---- */

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleFilterSelect = (value: FilterOption) => {
    setActiveFilter(value);
    setShowFilterDropdown(false);
  };

  /* ---- render ---- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ---------------------------------------------------------- */}
        {/* Header                                                      */}
        {/* ---------------------------------------------------------- */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-colors duration-200"
                >
                  <Check className="h-4 w-4" />
                  Mark All Read
                </button>
              )}

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    activeFilter !== 'all'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50'
                      : 'text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label ?? 'Filter'}
                  </span>
                </button>

                {showFilterDropdown && (
                  <>
                    {/* Invisible backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 animate-in fade-in-0 slide-in-from-top-2 duration-150">
                      {FILTER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterSelect(option.value)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                            activeFilter === option.value
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          {activeFilter === option.value && (
                            <Check className="h-3.5 w-3.5 flex-shrink-0" />
                          )}
                          <span className={activeFilter === option.value ? '' : 'ml-[22px]'}>
                            {option.label}
                          </span>
                          {option.value !== 'all' && (
                            <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                              {notifications.filter((n) => n.type === option.value).length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only Mark All Read + Filter Chips */}
          <div className="mt-4 flex items-center gap-2 sm:hidden overflow-x-auto pb-1 -mx-1 px-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex-shrink-0"
              >
                <Check className="h-3 w-3" />
                Mark All Read
              </button>
            )}
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors duration-200 ${
                  activeFilter === option.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {option.label}
                {option.value !== 'all' && (
                  <span className="ml-1 opacity-60">
                    {notifications.filter((n) => n.type === option.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Notification List                                           */}
        {/* ---------------------------------------------------------- */}
        {filteredNotifications.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="space-y-6">
            {(['Today', 'Yesterday', 'Earlier'] as const).map((group) => {
              const groupItems = groupedNotifications[group];
              if (groupItems.length === 0) return null;

              return (
                <div key={group}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {group}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {groupItems.filter((n) => !n.is_read).length > 0 && (
                        <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          {groupItems.filter((n) => !n.is_read).length}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {groupItems.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer summary */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing {filteredNotifications.length} of {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {activeFilter !== 'all' && (
                <span>
                  {' '}in {FILTER_OPTIONS.find((f) => f.value === activeFilter)?.label}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
