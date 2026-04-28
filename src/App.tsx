import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import FreelancerDashboard from './components/freelancer/FreelancerDashboard';
import MyGigsPage from './components/freelancer/MyGigsPage';
import BrowseTasksPage from './components/freelancer/BrowseTasksPage';
import MicroTasksPage from './components/freelancer/MicroTasksPage';
import ClientDashboard from './components/client/ClientDashboard';
import PostTaskPage from './components/client/PostTaskPage';
import BrowseGigsPage from './components/client/BrowseGigsPage';
import MyTasksPage from './components/client/MyTasksPage';
import MarketplacePage from './components/marketplace/MarketplacePage';
import OrdersPage from './components/orders/OrdersPage';
import MessagingPage from './components/messaging/MessagingPage';
import WalletPage from './components/payments/WalletPage';
import NotificationsPage from './components/notifications/NotificationsPage';
import GamificationPage from './components/gamification/GamificationPage';
import AdminDashboard from './components/admin/AdminDashboard';
import SupportPage from './components/support/SupportPage';
import SettingsPage from './components/common/SettingsPage';
import ProfilePage from './components/profile/ProfilePage';
import ReviewSystem from './components/reviews/ReviewSystem';
import DisputePage from './components/disputes/DisputePage';
import FavoritesPage from './components/favorites/FavoritesPage';
import ReferralPage from './components/referrals/ReferralPage';
import ActivityFeedPage from './components/activity/ActivityFeedPage';
import ApplicationFlow from './components/flow/ApplicationFlow';
import AIAssistant from './components/ai/AIAssistant';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      const onboardingDone = localStorage.getItem(`onboarding_done_${user.id}`);
      if (!onboardingDone) {
        setShowOnboarding(true);
      }
    }
  }, [user, profile]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_done_${user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl animate-pulse">
            S
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    if (authPage === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />;
    }
    if (authPage === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthPage('register')} />;
    }
    return <LandingPage onGetStarted={() => setAuthPage('register')} onSignIn={() => setAuthPage('login')} />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (viewingProfileId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="p-4">
          <button
            onClick={() => setViewingProfileId(null)}
            className="mb-4 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            &larr; Back
          </button>
        </div>
        <ProfilePage userId={viewingProfileId} onNavigate={setCurrentPage} />
      </div>
    );
  }

  const role = profile.role;

  const getPageTitle = (): { title: string; subtitle: string } => {
    const titles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Dashboard', subtitle: `Welcome back, ${profile.full_name || 'User'}` },
      marketplace: { title: 'Marketplace', subtitle: 'Discover gigs, tasks, and micro-tasks' },
      'my-gigs': { title: 'My Gigs', subtitle: 'Manage your service listings' },
      'browse-tasks': { title: 'Browse Tasks', subtitle: 'Find tasks that match your skills' },
      'micro-tasks': { title: 'Micro Tasks', subtitle: 'Quick tasks, quick earnings' },
      'post-task': { title: 'Post a Task', subtitle: 'Create a new task for freelancers' },
      'browse-gigs': { title: 'Browse Gigs', subtitle: 'Find the perfect freelancer' },
      'my-tasks': { title: 'My Tasks', subtitle: 'Manage your posted tasks' },
      orders: { title: 'Orders', subtitle: 'Track and manage your orders' },
      messages: { title: 'Messages', subtitle: 'Chat with clients and freelancers' },
      wallet: { title: 'Wallet', subtitle: 'Manage your payments and earnings' },
      notifications: { title: 'Notifications', subtitle: 'Stay updated on your activity' },
      leaderboard: { title: 'Leaderboard', subtitle: 'Compete and climb the ranks' },
      support: { title: 'Support', subtitle: 'Get help and create tickets' },
      settings: { title: 'Settings', subtitle: 'Manage your account preferences' },
      users: { title: 'User Management', subtitle: 'Manage platform users' },
      reports: { title: 'Reports', subtitle: 'Review user reports' },
      analytics: { title: 'Analytics', subtitle: 'Platform performance insights' },
      reviews: { title: 'Reviews', subtitle: 'Ratings and feedback' },
      disputes: { title: 'Disputes', subtitle: 'Resolve order disputes' },
      favorites: { title: 'Favorites', subtitle: 'Your saved items' },
      referrals: { title: 'Referrals', subtitle: 'Invite friends, earn rewards' },
      activity: { title: 'Activity Feed', subtitle: 'Platform activity and trends' },
      'app-flow': { title: 'Application Flow', subtitle: 'Track your application progress' },
    };
    return titles[currentPage] || { title: 'Dashboard', subtitle: '' };
  };

  const renderPage = () => {
    if (currentPage === 'marketplace') return <MarketplacePage />;
    if (currentPage === 'reviews') return <ReviewSystem />;
    if (currentPage === 'disputes') return <DisputePage />;
    if (currentPage === 'favorites') return <FavoritesPage />;
    if (currentPage === 'referrals') return <ReferralPage />;
    if (currentPage === 'activity') return <ActivityFeedPage />;
    if (currentPage === 'app-flow') return <ApplicationFlow mode={role === 'client' ? 'client' : 'freelancer'} />;

    if (role === 'freelancer') {
      switch (currentPage) {
        case 'dashboard': return <FreelancerDashboard />;
        case 'my-gigs': return <MyGigsPage />;
        case 'browse-tasks': return <BrowseTasksPage />;
        case 'micro-tasks': return <MicroTasksPage />;
        case 'orders': return <OrdersPage />;
        case 'messages': return <MessagingPage />;
        case 'wallet': return <WalletPage />;
        case 'notifications': return <NotificationsPage />;
        case 'leaderboard': return <GamificationPage />;
        case 'support': return <SupportPage />;
        case 'settings': return <SettingsPage />;
        default: return <FreelancerDashboard />;
      }
    }

    if (role === 'client') {
      switch (currentPage) {
        case 'dashboard': return <ClientDashboard />;
        case 'post-task': return <PostTaskPage />;
        case 'browse-gigs': return <BrowseGigsPage />;
        case 'my-tasks': return <MyTasksPage />;
        case 'orders': return <OrdersPage />;
        case 'messages': return <MessagingPage />;
        case 'wallet': return <WalletPage />;
        case 'notifications': return <NotificationsPage />;
        case 'support': return <SupportPage />;
        case 'settings': return <SettingsPage />;
        default: return <ClientDashboard />;
      }
    }

    if (role === 'admin') {
      switch (currentPage) {
        case 'dashboard': return <AdminDashboard />;
        case 'users': return <AdminDashboard />;
        case 'reports': return <AdminDashboard />;
        case 'analytics': return <AdminDashboard />;
        case 'disputes': return <DisputePage />;
        case 'support': return <SupportPage />;
        case 'settings': return <SettingsPage />;
        default: return <AdminDashboard />;
      }
    }

    return <FreelancerDashboard />;
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="lg:pl-72">
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
