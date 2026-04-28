import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare, Wallet,
  Bell, Trophy, Settings, LogOut, Menu, Sun, Moon, Home,
  Users, Shield, BarChart3, HelpCircle, Search, Zap,
  Heart, Star, AlertTriangle, Gift, Activity, GitBranch
} from 'lucide-react';
import type { Role } from '../../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const freelancerNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-gigs', label: 'My Gigs', icon: Briefcase },
  { id: 'browse-tasks', label: 'Browse Tasks', icon: Search },
  { id: 'micro-tasks', label: 'Micro Tasks', icon: Zap },
  { id: 'app-flow', label: 'My Applications', icon: GitBranch },
  { id: 'orders', label: 'Orders', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  { id: 'referrals', label: 'Referrals', icon: Gift },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const clientNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'post-task', label: 'Post a Task', icon: FileText },
  { id: 'browse-gigs', label: 'Browse Gigs', icon: Search },
  { id: 'my-tasks', label: 'My Tasks', icon: Briefcase },
  { id: 'app-flow', label: 'Applications', icon: GitBranch },
  { id: 'orders', label: 'Orders', icon: FileText },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  { id: 'referrals', label: 'Referrals', icon: Gift },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'reports', label: 'Reports', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function getNavItems(role: Role) {
  if (role === 'admin') return adminNav;
  if (role === 'client') return clientNav;
  return freelancerNav;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = getNavItems(profile?.role ?? 'freelancer');

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">SkillSwap</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Campus Ultimate</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <button
          onClick={() => { onNavigate('marketplace'); setMobileOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentPage === 'marketplace'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          Marketplace
        </button>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <NavContent />
      </aside>
    </>
  );
}
