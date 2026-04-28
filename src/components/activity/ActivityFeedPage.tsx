import { useState, useMemo } from 'react';
import { Zap, Star, Briefcase, DollarSign, Users, MessageSquare, Award, Clock, TrendingUp, CheckCircle, ArrowRight, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../common/Badge';

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type ActivityType = 'gig_posted' | 'task_completed' | 'user_joined' | 'review_given' | 'payment_released' | 'badge_earned' | 'order_delivered';
type FilterType = 'all' | 'gigs' | 'tasks' | 'users' | 'payments' | 'reviews';

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  user: { name: string; avatar_url: string };
  entity?: string;
  entityLink?: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

interface TrendingCategory {
  name: string;
  change: string;
  icon: typeof TrendingUp;
}

interface TopPerformer {
  id: string;
  name: string;
  avatar_url: string;
  metric: string;
  value: string;
}

const ACTIVITY_TYPE_CONFIG: Record<ActivityType, { icon: typeof Zap; color: string; bgColor: string; label: string }> = {
  gig_posted: { icon: Briefcase, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'New Gig' },
  task_completed: { icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30', label: 'Task Done' },
  user_joined: { icon: Users, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'New User' },
  review_given: { icon: Star, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', label: 'Review' },
  payment_released: { icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Payment' },
  badge_earned: { icon: Award, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30', label: 'Badge' },
  order_delivered: { icon: Zap, color: 'text-teal-600 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30', label: 'Delivered' },
};

const FILTER_MAP: Record<FilterType, ActivityType[]> = {
  all: ['gig_posted', 'task_completed', 'user_joined', 'review_given', 'payment_released', 'badge_earned', 'order_delivered'],
  gigs: ['gig_posted'],
  tasks: ['task_completed', 'order_delivered'],
  users: ['user_joined', 'badge_earned'],
  payments: ['payment_released'],
  reviews: ['review_given'],
};

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a-1', type: 'gig_posted',
    description: 'posted a new gig "Build a Responsive React Landing Page"',
    user: { name: 'Ara Patel', avatar_url: '' },
    entity: 'React Landing Page', entityLink: '#',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
    metadata: { price: 45 },
  },
  {
    id: 'a-2', type: 'task_completed',
    description: 'completed the task "Redesign Student Organization Website"',
    user: { name: 'Mia Chen', avatar_url: '' },
    entity: 'Website Redesign', entityLink: '#',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    metadata: { budget: 350 },
  },
  {
    id: 'a-3', type: 'user_joined',
    description: 'joined SkillSwap Campus as a freelancer',
    user: { name: 'Devon Park', avatar_url: '' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a-4', type: 'review_given',
    description: 'left a 5-star review for "Logo & Brand Kit Design"',
    user: { name: 'LaunchPad Startup', avatar_url: '' },
    entity: 'Logo & Brand Kit', entityLink: '#',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    metadata: { rating: 5 },
  },
  {
    id: 'a-5', type: 'payment_released',
    description: 'released payment of $60 for "Logo & Brand Kit Design"',
    user: { name: 'LaunchPad Startup', avatar_url: '' },
    entity: 'Logo & Brand Kit', entityLink: '#',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { amount: 60 },
  },
  {
    id: 'a-6', type: 'badge_earned',
    description: 'earned the "Social Butterfly" badge for 3 successful referrals',
    user: { name: 'Ara Patel', avatar_url: '' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    metadata: { badge: 'Social Butterfly' },
  },
  {
    id: 'a-7', type: 'order_delivered',
    description: 'delivered the order "Cinematic YouTube Video Edit"',
    user: { name: 'Jake Rivera', avatar_url: '' },
    entity: 'YouTube Video Edit', entityLink: '#',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a-8', type: 'gig_posted',
    description: 'posted a new gig "Build Interactive Data Dashboards"',
    user: { name: 'Lee Kim', avatar_url: '' },
    entity: 'Data Dashboards', entityLink: '#',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString(), // Yesterday
    metadata: { price: 80 },
  },
  {
    id: 'a-9', type: 'task_completed',
    description: 'completed the task "Clean and Analyze Survey Dataset"',
    user: { name: 'Lee Kim', avatar_url: '' },
    entity: 'Survey Analysis', entityLink: '#',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
    metadata: { budget: 75 },
  },
  {
    id: 'a-10', type: 'user_joined',
    description: 'joined SkillSwap Campus as a client',
    user: { name: 'Campus Research Lab', avatar_url: '' },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a-11', type: 'review_given',
    description: 'left a 4-star review for "Website Redesign Project"',
    user: { name: 'Campus Coding Club', avatar_url: '' },
    entity: 'Website Redesign', entityLink: '#',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000).toISOString(),
    metadata: { rating: 4 },
  },
  {
    id: 'a-12', type: 'payment_released',
    description: 'released payment of $200 for "Website Redesign"',
    user: { name: 'Campus Coding Club', avatar_url: '' },
    entity: 'Website Redesign', entityLink: '#',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 10 * 60 * 60 * 1000).toISOString(),
    metadata: { amount: 200 },
  },
  {
    id: 'a-13', type: 'badge_earned',
    description: 'earned the "Rising Star" badge for completing 10 orders',
    user: { name: 'Mia Chen', avatar_url: '' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(), // Earlier
  },
  {
    id: 'a-14', type: 'order_delivered',
    description: 'delivered the order "SEO Blog Articles Pack"',
    user: { name: 'Priya Sharma', avatar_url: '' },
    entity: 'Blog Articles', entityLink: '#',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a-15', type: 'gig_posted',
    description: 'posted a new gig "Develop a Cross-Platform Flutter App"',
    user: { name: 'Sam Okonkwo', avatar_url: '' },
    entity: 'Flutter App', entityLink: '#',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { price: 120 },
  },
  {
    id: 'a-16', type: 'user_joined',
    description: 'joined SkillSwap Campus as a freelancer',
    user: { name: 'Riley Davis', avatar_url: '' },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a-17', type: 'task_completed',
    description: 'completed the task "Social Media Graphics Pack"',
    user: { name: 'Mia Chen', avatar_url: '' },
    entity: 'Graphics Pack', entityLink: '#',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { budget: 150 },
  },
  {
    id: 'a-18', type: 'payment_released',
    description: 'released payment of $350 for "Website Redesign"',
    user: { name: 'Campus Coding Club', avatar_url: '' },
    entity: 'Website Redesign', entityLink: '#',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { amount: 350 },
  },
];

const MOCK_TRENDING_CATEGORIES: TrendingCategory[] = [
  { name: 'Web Development', change: '+34%', icon: TrendingUp },
  { name: 'Graphic Design', change: '+22%', icon: TrendingUp },
  { name: 'Data Analysis', change: '+18%', icon: TrendingUp },
  { name: 'Content Writing', change: '+15%', icon: TrendingUp },
  { name: 'Video Editing', change: '+12%', icon: TrendingUp },
];

const MOCK_TOP_PERFORMERS: TopPerformer[] = [
  { id: 'tp-1', name: 'Ara Patel', avatar_url: '', metric: 'Earnings', value: '$1,250' },
  { id: 'tp-2', name: 'Mia Chen', avatar_url: '', metric: 'Completed', value: '8 orders' },
  { id: 'tp-3', name: 'Lee Kim', avatar_url: '', metric: 'Rating', value: '4.9' },
  { id: 'tp-4', name: 'Priya Sharma', avatar_url: '', metric: 'Response', value: '100%' },
];

const PLATFORM_STATS = [
  { label: 'Active Gigs', value: '1,247', icon: Briefcase },
  { label: 'Open Tasks', value: '389', icon: CheckCircle },
  { label: 'New Users', value: '156', icon: Users },
  { label: 'Payments', value: '$12.4K', icon: DollarSign },
];

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

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function groupByDate(activities: ActivityItem[]): { label: string; items: ActivityItem[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  const groups: Record<string, ActivityItem[]> = { today: [], yesterday: [], earlier: [] };

  for (const activity of activities) {
    const activityTime = new Date(activity.timestamp).getTime();
    if (activityTime >= startOfToday) {
      groups.today.push(activity);
    } else if (activityTime >= startOfYesterday) {
      groups.yesterday.push(activity);
    } else {
      groups.earlier.push(activity);
    }
  }

  const result: { label: string; items: ActivityItem[] }[] = [];
  if (groups.today.length > 0) result.push({ label: 'Today', items: groups.today });
  if (groups.yesterday.length > 0) result.push({ label: 'Yesterday', items: groups.yesterday });
  if (groups.earlier.length > 0) result.push({ label: 'Earlier', items: groups.earlier });
  return result;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ActivityFeedPage() {
  const { profile: _profile } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredActivities = useMemo(() => {
    const allowedTypes = FILTER_MAP[activeFilter];
    return MOCK_ACTIVITIES.filter((a) => allowedTypes.includes(a.type));
  }, [activeFilter]);

  const groupedActivities = useMemo(() => groupByDate(filteredActivities), [filteredActivities]);

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
              Activity
              <span className="block text-emerald-200">Feed</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
              Stay up to date with everything happening on SkillSwap Campus. See what your peers are working on.
            </p>
          </div>
        </div>
      </section>

      {/* Platform stats */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity feed */}
          <div className="lg:col-span-2">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
                {([
                  { key: 'all' as FilterType, label: 'All' },
                  { key: 'gigs' as FilterType, label: 'Gigs' },
                  { key: 'tasks' as FilterType, label: 'Tasks' },
                  { key: 'users' as FilterType, label: 'Users' },
                  { key: 'payments' as FilterType, label: 'Payments' },
                  { key: 'reviews' as FilterType, label: 'Reviews' },
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeFilter === key
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg ml-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mx-1.5" />
              </div>
            </div>

            {/* Activity groups */}
            {groupedActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No activity yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Check back later for updates from the community.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedActivities.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      {group.label}
                    </h3>
                    <div className="space-y-3">
                      {group.items.map((activity) => {
                        const config = ACTIVITY_TYPE_CONFIG[activity.type];
                        const Icon = config.icon;
                        return (
                          <div
                            key={activity.id}
                            className="group flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                          >
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    <span className="font-semibold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer transition-colors">
                                      {activity.user.name}
                                    </span>{' '}
                                    {activity.description}
                                  </p>
                                  {activity.entity && (
                                    <button className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                      {activity.entity}
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge label={config.label} variant="default" size="sm" />
                                </div>
                              </div>
                              {/* Metadata */}
                              {activity.metadata && (
                                <div className="flex items-center gap-3 mt-2">
                                  {activity.metadata.price !== undefined && (
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">${activity.metadata.price}</span>
                                  )}
                                  {activity.metadata.budget !== undefined && (
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">${activity.metadata.budget}</span>
                                  )}
                                  {activity.metadata.amount !== undefined && (
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">${activity.metadata.amount}</span>
                                  )}
                                  {activity.metadata.rating !== undefined && (
                                    <div className="flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{activity.metadata.rating}</span>
                                    </div>
                                  )}
                                  {activity.metadata.badge !== undefined && (
                                    <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                                      <Award className="w-3 h-3" />
                                      {activity.metadata.badge}
                                    </span>
                                  )}
                                </div>
                              )}
                              {/* Timestamp */}
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(activity.timestamp)}</span>
                              </div>
                            </div>

                            {/* User avatar */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(activity.user.name)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Categories */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Trending Categories
              </h3>
              <div className="space-y-3">
                {MOCK_TRENDING_CATEGORIES.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                          {index + 1}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{category.name}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Icon className="w-3 h-3" />
                        {category.change}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Top Performers
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">This Week</span>
              </h3>
              <div className="space-y-3">
                {MOCK_TOP_PERFORMERS.map((performer, index) => (
                  <div key={performer.id} className={`flex items-center gap-3 p-3 rounded-xl ${index === 0 ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {getInitials(performer.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{performer.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{performer.metric}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">{performer.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-900 dark:to-teal-900 rounded-2xl p-6 text-white">
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Community Pulse
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-100">Active this week</span>
                  <span className="text-lg font-bold">2,481</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-100">New gigs posted</span>
                  <span className="text-lg font-bold">147</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-100">Tasks completed</span>
                  <span className="text-lg font-bold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-100">XP distributed</span>
                  <span className="text-lg font-bold">24.5K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
