import { useState, useMemo } from 'react';
import {
  Star,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import type { Review, Order } from '../../types';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    order_id: 'o1',
    reviewer_id: 'u1',
    reviewee_id: 'u2',
    rating: 5,
    comment:
      'Absolutely outstanding work! The logo design exceeded my expectations. Communication was prompt and the freelancer was very receptive to feedback.',
    created_at: '2026-04-20T10:30:00Z',
    reviewer: {
      id: 'u1',
      email: 'alice@university.edu',
      full_name: 'Alice Johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      role: 'client',
      phone: '',
      college: 'State University',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '2026-04-27T08:00:00Z',
      created_at: '2025-09-01T00:00:00Z',
      updated_at: '2026-04-27T00:00:00Z',
    },
  },
  {
    id: 'r2',
    order_id: 'o2',
    reviewer_id: 'u3',
    reviewee_id: 'u2',
    rating: 4,
    comment:
      'Great website redesign. Minor delays on the second revision but overall very satisfied with the quality. Would recommend.',
    created_at: '2026-04-18T14:15:00Z',
    reviewer: {
      id: 'u3',
      email: 'carol@university.edu',
      full_name: 'Carol Martinez',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
      role: 'client',
      phone: '',
      college: 'Tech Institute',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-26T20:00:00Z',
      created_at: '2025-10-15T00:00:00Z',
      updated_at: '2026-04-26T00:00:00Z',
    },
  },
  {
    id: 'r3',
    order_id: 'o3',
    reviewer_id: 'u4',
    reviewee_id: 'u2',
    rating: 5,
    comment:
      'Perfect mobile app prototype. Delivered ahead of schedule and the attention to detail was remarkable. Highly recommend for any UI/UX work.',
    created_at: '2026-04-15T09:00:00Z',
    reviewer: {
      id: 'u4',
      email: 'dave@university.edu',
      full_name: 'Dave Kim',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave',
      role: 'client',
      phone: '',
      college: 'Design College',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '2026-04-27T07:30:00Z',
      created_at: '2025-11-01T00:00:00Z',
      updated_at: '2026-04-27T00:00:00Z',
    },
  },
  {
    id: 'r4',
    order_id: 'o4',
    reviewer_id: 'u5',
    reviewee_id: 'u2',
    rating: 3,
    comment:
      'Decent work on the data analysis project. Some of the visualizations could have been more polished, but the insights were valuable.',
    created_at: '2026-04-10T16:45:00Z',
    reviewer: {
      id: 'u5',
      email: 'eve@university.edu',
      full_name: 'Eve Thompson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
      role: 'client',
      phone: '',
      college: 'Business School',
      college_id_verified: true,
      is_verified: false,
      is_online: false,
      last_seen: '2026-04-24T18:00:00Z',
      created_at: '2025-12-01T00:00:00Z',
      updated_at: '2026-04-24T00:00:00Z',
    },
  },
  {
    id: 'r5',
    order_id: 'o5',
    reviewer_id: 'u6',
    reviewee_id: 'u2',
    rating: 2,
    comment:
      'The social media graphics were below expectations. Needed multiple revisions and the final result still did not match the brief.',
    created_at: '2026-04-05T11:20:00Z',
    reviewer: {
      id: 'u6',
      email: 'frank@university.edu',
      full_name: 'Frank Lee',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
      role: 'client',
      phone: '',
      college: 'Art Academy',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-22T12:00:00Z',
      created_at: '2026-01-10T00:00:00Z',
      updated_at: '2026-04-22T00:00:00Z',
    },
  },
  {
    id: 'r6',
    order_id: 'o6',
    reviewer_id: 'u7',
    reviewee_id: 'u2',
    rating: 4,
    comment:
      'Solid essay editing service. My paper went from a B to an A-. Fast turnaround and great suggestions for improvement.',
    created_at: '2026-04-01T08:00:00Z',
    reviewer: {
      id: 'u7',
      email: 'grace@university.edu',
      full_name: 'Grace Nguyen',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
      role: 'client',
      phone: '',
      college: 'Liberal Arts College',
      college_id_verified: true,
      is_verified: true,
      is_online: true,
      last_seen: '2026-04-27T06:00:00Z',
      created_at: '2026-01-20T00:00:00Z',
      updated_at: '2026-04-27T00:00:00Z',
    },
  },
  {
    id: 'r7',
    order_id: 'o7',
    reviewer_id: 'u8',
    reviewee_id: 'u2',
    rating: 5,
    comment:
      'Excellent tutoring session! Explained complex algorithms clearly and patiently. My grades improved significantly.',
    created_at: '2026-03-28T13:00:00Z',
    reviewer: {
      id: 'u8',
      email: 'henry@university.edu',
      full_name: 'Henry Patel',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
      role: 'client',
      phone: '',
      college: 'Engineering College',
      college_id_verified: true,
      is_verified: true,
      is_online: false,
      last_seen: '2026-04-25T22:00:00Z',
      created_at: '2026-02-01T00:00:00Z',
      updated_at: '2026-04-25T00:00:00Z',
    },
  },
  {
    id: 'r8',
    order_id: 'o8',
    reviewer_id: 'u9',
    reviewee_id: 'u2',
    rating: 1,
    comment:
      'Very disappointed. The delivered code was full of bugs and did not follow the specifications at all. Would not hire again.',
    created_at: '2026-03-20T17:30:00Z',
    reviewer: {
      id: 'u9',
      email: 'ivan@university.edu',
      full_name: 'Ivan Rodriguez',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ivan',
      role: 'client',
      phone: '',
      college: 'Coding Bootcamp',
      college_id_verified: false,
      is_verified: false,
      is_online: false,
      last_seen: '2026-04-20T10:00:00Z',
      created_at: '2026-02-15T00:00:00Z',
      updated_at: '2026-04-20T00:00:00Z',
    },
  },
];

const MOCK_COMPLETED_ORDERS: Order[] = [
  {
    id: 'o1',
    gig_id: 'g1',
    task_id: null,
    client_id: 'u1',
    freelancer_id: 'u2',
    title: 'Professional Logo Design',
    description: 'Create a modern logo for my startup',
    price: 50,
    deadline: '2026-04-15T00:00:00Z',
    status: 'reviewed',
    revisions_count: 1,
    max_revisions: 3,
    files: [],
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-20T00:00:00Z',
  },
  {
    id: 'o2',
    gig_id: 'g2',
    task_id: null,
    client_id: 'u3',
    freelancer_id: 'u2',
    title: 'Website Redesign',
    description: 'Redesign the landing page',
    price: 120,
    deadline: '2026-04-10T00:00:00Z',
    status: 'reviewed',
    revisions_count: 2,
    max_revisions: 3,
    files: [],
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-04-18T00:00:00Z',
  },
  {
    id: 'o3',
    gig_id: null,
    task_id: 't1',
    client_id: 'u4',
    freelancer_id: 'u2',
    title: 'Mobile App Prototype',
    description: 'Build a clickable prototype',
    price: 200,
    deadline: '2026-04-08T00:00:00Z',
    status: 'completed',
    revisions_count: 0,
    max_revisions: 2,
    files: [],
    created_at: '2026-03-20T00:00:00Z',
    updated_at: '2026-04-15T00:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Tag definitions
// ---------------------------------------------------------------------------

const QUICK_TAGS = [
  'Excellent Communication',
  'Delivered On Time',
  'High Quality',
  'Would Hire Again',
  'Exceeded Expectations',
  'Professional',
  'Responsive',
  'Creative',
  'Good Value',
  'Easy to Work With',
] as const;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ratingVariant = (r: number): 'default' | 'success' | 'warning' | 'danger' => {
  if (r >= 4) return 'success';
  if (r === 3) return 'warning';
  return 'danger';
};

// ---------------------------------------------------------------------------
// StarRating
// ---------------------------------------------------------------------------

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  hoverRating?: number;
  onHover?: (r: number) => void;
  onLeave?: () => void;
  onClick?: (r: number) => void;
}

function StarRating({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  hoverRating,
  onHover,
  onLeave,
  onClick,
}: StarRatingProps) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
  const display = hoverRating ?? rating;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={onLeave}>
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform duration-150 ${
              interactive ? 'hover:scale-110' : ''
            }`}
            onMouseEnter={() => interactive && onHover?.(star)}
            onClick={() => interactive && onClick?.(star)}
          >
            <Star
              className={`${sizeMap[size]} transition-colors duration-150 ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReviewModal
// ---------------------------------------------------------------------------

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSubmit: (review: {
    order_id: string;
    rating: number;
    comment: string;
    tags: string[];
  }) => void;
}

export function ReviewModal({ isOpen, onClose, order, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 500;
  const charCount = comment.length;
  const isValid = rating > 0 && comment.trim().length >= 10;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev,
    );
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    onSubmit({ order_id: order.id, rating, comment: comment.trim(), tags: selectedTags });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setSelectedTags([]);
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Leave a Review" size="lg">
      {submitted ? (
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Review Submitted!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
            Thank you for your feedback. Your review helps other students make informed decisions.
          </p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Done
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <MessageSquare className="w-5 h-5 text-teal-500" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{order.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">${order.price}</p>
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-3">
              <StarRating
                rating={rating}
                interactive
                hoverRating={hoverRating}
                onHover={setHoverRating}
                onLeave={() => setHoverRating(0)}
                onClick={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
            {rating === 0 && hoverRating === 0 && (
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Click a star to rate
              </p>
            )}
          </div>

          {/* Written review */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Written Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, MAX_CHARS))}
              rows={4}
              placeholder="Share your experience... (minimum 10 characters)"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 resize-none"
            />
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  charCount >= MAX_CHARS
                    ? 'text-red-500'
                    : charCount > 0
                      ? 'text-slate-400'
                      : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Quick tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Quick Tags <span className="text-slate-400 font-normal">(select up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                      active
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-400'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
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
// ReviewCard
// ---------------------------------------------------------------------------

interface ReviewWithTags extends Review {
  tags?: string[];
  helpful_count?: number;
  not_helpful_count?: number;
}

interface ReviewCardProps {
  review: ReviewWithTags;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpful, setHelpful] = useState(review.helpful_count ?? 0);
  const [notHelpful, setNotHelpful] = useState(review.not_helpful_count ?? 0);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (voted === type) {
      // un-vote
      if (type === 'up') setHelpful((c) => c - 1);
      else setNotHelpful((c) => c - 1);
      setVoted(null);
    } else {
      if (voted) {
        // switch vote
        if (voted === 'up') setHelpful((c) => c - 1);
        else setNotHelpful((c) => c - 1);
      }
      if (type === 'up') setHelpful((c) => c + 1);
      else setNotHelpful((c) => c + 1);
      setVoted(type);
    }
  };

  const tags = review.tags ?? [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <img
          src={review.reviewer?.avatar_url ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          alt={review.reviewer?.full_name ?? 'Reviewer'}
          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100 dark:border-emerald-900/50"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {review.reviewer?.full_name ?? 'Anonymous'}
            </span>
            {review.reviewer?.is_verified && (
              <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
        <Badge label={`${review.rating}.0`} variant={ratingVariant(review.rating)} size="sm" />
      </div>

      {/* Review text */}
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {review.comment}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Helpful / Not helpful */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <button
          onClick={() => handleVote('up')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
            voted === 'up'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          Helpful ({helpful})
        </button>
        <button
          onClick={() => handleVote('down')}
          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
            voted === 'down'
              ? 'text-red-500 dark:text-red-400'
              : 'text-slate-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          Not Helpful ({notHelpful})
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReviewList
// ---------------------------------------------------------------------------

type SortOption = 'newest' | 'highest' | 'lowest';

interface ReviewListProps {
  reviews?: ReviewWithTags[];
  showSummary?: boolean;
}

export function ReviewList({ reviews, showSummary = true }: ReviewListProps) {
  const data = reviews ?? MOCK_REVIEWS;
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // Computed stats
  const stats = useMemo(() => {
    const total = data.length;
    const avg = total > 0 ? data.reduce((s, r) => s + r.rating, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = data.filter((r) => r.rating === star).length;
      return { star, count, pct: total > 0 ? (count / total) * 100 : 0 };
    });
    return { total, avg, distribution };
  }, [data]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    let list = filterRating !== null ? data.filter((r) => r.rating === filterRating) : data;
    list = [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'highest') return b.rating - a.rating;
      return a.rating - b.rating;
    });
    return list;
  }, [data, filterRating, sort]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest First',
    highest: 'Highest Rated',
    lowest: 'Lowest Rated',
  };

  return (
    <div className="space-y-6">
      {/* Summary section */}
      {showSummary && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Average */}
            <div className="flex flex-col items-center justify-center sm:min-w-[140px]">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">
                {stats.avg.toFixed(1)}
              </span>
              <StarRating rating={Math.round(stats.avg)} size="sm" />
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {stats.total} review{stats.total !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 space-y-2">
              {stats.distribution.map(({ star, count, pct }) => (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className={`w-full flex items-center gap-2 group transition-opacity duration-200 ${
                    filterRating !== null && filterRating !== star ? 'opacity-40' : ''
                  }`}
                >
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                    {star}★
                  </span>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 w-8 text-right">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {filterRating !== null && (
            <button
              onClick={() => setFilterRating(null)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              {filterRating}★ filter
              <X className="w-3 h-3" />
            </button>
          )}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            {sortLabels[sort]}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 z-20 mt-1 w-44 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg overflow-hidden">
                {(['newest', 'highest', 'lowest'] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                      sort === opt
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {sortLabels[opt]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">No reviews found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {filterRating !== null
              ? `No ${filterRating}-star reviews yet.`
              : 'Reviews will appear after orders are completed.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReviewStats
// ---------------------------------------------------------------------------

interface ReviewStatsProps {
  reviews?: Review[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const data = reviews ?? MOCK_REVIEWS;

  const stats = useMemo(() => {
    const total = data.length;
    const avg = total > 0 ? data.reduce((s, r) => s + r.rating, 0) / total : 0;
    const fiveStarPct = total > 0 ? (data.filter((r) => r.rating === 5).length / total) * 100 : 0;

    // Rating trend: compare last 3 months vs prior 3 months
    const now = new Date('2026-04-27');
    const recentCutoff = new Date(now);
    recentCutoff.setMonth(recentCutoff.getMonth() - 3);
    const olderCutoff = new Date(now);
    olderCutoff.setMonth(olderCutoff.getMonth() - 6);

    const recent = data.filter((r) => new Date(r.created_at) >= recentCutoff);
    const older = data.filter(
      (r) => new Date(r.created_at) >= olderCutoff && new Date(r.created_at) < recentCutoff,
    );

    const recentAvg = recent.length > 0 ? recent.reduce((s, r) => s + r.rating, 0) / recent.length : 0;
    const olderAvg = older.length > 0 ? older.reduce((s, r) => s + r.rating, 0) / older.length : 0;
    const trend: 'up' | 'down' | 'stable' =
      recentAvg > olderAvg + 0.1 ? 'up' : recentAvg < olderAvg - 0.1 ? 'down' : 'stable';

    return { total, avg, fiveStarPct, trend, recentAvg };
  }, [data]);

  const trendIcon = {
    up: { color: 'text-emerald-600 dark:text-emerald-400', label: 'Trending Up' },
    down: { color: 'text-red-500 dark:text-red-400', label: 'Trending Down' },
    stable: { color: 'text-teal-500 dark:text-teal-400', label: 'Stable' },
  }[stats.trend];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Average Rating */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Average Rating
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avg.toFixed(1)}</p>
        <StarRating rating={Math.round(stats.avg)} size="sm" />
      </div>

      {/* Total Reviews */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Reviews
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {Math.round(stats.fiveStarPct)}% five-star
        </p>
      </div>

      {/* Rating Trend */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Rating Trend
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {stats.trend === 'up' ? '↑' : stats.trend === 'down' ? '↓' : '→'}
            </span>
          </div>
        </div>
        <p className={`text-lg font-bold ${trendIcon.color}`}>{trendIcon.label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Recent avg: {stats.recentAvg.toFixed(1)}
        </p>
      </div>

      {/* Satisfaction */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Satisfaction
          </span>
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {stats.total > 0
            ? Math.round(
                (data.filter((r) => r.rating >= 4).length / stats.total) * 100,
              )
            : 0}
          %
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          rated 4★ or above
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export: full page combining all components
// ---------------------------------------------------------------------------

export default function ReviewSystem() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<ReviewWithTags[]>(MOCK_REVIEWS);

  const handleOpenReview = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleSubmitReview = (input: {
    order_id: string;
    rating: number;
    comment: string;
    tags: string[];
  }) => {
    const newReview: ReviewWithTags = {
      id: `r${Date.now()}`,
      order_id: input.order_id,
      reviewer_id: 'u1',
      reviewee_id: 'u2',
      rating: input.rating,
      comment: input.comment,
      created_at: new Date().toISOString(),
      tags: input.tags,
      helpful_count: 0,
      not_helpful_count: 0,
      reviewer: {
        id: 'u1',
        email: 'alice@university.edu',
        full_name: 'Alice Johnson',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        role: 'client',
        phone: '',
        college: 'State University',
        college_id_verified: true,
        is_verified: true,
        is_online: true,
        last_seen: '2026-04-27T08:00:00Z',
        created_at: '2025-09-01T00:00:00Z',
        updated_at: '2026-04-27T00:00:00Z',
      },
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Feedback from completed orders
            </p>
          </div>
          <button
            onClick={() => handleOpenReview(MOCK_COMPLETED_ORDERS[0])}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* Stats */}
        <ReviewStats reviews={reviews} />

        {/* Review List */}
        <ReviewList reviews={reviews} />
      </div>

      {/* Review modal */}
      {selectedOrder && (
        <ReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          order={selectedOrder}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
