export type Role = 'freelancer' | 'client' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: Role;
  phone: string;
  college: string;
  college_id_verified: boolean;
  is_verified: boolean;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: string;
  user_id: string;
  headline: string;
  bio: string;
  portfolio_url: string;
  education: string;
  experience_years: number;
  hourly_rate: number;
  completion_rate: number;
  response_rate: number;
  on_time_delivery: number;
  total_earnings: number;
  total_orders: number;
  completed_orders: number;
  xp: number;
  level: number;
  profile_completion: number;
  created_at: string;
  updated_at: string;
  skills?: Skill[];
}

export interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  website: string;
  description: string;
  total_spent: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  created_at: string;
}

export interface Gig {
  id: string;
  freelancer_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  delivery_days: number;
  revisions: number;
  image_url: string;
  status: 'active' | 'paused' | 'deleted';
  rating: number;
  review_count: number;
  views: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  skills?: Skill[];
  freelancer?: Profile & { freelancer_profile?: FreelancerProfile };
}

export interface Task {
  id: string;
  client_id: string;
  category_id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  is_micro: boolean;
  is_urgent: boolean;
  is_instant_hire: boolean;
  views: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  skills?: Skill[];
  client?: Profile & { client_profile?: ClientProfile };
}

export type OrderStatus = 'open' | 'in_progress' | 'submitted' | 'revision' | 'completed' | 'reviewed' | 'cancelled';

export interface Order {
  id: string;
  gig_id: string | null;
  task_id: string | null;
  client_id: string;
  freelancer_id: string;
  title: string;
  description: string;
  price: number;
  deadline: string;
  status: OrderStatus;
  revisions_count: number;
  max_revisions: number;
  files: string[];
  created_at: string;
  updated_at: string;
  freelancer?: Profile;
  client?: Profile;
  gig?: Gig;
  task?: Task;
}

export interface Application {
  id: string;
  task_id: string;
  freelancer_id: string;
  cover_letter: string;
  proposed_budget: number;
  proposed_deadline: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  freelancer?: Profile & { freelancer_profile?: FreelancerProfile };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  file_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  other_user?: Profile;
  unread_count?: number;
}

export interface Transaction {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  type: 'escrow_deposit' | 'escrow_release' | 'escrow_refund' | 'wallet_add' | 'wallet_withdraw' | 'commission';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  escrow_balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'payment' | 'order' | 'application' | 'deadline' | 'system';
  title: string;
  content: string;
  is_read: boolean;
  link: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_required: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
}
