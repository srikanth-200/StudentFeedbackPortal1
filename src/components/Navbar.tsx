import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeRole: UserRole;
  onChangeTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeRole, onChangeTab }) => {
  const { user, demoLogin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Feedback Period Active', time: 'Spring 2026', unread: true },
    { id: 2, title: '1,248 Total Submissions Reached', time: 'Today', unread: true },
    { id: 3, title: 'AI Sentiment Summary Updated', time: '2 hrs ago', unread: false },
  ];

  const handleRoleSwitch = async (role: UserRole) => {
    await demoLogin(role);
    if (onChangeTab) onChangeTab('dashboard');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'FACULTY':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
      case 'ADMIN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeTab && onChangeTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  Student Feedback Portal
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Anonymous & Secure
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
                Anonymous, honest feedback — helping faculty and students grow together.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Interactive Role Switcher Pill Bar */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
            Switch View:
          </span>
          <button
            id="nav-role-student"
            onClick={() => handleRoleSwitch('STUDENT')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeRole === 'STUDENT'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Student</span>
          </button>
          <button
            id="nav-role-faculty"
            onClick={() => handleRoleSwitch('FACULTY')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeRole === 'FACULTY'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Faculty</span>
          </button>
          <button
            id="nav-role-admin"
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeRole === 'ADMIN'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Admin</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition"
            aria-label="Toggle Theme"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Notifications
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer text-xs ${
                        n.unread ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (onChangeTab) onChangeTab('notifications');
                      }}
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      if (onChangeTab) onChangeTab('notifications');
                    }}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Chip & Menu */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onChangeTab) onChangeTab('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleRoleSwitch('STUDENT')}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
