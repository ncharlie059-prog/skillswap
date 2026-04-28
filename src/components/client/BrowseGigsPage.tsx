import { useState, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Eye,
  Briefcase,
  ChevronDown,
  X,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Gig, Category, Skill } from '../../types';
import Badge from '../common/Badge';

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
];

const MOCK_GIGS: Gig[] = [
  {
    id: 'gig-1',
    freelancer_id: 'f-1',
    category_id: 'cat-1',
    title: 'Build a Responsive React Landing Page',
    description:
      'Modern, pixel-perfect landing page built with React and Tailwind CSS. Fully responsive, optimized for performance, with smooth scroll animations and SEO best practices.',
    price: 499,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 127,
    views: 1840,
    is_featured: true,
    created_at: '2026-03-15T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[9]],
    freelancer: {
      id: 'f-1',
      email: 'aisha@campus.edu',
      full_name: 'Aisha Patel',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'IIT Bombay',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-1',
        user_id: 'f-1',
        headline: 'Full-Stack Developer & UI Engineer',
        bio: '',
        portfolio_url: '',
        education: 'B.Tech CS',
        experience_years: 3,
        hourly_rate: 499,
        completion_rate: 98,
        response_rate: 95,
        on_time_delivery: 97,
        total_earnings: 85000,
        total_orders: 45,
        completed_orders: 43,
        xp: 2400,
        level: 8,
        profile_completion: 90,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-2',
    freelancer_id: 'f-2',
    category_id: 'cat-2',
    title: 'Design a Professional Logo & Brand Kit',
    description:
      'Complete brand identity package including logo, color palette, typography guide, and social media templates. Unlimited concepts until you are satisfied.',
    price: 799,
    delivery_days: 5,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 4.8,
    review_count: 89,
    views: 1230,
    is_featured: true,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-04-18T00:00:00Z',
    category: MOCK_CATEGORIES[1],
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[3]],
    freelancer: {
      id: 'f-2',
      email: 'marcus@campus.edu',
      full_name: 'Marcus Chen',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'NID Ahmedabad',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-2',
        user_id: 'f-2',
        headline: 'Brand Designer & Illustrator',
        bio: '',
        portfolio_url: '',
        education: 'B.Des',
        experience_years: 4,
        hourly_rate: 799,
        completion_rate: 100,
        response_rate: 92,
        on_time_delivery: 96,
        total_earnings: 120000,
        total_orders: 60,
        completed_orders: 60,
        xp: 3100,
        level: 10,
        profile_completion: 95,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-3',
    freelancer_id: 'f-3',
    category_id: 'cat-3',
    title: 'Edit a Cinematic YouTube Video',
    description:
      'Professional video editing with color grading, transitions, sound design, and motion graphics. Perfect for YouTube creators and campus startups.',
    price: 349,
    delivery_days: 2,
    revisions: 2,
    image_url: '',
    status: 'active',
    rating: 4.7,
    review_count: 56,
    views: 780,
    is_featured: false,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
    category: MOCK_CATEGORIES[2],
    skills: [MOCK_SKILLS[4]],
    freelancer: {
      id: 'f-3',
      email: 'sofia@campus.edu',
      full_name: 'Sofia Rodriguez',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'FTII Pune',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-3',
        user_id: 'f-3',
        headline: 'Video Editor & Motion Designer',
        bio: '',
        portfolio_url: '',
        education: 'BFA Film',
        experience_years: 2,
        hourly_rate: 349,
        completion_rate: 95,
        response_rate: 88,
        on_time_delivery: 90,
        total_earnings: 45000,
        total_orders: 30,
        completed_orders: 28,
        xp: 1500,
        level: 5,
        profile_completion: 80,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-4',
    freelancer_id: 'f-4',
    category_id: 'cat-4',
    title: 'Write SEO-Optimized Blog Articles',
    description:
      'High-quality, researched blog posts that rank on Google. Includes keyword research, meta descriptions, internal linking, and engaging copywriting.',
    price: 249,
    delivery_days: 3,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 5.0,
    review_count: 34,
    views: 560,
    is_featured: false,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
    category: MOCK_CATEGORIES[3],
    skills: [MOCK_SKILLS[7]],
    freelancer: {
      id: 'f-4',
      email: 'priya@campus.edu',
      full_name: 'Priya Sharma',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'Jamia Millia',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-4',
        user_id: 'f-4',
        headline: 'Content Strategist & Copywriter',
        bio: '',
        portfolio_url: '',
        education: 'MA English',
        experience_years: 3,
        hourly_rate: 249,
        completion_rate: 100,
        response_rate: 97,
        on_time_delivery: 100,
        total_earnings: 62000,
        total_orders: 38,
        completed_orders: 38,
        xp: 1900,
        level: 7,
        profile_completion: 88,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-5',
    freelancer_id: 'f-5',
    category_id: 'cat-5',
    title: 'Develop a Cross-Platform Flutter App',
    description:
      'End-to-end mobile app development with Flutter. Includes UI design, API integration, state management, and deployment to both Play Store and App Store.',
    price: 1999,
    delivery_days: 14,
    revisions: 5,
    image_url: '',
    status: 'active',
    rating: 4.6,
    review_count: 18,
    views: 920,
    is_featured: false,
    created_at: '2026-02-28T00:00:00Z',
    updated_at: '2026-04-22T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    skills: [MOCK_SKILLS[6]],
    freelancer: {
      id: 'f-5',
      email: 'rohan@campus.edu',
      full_name: 'Rohan Gupta',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'BITS Pilani',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-5',
        user_id: 'f-5',
        headline: 'Mobile App Developer',
        bio: '',
        portfolio_url: '',
        education: 'B.E. CS',
        experience_years: 2,
        hourly_rate: 699,
        completion_rate: 92,
        response_rate: 85,
        on_time_delivery: 88,
        total_earnings: 95000,
        total_orders: 15,
        completed_orders: 14,
        xp: 1200,
        level: 4,
        profile_completion: 75,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-6',
    freelancer_id: 'f-6',
    category_id: 'cat-6',
    title: 'Build Interactive Data Dashboards',
    description:
      'Custom dashboards with real-time data visualization using Python, Plotly, and Streamlit. Turn your raw data into actionable insights with beautiful charts.',
    price: 899,
    delivery_days: 7,
    revisions: 4,
    image_url: '',
    status: 'active',
    rating: 4.9,
    review_count: 42,
    views: 670,
    is_featured: true,
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-04-19T00:00:00Z',
    category: MOCK_CATEGORIES[5],
    skills: [MOCK_SKILLS[2]],
    freelancer: {
      id: 'f-6',
      email: 'neha@campus.edu',
      full_name: 'Neha Verma',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'IIT Delhi',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-6',
        user_id: 'f-6',
        headline: 'Data Scientist & Analyst',
        bio: '',
        portfolio_url: '',
        education: 'M.Tech AI',
        experience_years: 3,
        hourly_rate: 899,
        completion_rate: 100,
        response_rate: 94,
        on_time_delivery: 98,
        total_earnings: 150000,
        total_orders: 28,
        completed_orders: 28,
        xp: 2800,
        level: 9,
        profile_completion: 92,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-7',
    freelancer_id: 'f-7',
    category_id: 'cat-7',
    title: 'Run a Social Media Marketing Campaign',
    description:
      'Complete social media strategy including content calendar, post design, hashtag research, engagement tactics, and monthly analytics report.',
    price: 599,
    delivery_days: 5,
    revisions: 3,
    image_url: '',
    status: 'active',
    rating: 4.5,
    review_count: 22,
    views: 410,
    is_featured: false,
    created_at: '2026-03-10T00:00:00Z',
    updated_at: '2026-04-23T00:00:00Z',
    category: MOCK_CATEGORIES[6],
    skills: [MOCK_SKILLS[7], MOCK_SKILLS[8]],
    freelancer: {
      id: 'f-7',
      email: 'arjun@campus.edu',
      full_name: 'Arjun Mehta',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'XLRI',
      college_id_verified: true,
      is_verified: false,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-7',
        user_id: 'f-7',
        headline: 'Digital Marketing Specialist',
        bio: '',
        portfolio_url: '',
        education: 'MBA Marketing',
        experience_years: 2,
        hourly_rate: 599,
        completion_rate: 90,
        response_rate: 82,
        on_time_delivery: 85,
        total_earnings: 52000,
        total_orders: 20,
        completed_orders: 18,
        xp: 900,
        level: 3,
        profile_completion: 70,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-8',
    freelancer_id: 'f-8',
    category_id: 'cat-8',
    title: 'Produce a Custom Background Music Track',
    description:
      'Original, royalty-free background music for videos, podcasts, or presentations. Delivered in multiple formats with full commercial rights.',
    price: 299,
    delivery_days: 3,
    revisions: 2,
    image_url: '',
    status: 'active',
    rating: 4.8,
    review_count: 15,
    views: 280,
    is_featured: false,
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-24T00:00:00Z',
    category: MOCK_CATEGORIES[7],
    skills: [],
    freelancer: {
      id: 'f-8',
      email: 'kavya@campus.edu',
      full_name: 'Kavya Nair',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'KM College',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-8',
        user_id: 'f-8',
        headline: 'Music Producer & Audio Engineer',
        bio: '',
        portfolio_url: '',
        education: 'B.Music',
        experience_years: 4,
        hourly_rate: 299,
        completion_rate: 97,
        response_rate: 90,
        on_time_delivery: 94,
        total_earnings: 38000,
        total_orders: 12,
        completed_orders: 11,
        xp: 700,
        level: 2,
        profile_completion: 65,
        created_at: '',
        updated_at: '',
      },
    },
  },
  {
    id: 'gig-9',
    freelancer_id: 'f-9',
    category_id: 'cat-1',
    title: 'Design & Develop a WordPress Website',
    description:
      'Complete WordPress website with custom theme, plugins, SEO setup, and responsive design. Includes e-commerce integration if needed.',
    price: 1299,
    delivery_days: 7,
    revisions: 4,
    image_url: '',
    status: 'active',
    rating: 4.7,
    review_count: 64,
    views: 980,
    is_featured: false,
    created_at: '2026-02-15T00:00:00Z',
    updated_at: '2026-04-21T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    skills: [MOCK_SKILLS[5]],
    freelancer: {
      id: 'f-9',
      email: 'dev@campus.edu',
      full_name: 'Dev Kapoor',
      avatar_url: '',
      role: 'freelancer',
      phone: '',
      college: 'VIT Vellore',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '',
      created_at: '',
      updated_at: '',
      freelancer_profile: {
        id: 'fp-9',
        user_id: 'f-9',
        headline: 'WordPress & Full-Stack Developer',
        bio: '',
        portfolio_url: '',
        education: 'B.Tech IT',
        experience_years: 3,
        hourly_rate: 599,
        completion_rate: 96,
        response_rate: 91,
        on_time_delivery: 93,
        total_earnings: 110000,
        total_orders: 35,
        completed_orders: 33,
        xp: 2100,
        level: 7,
        profile_completion: 85,
        created_at: '',
        updated_at: '',
      },
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SortMode = 'featured' | 'rating' | 'price_low' | 'price_high' | 'delivery_fast' | 'reviews';
type PriceRange = 'all' | '0-500' | '500-1000' | '1000-2000' | '2000+';
type DeliveryFilter = 'all' | '1-3' | '4-7' | '8+';

interface FilterState {
  category: string;
  priceRange: PriceRange;
  rating: number;
  delivery: DeliveryFilter;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
    } else if (i === full && hasHalf) {
      stars.push(
        <span key={i} className="relative">
          <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />);
    }
  }
  return stars;
}

function priceInRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case '0-500':
      return price <= 500;
    case '500-1000':
      return price > 500 && price <= 1000;
    case '1000-2000':
      return price > 1000 && price <= 2000;
    case '2000+':
      return price > 2000;
    default:
      return true;
  }
}

function deliveryInRange(days: number, filter: DeliveryFilter): boolean {
  switch (filter) {
    case '1-3':
      return days <= 3;
    case '4-7':
      return days >= 4 && days <= 7;
    case '8+':
      return days >= 8;
    default:
      return true;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BrowseGigsPage() {
  const { profile: _profile } = useAuth();

  /* --- State --- */
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    rating: 0,
    delivery: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const [visibleCount, setVisibleCount] = useState(9);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  /* --- Derived data --- */
  const filteredGigs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = MOCK_GIGS.filter((g) => {
      if (g.status !== 'active') return false;
      if (q && !g.title.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) return false;
      if (filters.category !== 'all' && g.category_id !== filters.category) return false;
      if (!priceInRange(g.price, filters.priceRange)) return false;
      if (filters.rating > 0 && g.rating < filters.rating) return false;
      if (!deliveryInRange(g.delivery_days, filters.delivery)) return false;
      return true;
    });

    switch (sortMode) {
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || b.rating - a.rating);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'delivery_fast':
        result.sort((a, b) => a.delivery_days - b.delivery_days);
        break;
      case 'reviews':
        result.sort((a, b) => b.review_count - a.review_count);
        break;
    }

    return result;
  }, [searchQuery, filters, sortMode]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.rating > 0) count++;
    if (filters.delivery !== 'all') count++;
    return count;
  }, [filters]);

  const displayedGigs = filteredGigs.slice(0, visibleCount);
  const hasMore = filteredGigs.length > visibleCount;

  /* --- Handlers --- */
  const clearFilters = () => {
    setFilters({ category: 'all', priceRange: 'all', rating: 0, delivery: 'all' });
    setSearchQuery('');
  };

  const toggleFavorite = useCallback((gigId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(gigId)) next.delete(gigId);
      else next.add(gigId);
      return next;
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse Gigs</h1>
            <p className="mt-1 text-emerald-100 text-sm sm:text-base max-w-xl">
              Discover talented freelancers on campus. Filter by category, price, rating, and delivery time to find the perfect service.
            </p>
          </div>
        </div>

        {/* ===== Search + Filter Bar ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(9);
              }}
              placeholder="Search gigs by title or description..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="delivery_fast">Fastest Delivery</option>
              <option value="reviews">Most Reviews</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ===== Active filter chips ===== */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Active filters:</span>
            {filters.category !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {MOCK_CATEGORIES.find((c) => c.id === filters.category)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.priceRange !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, priceRange: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.priceRange === '2000+'
                  ? '₹2000+'
                  : `₹${filters.priceRange.replace('-', ' - ₹')}`}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.rating > 0 && (
              <button
                onClick={() => setFilters((p) => ({ ...p, rating: 0 }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.rating}+ Stars
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.delivery !== 'all' && (
              <button
                onClick={() => setFilters((p) => ({ ...p, delivery: 'all' }))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
              >
                {filters.delivery === '1-3'
                  ? '1-3 days'
                  : filters.delivery === '4-7'
                  ? '4-7 days'
                  : '8+ days'}
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ===== Layout: Filters + Grid ===== */}
        <div className="flex gap-8">
          {/* Filter sidebar */}
          <aside
            className={`${
              showFilters
                ? 'fixed inset-0 z-40 bg-black/40 lg:relative lg:bg-transparent'
                : 'hidden lg:block'
            }`}
          >
            <div
              className={`${
                showFilters
                  ? 'fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl lg:relative lg:shadow-none lg:w-full'
                  : 'w-full'
              } p-5 lg:p-0 overflow-y-auto`}
            >
              {/* Mobile close */}
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, category: 'all' }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.category === 'all'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {MOCK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters((p) => ({ ...p, category: cat.id }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.category === cat.id
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Price Range</h4>
                <div className="space-y-1">
                  {([
                    ['all', 'Any Price'],
                    ['0-500', 'Under ₹500'],
                    ['500-1000', '₹500 - ₹1,000'],
                    ['1000-2000', '₹1,000 - ₹2,000'],
                    ['2000+', '₹2,000+'],
                  ] as [PriceRange, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, priceRange: val }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.priceRange === val
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Minimum Rating</h4>
                <div className="space-y-1">
                  {([
                    [0, 'Any Rating'],
                    [4, '4.0+ Stars'],
                    [4.5, '4.5+ Stars'],
                    [4.8, '4.8+ Stars'],
                  ] as [number, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, rating: val }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.rating === val
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Time */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Delivery Time</h4>
                <div className="space-y-1">
                  {([
                    ['all', 'Any Time'],
                    ['1-3', '1-3 Days'],
                    ['4-7', '4-7 Days'],
                    ['8+', '8+ Days'],
                  ] as [DeliveryFilter, string][]).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFilters((p) => ({ ...p, delivery: val }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.delivery === val
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear All Filters ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {filteredGigs.length} gig{filteredGigs.length !== 1 ? 's' : ''} found
            </div>

            {filteredGigs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No gigs found</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* ===== Grid layout ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {displayedGigs.map((gig) => {
                    const isFav = favorites.has(gig.id);
                    const freelancerName = gig.freelancer?.full_name ?? 'Freelancer';
                    const freelancerRating = gig.rating;
                    const isFeatured = gig.is_featured;

                    return (
                      <div
                        key={gig.id}
                        className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 flex flex-col"
                      >
                        {/* Image placeholder */}
                        <div className="relative h-40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                          <DollarSign className="w-10 h-10 text-emerald-300 dark:text-emerald-700" />

                          {/* Featured badge */}
                          {isFeatured && (
                            <div className="absolute top-3 left-3">
                              <Badge label="Featured" variant="info" size="sm" />
                            </div>
                          )}

                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavorite(gig.id)}
                            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors duration-200 ${
                                isFav
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          {/* Category */}
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                            {gig.category?.name}
                          </p>

                          {/* Title */}
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {gig.title}
                          </h3>

                          {/* Freelancer info */}
                          <div className="flex items-center gap-2 mt-2.5">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                              {getInitials(freelancerName)}
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                              {freelancerName}
                            </span>
                            {gig.freelancer?.college_id_verified && (
                              <Badge label="Verified" variant="success" size="sm" />
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex items-center gap-0.5">
                              {renderStars(freelancerRating)}
                            </div>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                              {freelancerRating}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              ({gig.review_count})
                            </span>
                          </div>

                          {/* Skills */}
                          {gig.skills && gig.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {gig.skills.slice(0, 3).map((s) => (
                                <Badge key={s.id} label={s.name} variant="default" size="sm" />
                              ))}
                              {gig.skills.length > 3 && (
                                <Badge label={`+${gig.skills.length - 3}`} variant="default" size="sm" />
                              )}
                            </div>
                          )}

                          {/* Meta + CTA */}
                          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1.5 text-sm">
                                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(gig.price)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {gig.delivery_days}d
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {gig.views}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-200">
                                View Details
                                <Eye className="w-3 h-3" />
                              </button>
                              <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30">
                                Hire Now
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setVisibleCount((c) => c + 6)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all shadow-sm"
                    >
                      Load More
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
