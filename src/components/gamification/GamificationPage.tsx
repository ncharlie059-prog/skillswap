import { useState } from 'react';
import {
  Trophy,
  Star,
  Award,
  Zap,
  Target,
  TrendingUp,
  Medal,
  Crown,
  Flame,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { FreelancerProfile, Badge, UserBadge } from '../../types';

// --------------- helpers ---------------

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

// --------------- mock data ---------------

const MOCK_FREELANCER_PROFILE: FreelancerProfile = {
  id: 'fp-1',
  user_id: 'u-1',
  headline: 'Full-Stack Developer & UI Designer',
  bio: '',
  portfolio_url: '',
  education: 'B.Tech Computer Science',
  experience_years: 3,
  hourly_rate: 25,
  completion_rate: 96,
  response_rate: 92,
  on_time_delivery: 98,
  total_earnings: 4850,
  total_orders: 24,
  completed_orders: 23,
  xp: 2750,
  level: 7,
  profile_completion: 78,
  created_at: '2025-09-01T00:00:00Z',
  updated_at: '2026-04-20T00:00:00Z',
};

const XP_THRESHOLDS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 200 },
  { level: 3, xpRequired: 500 },
  { level: 4, xpRequired: 900 },
  { level: 5, xpRequired: 1400 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 2700 },
  { level: 8, xpRequired: 3500 },
  { level: 9, xpRequired: 4500 },
  { level: 10, xpRequired: 5700 },
  { level: 11, xpRequired: 7000 },
  { level: 12, xpRequired: 8500 },
];

const MOCK_BADGES: Badge[] = [
  { id: 'b-1', name: 'First Gig', description: 'Complete your very first order', icon: 'Zap', xp_required: 0 },
  { id: 'b-2', name: '5-Star Rating', description: 'Receive a perfect 5-star review', icon: 'Star', xp_required: 200 },
  { id: 'b-3', name: '10 Orders', description: 'Complete 10 orders successfully', icon: 'Target', xp_required: 900 },
  { id: 'b-4', name: 'Quick Responder', description: 'Maintain 90%+ response rate for 30 days', icon: 'Flame', xp_required: 500 },
  { id: 'b-5', name: 'Top Earner', description: 'Earn over INR 10,000 on the platform', icon: 'TrendingUp', xp_required: 2000 },
  { id: 'b-6', name: 'Campus Star', description: 'Get featured on the campus leaderboard', icon: 'Crown', xp_required: 2700 },
  { id: 'b-7', name: 'Speed Demon', description: 'Deliver 5 orders before the deadline', icon: 'Zap', xp_required: 1400 },
  { id: 'b-8', name: 'Perfectionist', description: 'Maintain 100% completion rate across 10+ orders', icon: 'Award', xp_required: 3500 },
  { id: 'b-9', name: 'Veteran', description: 'Be active on the platform for 6+ months', icon: 'Medal', xp_required: 4500 },
  { id: 'b-10', name: 'Grand Master', description: 'Reach Level 10 and unlock all achievements', icon: 'Trophy', xp_required: 5700 },
  { id: 'b-11', name: 'Crowd Favorite', description: 'Receive 20+ five-star reviews', icon: 'Star', xp_required: 7000 },
  { id: 'b-12', name: 'Centurion', description: 'Complete 100 orders on the platform', icon: 'Trophy', xp_required: 8500 },
];

const MOCK_USER_BADGES: UserBadge[] = [
  { id: 'ub-1', user_id: 'u-1', badge_id: 'b-1', earned_at: '2025-10-15T10:00:00Z', badge: MOCK_BADGES[0] },
  { id: 'ub-2', user_id: 'u-1', badge_id: 'b-2', earned_at: '2025-11-20T14:00:00Z', badge: MOCK_BADGES[1] },
  { id: 'ub-3', user_id: 'u-1', badge_id: 'b-3', earned_at: '2026-01-10T09:00:00Z', badge: MOCK_BADGES[2] },
  { id: 'ub-4', user_id: 'u-1', badge_id: 'b-4', earned_at: '2026-02-05T11:00:00Z', badge: MOCK_BADGES[3] },
  { id: 'ub-5', user_id: 'u-1', badge_id: 'b-5', earned_at: '2026-03-18T16:00:00Z', badge: MOCK_BADGES[4] },
  { id: 'ub-6', user_id: 'u-1', badge_id: 'b-6', earned_at: '2026-04-22T08:00:00Z', badge: MOCK_BADGES[5] },
];

interface LeaderboardEntry {
  id: string;
  name: string;
  college: string;
  xp: number;
  level: number;
  orders: number;
  rating: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u-10', name: 'Aarav Patel', college: 'IIT Bombay', xp: 6200, level: 10, orders: 87, rating: 4.9, isCurrentUser: false },
  { id: 'u-11', name: 'Diya Sharma', college: 'BITS Pilani', xp: 5800, level: 9, orders: 72, rating: 4.9, isCurrentUser: false },
  { id: 'u-12', name: 'Vivaan Reddy', college: 'NIT Trichy', xp: 5100, level: 9, orders: 65, rating: 4.8, isCurrentUser: false },
  { id: 'u-13', name: 'Ananya Gupta', college: 'VIT Vellore', xp: 4600, level: 8, orders: 58, rating: 4.8, isCurrentUser: false },
  { id: 'u-14', name: 'Kabir Singh', college: 'DTU Delhi', xp: 4200, level: 8, orders: 53, rating: 4.7, isCurrentUser: false },
  { id: 'u-15', name: 'Isha Verma', college: 'IIIT Hyderabad', xp: 3900, level: 8, orders: 48, rating: 4.7, isCurrentUser: false },
  { id: 'u-16', name: 'Rohan Nair', college: 'IIT Madras', xp: 3600, level: 7, orders: 42, rating: 4.6, isCurrentUser: false },
  { id: 'u-1', name: 'Alex Rivera', college: 'IIT Delhi', xp: 2750, level: 7, orders: 24, rating: 4.9, isCurrentUser: true },
  { id: 'u-17', name: 'Priya Iyer', college: 'NIT Surathkal', xp: 2600, level: 7, orders: 31, rating: 4.5, isCurrentUser: false },
  { id: 'u-18', name: 'Arjun Das', college: 'Jadavpur University', xp: 2400, level: 6, orders: 28, rating: 4.6, isCurrentUser: false },
  { id: 'u-19', name: 'Meera Joshi', college: 'Pune University', xp: 2100, level: 6, orders: 25, rating: 4.5, isCurrentUser: false },
  { id: 'u-20', name: 'Rahul Kapoor', college: 'Thapar University', xp: 1900, level: 5, orders: 22, rating: 4.4, isCurrentUser: false },
  { id: 'u-21', name: 'Sneha Rao', college: 'MS Ramaiah', xp: 1700, level: 5, orders: 19, rating: 4.3, isCurrentUser: false },
  { id: 'u-22', name: 'Karan Malhotra', college: 'Manipal University', xp: 1500, level: 5, orders: 18, rating: 4.5, isCurrentUser: false },
  { id: 'u-23', name: 'Nisha Pillai', college: 'CET Trivandrum', xp: 1300, level: 4, orders: 15, rating: 4.2, isCurrentUser: false },
  { id: 'u-24', name: 'Aditya Bansal', college: 'SRM Chennai', xp: 1100, level: 4, orders: 12, rating: 4.4, isCurrentUser: false },
  { id: 'u-25', name: 'Pooja Agarwal', college: 'KIIT Bhubaneswar', xp: 900, level: 4, orders: 10, rating: 4.1, isCurrentUser: false },
  { id: 'u-26', name: 'Vikram Chauhan', college: 'AMU Aligarh', xp: 700, level: 3, orders: 8, rating: 4.0, isCurrentUser: false },
  { id: 'u-27', name: 'Ritika Saxena', college: 'JMI Delhi', xp: 500, level: 3, orders: 6, rating: 4.3, isCurrentUser: false },
  { id: 'u-28', name: 'Siddharth Pandey', college: 'BHU Varanasi', xp: 200, level: 2, orders: 3, rating: 4.0, isCurrentUser: false },
];

const XP_BREAKDOWN = [
  { action: 'Complete an order', xp: 50, icon: <Target className="w-4 h-4" /> },
  { action: 'Receive a 5-star review', xp: 30, icon: <Star className="w-4 h-4" /> },
  { action: 'Respond within 1 hour', xp: 10, icon: <Zap className="w-4 h-4" /> },
  { action: 'Deliver before deadline', xp: 20, icon: <Flame className="w-4 h-4" /> },
  { action: 'Complete profile', xp: 100, icon: <Award className="w-4 h-4" /> },
  { action: 'Earn a badge', xp: 25, icon: <Medal className="w-4 h-4" /> },
  { action: 'Weekly streak (7 days active)', xp: 75, icon: <TrendingUp className="w-4 h-4" /> },
  { action: 'Refer a friend who signs up', xp: 50, icon: <Crown className="w-4 h-4" /> },
];

// --------------- sub-components ---------------

function BadgeIcon({ iconName, className }: { iconName: string; className?: string }) {
  const iconClass = className || 'w-6 h-6';
  const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy className={iconClass} />,
    Star: <Star className={iconClass} />,
    Award: <Award className={iconClass} />,
    Zap: <Zap className={iconClass} />,
    Target: <Target className={iconClass} />,
    TrendingUp: <TrendingUp className={iconClass} />,
    Medal: <Medal className={iconClass} />,
    Crown: <Crown className={iconClass} />,
    Flame: <Flame className={iconClass} />,
  };
  return <>{iconMap[iconName] || <Award className={iconClass} />}</>;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-md shadow-amber-500/30">
        <Crown className="w-4 h-4" />
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-md shadow-slate-400/20">
        <Medal className="w-4 h-4" />
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/20">
        <Medal className="w-4 h-4" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold">
      {rank}
    </span>
  );
}

// --------------- main component ---------------

export default function GamificationPage() {
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'xp' | 'level' | 'orders' | 'rating'>('xp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const freelancerProfile = MOCK_FREELANCER_PROFILE;
  const displayName = profile?.full_name || 'Alex Rivera';

  // Level / XP calculations
  const currentLevel = freelancerProfile.level;
  const currentXP = freelancerProfile.xp;
  const currentThreshold = XP_THRESHOLDS.find(t => t.level === currentLevel) || XP_THRESHOLDS[0];
  const nextThreshold = XP_THRESHOLDS.find(t => t.level === currentLevel + 1);
  const xpInCurrentLevel = currentXP - currentThreshold.xpRequired;
  const xpForNextLevel = nextThreshold ? nextThreshold.xpRequired - currentThreshold.xpRequired : currentThreshold.xpRequired;
  const xpProgressPercent = nextThreshold
    ? Math.min(Math.round((xpInCurrentLevel / xpForNextLevel) * 100), 100)
    : 100;

  // Badges earned vs locked
  const earnedBadgeIds = new Set(MOCK_USER_BADGES.map(ub => ub.badge_id));
  const earnedBadges = MOCK_BADGES.filter(b => earnedBadgeIds.has(b.id));
  const lockedBadges = MOCK_BADGES.filter(b => !earnedBadgeIds.has(b.id));

  // Leaderboard sorting
  const sortedLeaderboard = [...MOCK_LEADERBOARD].sort((a, b) => {
    const modifier = sortDirection === 'desc' ? -1 : 1;
    return (a[sortField] - b[sortField]) * modifier;
  });

  // Pagination
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(sortedLeaderboard.length / ITEMS_PER_PAGE);
  const paginatedLeaderboard = sortedLeaderboard.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Find current user's rank in the default sort (by XP desc)
  const userRank = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp).findIndex(e => e.isCurrentUser) + 1;

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }

  function SortIcon({ field }: { field: typeof sortField }) {
    if (sortField !== field) return null;
    return sortDirection === 'desc'
      ? <ChevronDown className="w-3.5 h-3.5" />
      : <ChevronUp className="w-3.5 h-3.5" />;
  }

  // Level title
  const levelTitle = (level: number): string => {
    if (level >= 10) return 'Grand Master';
    if (level >= 8) return 'Expert';
    if (level >= 6) return 'Pro';
    if (level >= 4) return 'Skilled';
    if (level >= 2) return 'Rising';
    return 'Beginner';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ===== Page Header ===== */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            Gamification & Leaderboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Track your progress, earn badges, and climb the campus leaderboard
          </p>
        </div>

        {/* ===== Your Profile Section ===== */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left: Level Display */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-xl">
                    <span className="text-3xl font-bold text-white">{currentLevel}</span>
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
                    <Star className="w-4 h-4 text-amber-900 fill-amber-900" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-100">Level {currentLevel} -- {levelTitle(currentLevel)}</p>
                  <p className="text-2xl font-bold mt-0.5">{displayName}</p>
                  <p className="text-sm text-emerald-200 mt-1">
                    {currentXP.toLocaleString()} XP earned
                  </p>
                </div>
              </div>

              {/* Right: XP Progress & Stats */}
              <div className="flex-1 max-w-xl space-y-4">
                {/* XP Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-100">
                      Progress to Level {currentLevel + 1}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {xpProgressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${xpProgressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-emerald-200">
                      {xpInCurrentLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                    </span>
                    {nextThreshold && (
                      <span className="text-xs text-emerald-200">
                        {(nextThreshold.xpRequired - currentXP).toLocaleString()} XP needed
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <div>
                      <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-medium">Rank</p>
                      <p className="text-sm font-bold">#{userRank}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <Award className="w-4 h-4 text-amber-300" />
                    <div>
                      <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-medium">Badges</p>
                      <p className="text-sm font-bold">{earnedBadges.length}/{MOCK_BADGES.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <Star className="w-4 h-4 text-amber-300" />
                    <div>
                      <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-medium">Rating</p>
                      <p className="text-sm font-bold">4.9</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <Flame className="w-4 h-4 text-amber-300" />
                    <div>
                      <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-medium">Orders</p>
                      <p className="text-sm font-bold">{freelancerProfile.completed_orders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Badges Showcase ===== */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Badges Showcase
              </h2>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {earnedBadges.length} of {MOCK_BADGES.length} earned
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Earned badges */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Earned
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {earnedBadges.map(badge => {
                  const userBadge = MOCK_USER_BADGES.find(ub => ub.badge_id === badge.id);
                  const earnedDate = userBadge
                    ? new Date(userBadge.earned_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';
                  return (
                    <div
                      key={badge.id}
                      className="group relative flex flex-col items-center text-center p-4 rounded-xl
                        bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800
                        hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700
                        transition-all duration-300 cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        <BadgeIcon iconName={badge.icon} className="w-6 h-6" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                        {badge.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        {earnedDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Locked badges */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                Locked
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {lockedBadges.map(badge => {
                  const xpNeeded = Math.max(badge.xp_required - currentXP, 0);
                  return (
                    <div
                      key={badge.id}
                      className="group relative flex flex-col items-center text-center p-4 rounded-xl
                        bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600
                        opacity-60 hover:opacity-80 transition-all duration-300 cursor-default"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <BadgeIcon iconName={badge.icon} className="w-6 h-6" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                        {badge.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP needed` : 'Almost there!'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Main Content Grid: Leaderboard + XP Breakdown ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Leaderboard Table */}
          <section className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Campus Leaderboard
                </h2>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                  {MOCK_LEADERBOARD.length} students
                </span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">
                      Rank
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xl:table-cell">
                      College
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('xp')}
                    >
                      <span className="inline-flex items-center gap-1">XP <SortIcon field="xp" /></span>
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('level')}
                    >
                      <span className="inline-flex items-center gap-1">Level <SortIcon field="level" /></span>
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('orders')}
                    >
                      <span className="inline-flex items-center gap-1">Orders <SortIcon field="orders" /></span>
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      onClick={() => handleSort('rating')}
                    >
                      <span className="inline-flex items-center gap-1">Rating <SortIcon field="rating" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {paginatedLeaderboard.map((entry, index) => {
                    const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    const isTop3 = globalRank <= 3;
                    const isCurrentUser = entry.isCurrentUser;

                    // Compute the sorted order for the rank display
                    const rankForDisplay = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp).findIndex(e => e.id === entry.id) + 1;

                    let rowBg = '';
                    if (isCurrentUser) {
                      rowBg = 'bg-emerald-50 dark:bg-emerald-900/20';
                    } else if (isTop3 && rankForDisplay <= 3) {
                      rowBg = rankForDisplay === 1
                        ? 'bg-amber-50/50 dark:bg-amber-900/10'
                        : rankForDisplay === 2
                          ? 'bg-slate-50/80 dark:bg-slate-700/30'
                          : 'bg-orange-50/40 dark:bg-orange-900/10';
                    }

                    return (
                      <tr
                        key={entry.id}
                        className={`${rowBg} hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150 ${
                          isCurrentUser ? 'ring-1 ring-inset ring-emerald-300 dark:ring-emerald-700' : ''
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <RankBadge rank={rankForDisplay} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCurrentUser
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                            }`}>
                              {entry.name.charAt(0)}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${
                                isCurrentUser
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}>
                                {entry.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden xl:table-cell">
                          <p className="text-sm text-slate-500 dark:text-slate-400">{entry.college}</p>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`text-sm font-bold ${
                            rankForDisplay <= 3
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {formatNumber(entry.xp)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold">
                            {entry.level}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{entry.orders}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {entry.rating}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
              {paginatedLeaderboard.map((entry, _index) => {
                const rankForDisplay = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp).findIndex(e => e.id === entry.id) + 1;
                const isCurrentUser = entry.isCurrentUser;

                return (
                  <div
                    key={entry.id}
                    className={`p-4 transition-colors duration-150 ${
                      isCurrentUser
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-inset ring-emerald-300 dark:ring-emerald-700'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RankBadge rank={rankForDisplay} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isCurrentUser ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {entry.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{entry.college}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {formatNumber(entry.xp)} XP
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Lvl {entry.level} &middot; {entry.orders} orders &middot; <Star className="w-3 h-3 inline text-amber-400 fill-amber-400" /> {entry.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                      hover:bg-slate-200 dark:hover:bg-slate-600
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-colors duration-200"
                  >
                    <ChevronUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                        page === currentPage
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                      bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300
                      hover:bg-slate-200 dark:hover:bg-slate-600
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-colors duration-200"
                  >
                    Next
                    <ChevronUp className="w-3.5 h-3.5 rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* XP Breakdown */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                How to Earn XP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complete activities to level up and unlock badges
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              {XP_BREAKDOWN.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40
                    hover:bg-emerald-50 dark:hover:bg-emerald-900/10
                    border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800
                    transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.action}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    +{item.xp}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Streak Bonus
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Stay active every day and earn bonus XP. Weekly streaks of 7 days grant an extra 75 XP. Monthly streaks of 30 days double your weekly bonus!
                </p>
              </div>
            </div>

            {/* Level Progression Reference */}
            <div className="p-5 sm:p-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Level Progression
              </h3>
              <div className="space-y-2">
                {XP_THRESHOLDS.slice(0, 10).map(t => {
                  const isUnlocked = currentLevel >= t.level;
                  const isCurrent = currentLevel === t.level;
                  return (
                    <div
                      key={t.level}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors duration-200 ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-700'
                          : isUnlocked
                            ? 'bg-slate-50 dark:bg-slate-700/30'
                            : 'opacity-40'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-emerald-500 text-white'
                          : isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500'
                      }`}>
                        {t.level}
                      </span>
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          isCurrent
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : isUnlocked
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {levelTitle(t.level)}
                        </p>
                      </div>
                      <span className={`text-xs font-mono ${
                        isCurrent
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}>
                        {t.xpRequired >= 1000 ? `${(t.xpRequired / 1000).toFixed(1)}k` : t.xpRequired} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
