import {
  Star,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type {
  Profile,
  FreelancerProfile,
  ClientProfile,
  Gig,
  Task,
  Review,
  UserBadge,
} from '../../types';
import BadgeCmp from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

interface ProfilePageProps {
  userId: string;
  onNavigate: (page: string) => void;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_FREELANCER_PROFILE: Profile = {
  id: 'u-101',
  email: 'arjun.dev@campus.edu',
  full_name: 'Arjun Patel',
  avatar_url: '',
  role: 'freelancer',
  phone: '',
  college: 'IIT Delhi',
  college_id_verified: true,
  is_verified: true,
  is_online: true,
  last_seen: '2026-04-27T10:00:00Z',
  created_at: '2025-08-15T00:00:00Z',
  updated_at: '2026-04-27T00:00:00Z',
};

const MOCK_FREELANCER_DETAIL: FreelancerProfile = {
  id: 'fp-101',
  user_id: 'u-101',
  headline: 'Full-Stack Developer & UI Designer',
  bio: 'Passionate full-stack developer with 3 years of experience building modern web applications. I specialize in React, Node.js, and cloud architecture. Currently pursuing B.Tech in Computer Science at IIT Delhi. I love turning complex problems into elegant, user-friendly solutions. Whether you need a stunning landing page, a robust API, or a complete SaaS product, I deliver clean code on time.',
  portfolio_url: 'https://arjunpatel.dev',
  education: 'B.Tech Computer Science, IIT Delhi (2024-2028)',
  experience_years: 3,
  hourly_rate: 25,
  completion_rate: 96,
  response_rate: 94,
  on_time_delivery: 98,
  total_earnings: 12450,
  total_orders: 48,
  completed_orders: 46,
  xp: 4820,
  level: 12,
  profile_completion: 92,
  created_at: '2025-08-15T00:00:00Z',
  updated_at: '2026-04-27T00:00:00Z',
  skills: [
    { id: 's1', name: 'React', created_at: '' },
    { id: 's2', name: 'TypeScript', created_at: '' },
    { id: 's3', name: 'Node.js', created_at: '' },
    { id: 's4', name: 'Next.js', created_at: '' },
    { id: 's5', name: 'Tailwind CSS', created_at: '' },
    { id: 's6', name: 'PostgreSQL', created_at: '' },
    { id: 's7', name: 'Figma', created_at: '' },
    { id: 's8', name: 'AWS', created_at: '' },
    { id: 's9', name: 'Python', created_at: '' },
    { id: 's10', name: 'GraphQL', created_at: '' },
  ],
};

const MOCK_FREELANCER_GIGS: Gig[] = [
  {
    id: 'gig-1',
    freelancer_id: 'u-101',
    category_id: 'cat-1',
    title: 'Build a Modern React Landing Page',
    description: 'Pixel-perfect, responsive landing page with animations and SEO optimization.',
    price: 150,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 18,
    views: 342,
    is_featured: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
  },
  {
    id: 'gig-2',
    freelancer_id: 'u-101',
    category_id: 'cat-2',
    title: 'Full-Stack Web App Development',
    description: 'End-to-end web application with React frontend, Node.js backend, and database design.',
    price: 500,
    delivery_days: 14,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 5.0,
    review_count: 12,
    views: 528,
    is_featured: true,
    created_at: '2025-12-05T00:00:00Z',
    updated_at: '2026-04-18T00:00:00Z',
  },
  {
    id: 'gig-3',
    freelancer_id: 'u-101',
    category_id: 'cat-3',
    title: 'UI/UX Design with Figma',
    description: 'Professional UI/UX design with interactive prototypes and design systems.',
    price: 200,
    delivery_days: 5,
    revisions: 4,
    image_url: '',
    status: 'active',
    rating: 4.8,
    review_count: 9,
    views: 215,
    is_featured: false,
    created_at: '2026-02-20T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
  },
  {
    id: 'gig-4',
    freelancer_id: 'u-101',
    category_id: 'cat-4',
    title: 'API Development & Integration',
    description: 'RESTful or GraphQL API design, development, and third-party integrations.',
    price: 300,
    delivery_days: 7,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.7,
    review_count: 7,
    views: 189,
    is_featured: false,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
  },
];

const MOCK_FREELANCER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    order_id: 'ord-1',
    reviewer_id: 'c-1',
    reviewee_id: 'u-101',
    rating: 5,
    comment: 'Absolutely incredible work! Arjun delivered beyond expectations. The landing page was pixel-perfect, fully responsive, and he even added smooth animations that made it stand out. Communication was excellent throughout.',
    created_at: '2026-04-15T10:00:00Z',
    reviewer: {
      id: 'c-1',
      email: 'priya@startup.io',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-26T18:00:00Z',
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2026-04-26T00:00:00Z',
    },
  },
  {
    id: 'rev-2',
    order_id: 'ord-2',
    reviewer_id: 'c-2',
    reviewee_id: 'u-101',
    rating: 5,
    comment: 'Arjun built our entire dashboard from scratch. Real-time data, charts, filters — everything works flawlessly. He understood our requirements quickly and suggested improvements we hadn\'t even thought of. Highly recommended!',
    created_at: '2026-04-10T08:00:00Z',
    reviewer: {
      id: 'c-2',
      email: 'rahul@tech.co',
      full_name: 'Rahul Mehta',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'BITS Pilani',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '2026-04-27T09:00:00Z',
      created_at: '2025-09-15T00:00:00Z',
      updated_at: '2026-04-27T00:00:00Z',
    },
  },
  {
    id: 'rev-3',
    order_id: 'ord-3',
    reviewer_id: 'c-3',
    reviewee_id: 'u-101',
    rating: 4,
    comment: 'Great work on the UI kit. Clean design and well-organized components. The only minor thing was a slight delay in the first revision, but the final result was top-notch. Would hire again.',
    created_at: '2026-03-28T14:00:00Z',
    reviewer: {
      id: 'c-3',
      email: 'sneha@design.studio',
      full_name: 'Sneha Gupta',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'NID Ahmedabad',
      college_id_verified: true,
      is_verified: false,
      is_online: false,
      last_seen: '2026-04-25T12:00:00Z',
      created_at: '2025-11-01T00:00:00Z',
      updated_at: '2026-04-25T00:00:00Z',
    },
  },
  {
    id: 'rev-4',
    order_id: 'ord-4',
    reviewer_id: 'c-4',
    reviewee_id: 'u-101',
    rating: 5,
    comment: 'Saved us weeks of development time. Arjun set up our entire CI/CD pipeline and migrated our database to PostgreSQL. Extremely knowledgeable and professional. A true campus superstar.',
    created_at: '2026-03-15T16:00:00Z',
    reviewer: {
      id: 'c-4',
      email: 'vikram@saas.io',
      full_name: 'Vikram Singh',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Kanpur',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-20T20:00:00Z',
      created_at: '2025-07-10T00:00:00Z',
      updated_at: '2026-04-20T00:00:00Z',
    },
  },
];

const MOCK_FREELANCER_BADGES: UserBadge[] = [
  {
    id: 'ub-1',
    user_id: 'u-101',
    badge_id: 'b-1',
    earned_at: '2025-10-01T00:00:00Z',
    badge: { id: 'b-1', name: 'Rising Star', description: 'Completed first 10 orders', icon: 'Star', xp_required: 500 },
  },
  {
    id: 'ub-2',
    user_id: 'u-101',
    badge_id: 'b-2',
    earned_at: '2025-12-15T00:00:00Z',
    badge: { id: 'b-2', name: 'Speed Demon', description: '95%+ on-time delivery', icon: 'Zap', xp_required: 1000 },
  },
  {
    id: 'ub-3',
    user_id: 'u-101',
    badge_id: 'b-3',
    earned_at: '2026-02-01T00:00:00Z',
    badge: { id: 'b-3', name: 'Top Rated', description: 'Maintained 4.8+ rating over 20+ orders', icon: 'Award', xp_required: 2000 },
  },
  {
    id: 'ub-4',
    user_id: 'u-101',
    badge_id: 'b-4',
    earned_at: '2026-03-20T00:00:00Z',
    badge: { id: 'b-4', name: 'Verified Pro', description: 'College ID verified + 30+ orders', icon: 'Shield', xp_required: 3000 },
  },
  {
    id: 'ub-5',
    user_id: 'u-101',
    badge_id: 'b-5',
    earned_at: '2026-04-10T00:00:00Z',
    badge: { id: 'b-5', name: 'Milestone Maker', description: 'Earned $10,000+ on platform', icon: 'TrendingUp', xp_required: 4000 },
  },
];

// ─── Client Mock Data ────────────────────────────────────────────────────────

const MOCK_CLIENT_PROFILE: Profile = {
  id: 'u-201',
  email: 'priya@startup.io',
  full_name: 'Priya Sharma',
  avatar_url: '',
  role: 'client',
  phone: '',
  college: 'IIT Bombay',
  college_id_verified: true,
  is_verified: true,
  is_online: false,
  last_seen: '2026-04-26T18:00:00Z',
  created_at: '2025-06-01T00:00:00Z',
  updated_at: '2026-04-26T00:00:00Z',
};

const MOCK_CLIENT_DETAIL: ClientProfile = {
  id: 'cp-201',
  user_id: 'u-201',
  company_name: 'CampusLaunch Studios',
  industry: 'EdTech & SaaS',
  website: 'https://campuslaunch.io',
  description: 'CampusLaunch Studios is a student-led product studio building tools for the next generation of campus entrepreneurs. We design, build, and ship products that solve real problems for college communities across India. Our team of 5 combines design thinking with rapid development to bring ideas to market fast.',
  total_spent: 8920,
  total_orders: 22,
  created_at: '2025-06-01T00:00:00Z',
  updated_at: '2026-04-26T00:00:00Z',
};

const MOCK_CLIENT_TASKS: Task[] = [
  {
    id: 't-1',
    client_id: 'u-201',
    category_id: 'cat-1',
    title: 'React Native Mobile App for Campus Events',
    description: 'Build a cross-platform mobile app for discovering and managing campus events with real-time notifications.',
    budget_min: 800,
    budget_max: 1200,
    deadline: '2026-05-30T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: true,
    is_instant_hire: false,
    views: 156,
    applications_count: 8,
    created_at: '2026-04-20T00:00:00Z',
    updated_at: '2026-04-27T00:00:00Z',
  },
  {
    id: 't-2',
    client_id: 'u-201',
    category_id: 'cat-2',
    title: 'SaaS Dashboard Analytics Module',
    description: 'Add an analytics module to our existing dashboard with real-time charts, CSV export, and custom date ranges.',
    budget_min: 400,
    budget_max: 600,
    deadline: '2026-05-15T00:00:00Z',
    status: 'open',
    is_micro: false,
    is_urgent: false,
    is_instant_hire: true,
    views: 98,
    applications_count: 5,
    created_at: '2026-04-18T00:00:00Z',
    updated_at: '2026-04-25T00:00:00Z',
  },
  {
    id: 't-3',
    client_id: 'u-201',
    category_id: 'cat-3',
    title: 'Logo Design for New Product Line',
    description: 'Minimalist logo design for our new product line targeting Gen-Z college students.',
    budget_min: 50,
    budget_max: 100,
    deadline: '2026-05-05T00:00:00Z',
    status: 'open',
    is_micro: true,
    is_urgent: false,
    is_instant_hire: false,
    views: 72,
    applications_count: 12,
    created_at: '2026-04-22T00:00:00Z',
    updated_at: '2026-04-26T00:00:00Z',
  },
];

const MOCK_CLIENT_REVIEWS: Review[] = [
  {
    id: 'cr-1',
    order_id: 'ord-5',
    reviewer_id: 'u-201',
    reviewee_id: 'u-102',
    rating: 5,
    comment: 'Outstanding work on our mobile app. The freelancer went above and beyond to deliver a polished product with smooth animations and intuitive UX.',
    created_at: '2026-04-12T10:00:00Z',
    reviewer: {
      id: 'u-201',
      email: 'priya@startup.io',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-26T18:00:00Z',
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2026-04-26T00:00:00Z',
    },
  },
  {
    id: 'cr-2',
    order_id: 'ord-6',
    reviewer_id: 'u-201',
    reviewee_id: 'u-103',
    rating: 4,
    comment: 'Good work overall. The design was clean and professional. Just a minor communication hiccup at the start, but the final deliverable exceeded quality expectations.',
    created_at: '2026-03-28T14:00:00Z',
    reviewer: {
      id: 'u-201',
      email: 'priya@startup.io',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-26T18:00:00Z',
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2026-04-26T00:00:00Z',
    },
  },
  {
    id: 'cr-3',
    order_id: 'ord-7',
    reviewer_id: 'u-201',
    reviewee_id: 'u-104',
    rating: 5,
    comment: 'Brilliant execution. The API integration was seamless and well-documented. Will definitely work with again.',
    created_at: '2026-02-15T08:00:00Z',
    reviewer: {
      id: 'u-201',
      email: 'priya@startup.io',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'client',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-26T18:00:00Z',
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2026-04-26T00:00:00Z',
    },
  },
];

// ─── Helper Components ───────────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeMap[size]} ${
            star <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : star - 0.5 <= rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

function AvatarWithStatus({ name, isOnline, size = 'lg' }: { name: string; isOnline: boolean; size?: 'md' | 'lg' | 'xl' }) {
  const sizeMap = {
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl',
  };
  const dotSizeMap = { md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5' };
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative inline-flex">
      <div
        className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white shadow-lg ring-4 ring-slate-800`}
      >
        {initials}
      </div>
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeMap[size]} bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse`}
        />
      )}
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3">
      <Icon className={`w-5 h-5 ${accent ? 'text-emerald-400' : 'text-slate-400'}`} />
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Freelancer Profile View ─────────────────────────────────────────────────

function FreelancerProfileView({
  profile,
  detail,
  gigs,
  reviews,
  badges,
  onNavigate,
}: {
  profile: Profile;
  detail: FreelancerProfile;
  gigs: Gig[];
  reviews: Review[];
  badges: UserBadge[];
  onNavigate: (page: string) => void;
}) {
  const { profile: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === profile.id;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const badgeIconMap: Record<string, React.ElementType> = {
    Star,
    Zap,
    Award,
    Shield,
    TrendingUp,
  };

  return (
    <div className="space-y-6">
      {/* ── Profile Header ── */}
      <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-emerald-800/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.15),transparent_70%)]" />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors border border-slate-600/30">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-rose-400 transition-colors border border-slate-600/30">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <AvatarWithStatus name={profile.full_name} isOnline={profile.is_online} size="xl" />
            <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{profile.full_name}</h1>
                {profile.is_verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {profile.is_online && (
                  <BadgeCmp label="Online" variant="success" size="sm" />
                )}
              </div>
              <p className="text-emerald-400 font-medium mt-1 truncate">{detail.headline}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.college}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> ${detail.hourly_rate}/hr
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {detail.experience_years}y exp
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Level {detail.level}
                </span>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="flex items-center gap-2 sm:pb-1 flex-shrink-0">
                <button
                  onClick={() => onNavigate('messaging')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors border border-slate-600/50"
                >
                  <MessageSquare className="w-4 h-4" /> Contact Me
                </button>
                <button
                  onClick={() => onNavigate('messaging')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Briefcase className="w-4 h-4" /> Hire Me
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl divide-x divide-slate-700/50">
        <StatBlock icon={Star} label="Rating" value={avgRating.toFixed(1)} accent />
        <StatBlock icon={CheckCircle} label="Completed Orders" value={String(detail.completed_orders)} />
        <StatBlock icon={MessageSquare} label="Response Rate" value={`${detail.response_rate}%`} />
        <StatBlock icon={Clock} label="On-Time Delivery" value={`${detail.on_time_delivery}%`} />
      </div>

      {/* ── Profile Completion ── */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Profile Completion</h3>
          <span className="text-sm font-bold text-emerald-400">{detail.profile_completion}%</span>
        </div>
        <ProgressBar value={detail.profile_completion} size="md" color="emerald" showLabel={false} />
      </div>

      {/* ── About Section ── */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" /> About
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-5">{detail.bio}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Education</p>
              <p className="text-sm text-slate-200 mt-0.5">{detail.education}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Experience</p>
              <p className="text-sm text-slate-200 mt-0.5">{detail.experience_years} years of professional experience</p>
            </div>
          </div>
          {detail.portfolio_url && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Portfolio</p>
                <a
                  href={detail.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 mt-0.5 inline-flex items-center gap-1 transition-colors"
                >
                  {detail.portfolio_url.replace('https://', '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Member Since</p>
              <p className="text-sm text-slate-200 mt-0.5">
                {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Skills ── */}
      {detail.skills && detail.skills.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {detail.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-default"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Gigs ── */}
      {gigs.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Active Gigs
            <span className="ml-auto text-sm font-normal text-slate-400">{gigs.length} services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="group relative bg-slate-800/80 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                {gig.is_featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    Featured
                  </span>
                )}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {gig.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{gig.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      {gig.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {gig.delivery_days}d
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-slate-300">{gig.rating}</span>
                    <span className="text-xs text-slate-500">({gig.review_count})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews ── */}
      {reviews.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" /> Reviews
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            {avgRating.toFixed(1)} average from {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {review.reviewer?.full_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.reviewer?.full_name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Badges ── */}
      {badges.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" /> Badges Earned
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {badges.map((ub) => {
              const IconComp = badgeIconMap[ub.badge?.icon ?? ''] ?? Award;
              return (
                <div
                  key={ub.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 hover:border-emerald-500/30 transition-colors text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-colors">
                    <IconComp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{ub.badge?.name}</p>
                  <p className="text-[10px] text-slate-500 leading-tight">{ub.badge?.description}</p>
                  <p className="text-[10px] text-emerald-500/60">
                    {new Date(ub.earned_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Client Profile View ─────────────────────────────────────────────────────

function ClientProfileView({
  profile,
  detail,
  tasks,
  reviews,
  onNavigate,
}: {
  profile: Profile;
  detail: ClientProfile;
  tasks: Task[];
  reviews: Review[];
  onNavigate: (page: string) => void;
}) {
  const { profile: currentUser } = useAuth();
  const isOwnProfile = currentUser?.id === profile.id;
  const avgRatingGiven = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const activeTasks = tasks.filter((t) => t.status === 'open');

  return (
    <div className="space-y-6">
      {/* ── Profile Header ── */}
      <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-teal-600/30 via-emerald-600/20 to-teal-800/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.15),transparent_70%)]" />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors border border-slate-600/30">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <AvatarWithStatus name={profile.full_name} isOnline={profile.is_online} size="xl" />
            <div className="flex-1 min-w-0 pt-2 sm:pt-0 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{profile.full_name}</h1>
                {profile.is_verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-emerald-400 font-medium mt-1 truncate">{detail.company_name}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {detail.industry}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {profile.college}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Client since{' '}
                  {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="flex items-center gap-2 sm:pb-1 flex-shrink-0">
                <button
                  onClick={() => onNavigate('messaging')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors border border-slate-600/50"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl divide-x divide-slate-700/50">
        <StatBlock icon={DollarSign} label="Total Spent" value={`$${detail.total_spent.toLocaleString()}`} accent />
        <StatBlock icon={Briefcase} label="Tasks Posted" value={String(detail.total_orders)} />
        <StatBlock icon={Zap} label="Active Tasks" value={String(activeTasks.length)} />
        <StatBlock icon={Star} label="Avg Rating Given" value={avgRatingGiven.toFixed(1)} />
      </div>

      {/* ── About Section ── */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-400" /> About
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-5">{detail.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {detail.website && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Website</p>
                <a
                  href={detail.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 mt-0.5 inline-flex items-center gap-1 transition-colors"
                >
                  {detail.website.replace('https://', '')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">College</p>
              <p className="text-sm text-slate-200 mt-0.5">{profile.college}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Verification</p>
              <p className="text-sm text-slate-200 mt-0.5">
                {profile.college_id_verified ? 'College ID Verified' : 'Not Verified'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Member Since</p>
              <p className="text-sm text-slate-200 mt-0.5">
                {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Tasks ── */}
      {activeTasks.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Active Tasks
            <span className="ml-auto text-sm font-normal text-slate-400">{activeTasks.length} open</span>
          </h2>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-slate-800/60 border border-slate-700/40 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.is_urgent && (
                      <BadgeCmp label="Urgent" variant="danger" size="sm" />
                    )}
                    {task.is_micro && (
                      <BadgeCmp label="Micro" variant="info" size="sm" />
                    )}
                    {task.is_instant_hire && (
                      <BadgeCmp label="Instant Hire" variant="success" size="sm" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${task.budget_min} - ${task.budget_max}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {task.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {task.applications_count} applications
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Reviews Given ── */}
      {reviews.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" /> Reviews Given
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            {avgRatingGiven.toFixed(1)} average rating given across {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {review.reviewee_id === 'u-102'
                        ? 'NK'
                        : review.reviewee_id === 'u-103'
                        ? 'AS'
                        : 'RV'}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        Review for{' '}
                        <span className="text-slate-300 font-medium">
                          {review.reviewee_id === 'u-102'
                            ? 'Nikhil Kumar'
                            : review.reviewee_id === 'u-103'
                            ? 'Ananya Singh'
                            : 'Rohan Verma'}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Profile Page ───────────────────────────────────────────────────────

export default function ProfilePage({ userId, onNavigate }: ProfilePageProps) {
  // Determine which profile to show based on userId
  // In a real app, this would fetch from Supabase
  const isFreelancer = userId === 'u-101' || userId !== 'u-201';

  if (isFreelancer) {
    return (
      <FreelancerProfileView
        profile={MOCK_FREELANCER_PROFILE}
        detail={MOCK_FREELANCER_DETAIL}
        gigs={MOCK_FREELANCER_GIGS}
        reviews={MOCK_FREELANCER_REVIEWS}
        badges={MOCK_FREELANCER_BADGES}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <ClientProfileView
      profile={MOCK_CLIENT_PROFILE}
      detail={MOCK_CLIENT_DETAIL}
      tasks={MOCK_CLIENT_TASKS}
      reviews={MOCK_CLIENT_REVIEWS}
      onNavigate={onNavigate}
    />
  );
}
