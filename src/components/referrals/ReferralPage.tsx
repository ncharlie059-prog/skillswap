import { useState } from 'react';
import { Gift, Copy, Share2, Users, CheckCircle, Zap, Award, Link, Mail, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../common/Badge';
import StatsCard from '../common/StatsCard';

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

interface ReferralEntry {
  id: string;
  name: string;
  status: 'pending' | 'signed_up' | 'earned';
  date: string;
  xpEarned: number;
}

interface ReferralLeader {
  id: string;
  name: string;
  avatar_url: string;
  referrals: number;
  xpEarned: number;
}

interface RewardMilestone {
  id: string;
  referrals: number;
  xpBonus: number;
  badge: string;
  unlocked: boolean;
}

const REFERRAL_CODE = 'SKILLSWAP-ABC123';
const REFERRAL_LINK = `https://skillswap.campus/join?ref=${REFERRAL_CODE}`;

const MOCK_REFERRAL_HISTORY: ReferralEntry[] = [
  { id: 'r-1', name: 'Jordan Williams', status: 'earned', date: '2026-04-26', xpEarned: 50 },
  { id: 'r-2', name: 'Taylor Brooks', status: 'signed_up', date: '2026-04-24', xpEarned: 0 },
  { id: 'r-3', name: 'Casey Morgan', status: 'earned', date: '2026-04-22', xpEarned: 50 },
  { id: 'r-4', name: 'Riley Davis', status: 'pending', date: '2026-04-20', xpEarned: 0 },
  { id: 'r-5', name: 'Alex Kim', status: 'earned', date: '2026-04-18', xpEarned: 50 },
  { id: 'r-6', name: 'Morgan Lee', status: 'signed_up', date: '2026-04-15', xpEarned: 0 },
  { id: 'r-7', name: 'Jamie Park', status: 'earned', date: '2026-04-12', xpEarned: 50 },
  { id: 'r-8', name: 'Quinn Torres', status: 'pending', date: '2026-04-10', xpEarned: 0 },
];

const MOCK_LEADERBOARD: ReferralLeader[] = [
  { id: 'lb-1', name: 'Ara Patel', avatar_url: '', referrals: 24, xpEarned: 1200 },
  { id: 'lb-2', name: 'Mia Chen', avatar_url: '', referrals: 19, xpEarned: 950 },
  { id: 'lb-3', name: 'Sam Okonkwo', avatar_url: '', referrals: 16, xpEarned: 800 },
  { id: 'lb-4', name: 'Priya Sharma', avatar_url: '', referrals: 12, xpEarned: 600 },
  { id: 'lb-5', name: 'Lee Kim', avatar_url: '', referrals: 9, xpEarned: 450 },
];

const MOCK_REWARD_MILESTONES: RewardMilestone[] = [
  { id: 'rm-1', referrals: 3, xpBonus: 100, badge: 'Social Butterfly', unlocked: true },
  { id: 'rm-2', referrals: 5, xpBonus: 250, badge: 'Network Builder', unlocked: true },
  { id: 'rm-3', referrals: 10, xpBonus: 500, badge: 'Community Star', unlocked: false },
  { id: 'rm-4', referrals: 25, xpBonus: 1000, badge: 'Mega Connector', unlocked: false },
  { id: 'rm-5', referrals: 50, xpBonus: 2500, badge: 'Campus Legend', unlocked: false },
];

const TOTAL_REFERRALS = 8;
const SUCCESSFUL_REFERRALS = 4;
const EARNED_XP = 200;
const PENDING_REWARDS = 2;

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReferralPage() {
  const { profile: _profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'pending' | 'signed_up' | 'earned'>('all');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard API unavailable */
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join SkillSwap Campus!');
    const body = encodeURIComponent(
      `Hey! I am using SkillSwap Campus to find freelance work and collaborate with talented students. Sign up with my referral link and we both earn XP!\n\n${REFERRAL_LINK}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Join SkillSwap Campus with my referral link and we both earn 50 XP! ${REFERRAL_LINK}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Just joined SkillSwap Campus - a student freelance marketplace! Use my referral link and earn 50 XP: ${REFERRAL_LINK}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const filteredHistory = activeHistoryFilter === 'all'
    ? MOCK_REFERRAL_HISTORY
    : MOCK_REFERRAL_HISTORY.filter((r) => r.status === activeHistoryFilter);

  const statusConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' }> = {
    pending: { label: 'Pending', variant: 'warning' },
    signed_up: { label: 'Signed Up', variant: 'info' },
    earned: { label: 'XP Earned', variant: 'success' },
  };

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-4">
              <Gift className="w-4 h-4" />
              Refer & Earn
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Invite Friends,
              <span className="block text-emerald-200">Earn XP Together</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100/80 max-w-xl mx-auto">
              Share your unique referral link with classmates. Every friend who signs up earns you 50 XP and unlocks exclusive rewards.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Referral Code + Share */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Code section */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Link className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Your Referral Link
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-300 select-all truncate">
                  {REFERRAL_LINK}
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    copied
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Your code: <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{REFERRAL_CODE}</span></p>
            </div>

            {/* Share buttons */}
            <div className="lg:w-auto">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Share via</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
                <button
                  onClick={handleShareEmail}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleShareTwitter}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Total Referrals"
            value={TOTAL_REFERRALS}
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 14, positive: true }}
            color="emerald"
          />
          <StatsCard
            label="Successful"
            value={SUCCESSFUL_REFERRALS}
            icon={<CheckCircle className="w-5 h-5" />}
            trend={{ value: 25, positive: true }}
            color="emerald"
          />
          <StatsCard
            label="Earned XP"
            value={EARNED_XP}
            icon={<Zap className="w-5 h-5" />}
            trend={{ value: 50, positive: true }}
            color="emerald"
          />
          <StatsCard
            label="Pending Rewards"
            value={PENDING_REWARDS}
            icon={<Gift className="w-5 h-5" />}
            color="emerald"
          />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* How it works */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              How It Works
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: 'Share Your Link',
                  description: 'Send your unique referral link to friends, classmates, or post it on social media.',
                  icon: <Share2 className="w-5 h-5" />,
                },
                {
                  step: 2,
                  title: 'Friend Signs Up',
                  description: 'When someone joins SkillSwap using your link, they become a verified referral.',
                  icon: <Users className="w-5 h-5" />,
                },
                {
                  step: 3,
                  title: 'You Earn 50 XP',
                  description: 'Once your friend completes their profile, you both earn 50 XP. Level up faster!',
                  icon: <Award className="w-5 h-5" />,
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    {item.step < 3 && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-2" />}
                  </div>
                  <div className="pb-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards section */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Reward Milestones
            </h2>
            <div className="space-y-4">
              {MOCK_REWARD_MILESTONES.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    milestone.unlocked
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    milestone.unlocked
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                    {milestone.unlocked ? <CheckCircle className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{milestone.badge}</h3>
                      {milestone.unlocked && <Badge label="Unlocked" variant="success" size="sm" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {milestone.referrals} referrals &middot; +{milestone.xpBonus} XP bonus
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-lg font-bold ${milestone.unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      +{milestone.xpBonus}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500">XP</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Progress</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{TOTAL_REFERRALS} / 10 referrals</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min((TOTAL_REFERRALS / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {10 - TOTAL_REFERRALS} more referrals to unlock <span className="font-semibold text-emerald-600 dark:text-emerald-400">Community Star</span> badge
              </p>
            </div>
          </div>
        </div>

        {/* Referral History + Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral History */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Referral History
                </h2>
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                  {(['all', 'pending', 'signed_up', 'earned'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveHistoryFilter(filter)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        activeHistoryFilter === filter
                          ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter === 'signed_up' ? 'Signed Up' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredHistory.map((entry) => {
                    const cfg = statusConfig[entry.status];
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                              {getInitials(entry.name)}
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge label={cfg.label} variant={cfg.variant} size="sm" />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(entry.date)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-semibold ${entry.xpEarned > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {entry.xpEarned > 0 ? `+${entry.xpEarned}` : '--'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No referrals match this filter</p>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Top Referrers
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">This Month</span>
            </h2>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    index === 0
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                      : index === 1
                      ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white'
                      : index === 2
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  {/* Avatar + name */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getInitials(leader.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{leader.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{leader.referrals} referrals</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{leader.xpEarned}</span>
                    <p className="text-xs text-slate-400 dark:text-slate-500">XP</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
              View Full Leaderboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
