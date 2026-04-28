/*
  # Add missing columns and tables for SkillSwap

  1. Add missing columns to existing tables
  2. Create missing tables (skills, wallets, favorites, referrals)
  3. Insert default data
*/

-- Add missing columns to profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'college_id_verified') THEN
    ALTER TABLE profiles ADD COLUMN college_id_verified boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_online') THEN
    ALTER TABLE profiles ADD COLUMN is_online boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_seen') THEN
    ALTER TABLE profiles ADD COLUMN last_seen timestamptz DEFAULT now();
  END IF;
END $$;

-- Add missing columns to freelancer_profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'headline') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN headline text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'experience_years') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN experience_years int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'completed_orders') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN completed_orders int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'xp') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN xp int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'level') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN level int DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'freelancer_profiles' AND column_name = 'profile_completion') THEN
    ALTER TABLE freelancer_profiles ADD COLUMN profile_completion int DEFAULT 0;
  END IF;
END $$;

-- Add missing columns to client_profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_profiles' AND column_name = 'total_orders') THEN
    ALTER TABLE client_profiles ADD COLUMN total_orders int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'client_profiles' AND column_name = 'description') THEN
    ALTER TABLE client_profiles ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

-- Add missing columns to tasks
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'is_instant_hire') THEN
    ALTER TABLE tasks ADD COLUMN is_instant_hire boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'applications_count') THEN
    ALTER TABLE tasks ADD COLUMN applications_count int DEFAULT 0;
  END IF;
END $$;

-- Add missing columns to orders
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'application_id') THEN
    ALTER TABLE orders ADD COLUMN application_id uuid REFERENCES applications(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'revisions_count') THEN
    ALTER TABLE orders ADD COLUMN revisions_count int DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'files') THEN
    ALTER TABLE orders ADD COLUMN files text[] DEFAULT '{}';
  END IF;
END $$;

-- Add missing columns to notifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'content') THEN
    ALTER TABLE notifications ADD COLUMN content text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'link') THEN
    ALTER TABLE notifications ADD COLUMN link text DEFAULT '';
  END IF;
END $$;

-- Add missing columns to reviews
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'tags') THEN
    ALTER TABLE reviews ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Add missing columns to user_badges
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_badges' AND column_name = 'earned_at') THEN
    ALTER TABLE user_badges ADD COLUMN earned_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create skills table if not exists
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create wallets table if not exists
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance numeric DEFAULT 0,
  escrow_balance numeric DEFAULT 0,
  total_earned numeric DEFAULT 0,
  total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create favorites table if not exists
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gig_id uuid REFERENCES gigs(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create referrals table if not exists
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code text NOT NULL UNIQUE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'earned')),
  xp_earned int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS for new tables
CREATE POLICY "Anyone can read skills" ON skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read own wallet" ON wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own favorites" ON favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own favorites" ON favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create referrals" ON referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- Insert default skills
INSERT INTO skills (name) VALUES
  ('React'), ('Python'), ('Django'), ('Node.js'), ('TypeScript'),
  ('JavaScript'), ('HTML/CSS'), ('Flutter'), ('Swift'), ('Kotlin'),
  ('Figma'), ('Photoshop'), ('Illustrator'), ('After Effects'),
  ('WordPress'), ('SEO'), ('Copywriting'), ('Data Analysis'),
  ('Machine Learning'), ('Java'), ('C++'), ('Go'), ('Rust'),
  ('AWS'), ('Docker'), ('Git'), ('MongoDB'), ('PostgreSQL')
ON CONFLICT (name) DO NOTHING;

-- Insert default badges
INSERT INTO badges (name, description, icon, xp_required) VALUES
  ('First Gig', 'Complete your very first order', 'Zap', 0),
  ('5-Star Rating', 'Receive a perfect 5-star review', 'Star', 200),
  ('10 Orders', 'Complete 10 orders successfully', 'Target', 900),
  ('Quick Responder', 'Maintain 90%+ response rate for 30 days', 'Flame', 500),
  ('Top Earner', 'Earn over INR 10,000 on the platform', 'TrendingUp', 2000),
  ('Campus Star', 'Get featured on the campus leaderboard', 'Crown', 2700),
  ('Speed Demon', 'Deliver 5 orders before the deadline', 'Zap', 1400),
  ('Perfectionist', 'Maintain 100% completion rate across 10+ orders', 'Award', 3500),
  ('Veteran', 'Be active on the platform for 6+ months', 'Medal', 4500),
  ('Grand Master', 'Reach Level 10 and unlock all achievements', 'Trophy', 5700),
  ('Crowd Favorite', 'Receive 20+ five-star reviews', 'Star', 7000),
  ('Centurion', 'Complete 100 orders on the platform', 'Trophy', 8500)
ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Web Development', 'web-development', 'code'),
  ('Mobile Development', 'mobile-development', 'smartphone'),
  ('UI/UX Design', 'ui-ux-design', 'palette'),
  ('Graphic Design', 'graphic-design', 'brush'),
  ('Content Writing', 'content-writing', 'pen-tool'),
  ('Video & Animation', 'video-animation', 'video'),
  ('Data Entry', 'data-entry', 'database'),
  ('Digital Marketing', 'digital-marketing', 'megaphone'),
  ('Social Media', 'social-media', 'share-2'),
  ('Tutoring', 'tutoring', 'book-open'),
  ('Photography', 'photography', 'camera'),
  ('Translation', 'translation', 'globe')
ON CONFLICT (name) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_applications_task ON applications(task_id);
CREATE INDEX IF NOT EXISTS idx_applications_freelancer ON applications(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_freelancer ON orders(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);