import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  User,
  MessageSquarePlus,
  History,
  BookOpen,
  Users,
  Bell,
  HelpCircle,
  LogOut,
  BarChart3,
  Smile,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  Download,
  Shield,
  Layers,
  GraduationCap,
  Briefcase,
  BookMarked,
  Calendar,
  Settings,
  Sparkles,
  Trophy,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const role: UserRole = user?.role || 'STUDENT';

  // Navigation configurations per role
  const studentItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'submit-feedback', label: 'Submit Feedback', icon: MessageSquarePlus, badge: 'New' },
    { id: 'history', label: 'Feedback History', icon: History },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'faculty', label: 'My Faculty', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'help', label: 'Help & FAQ', icon: HelpCircle },
  ];

  const facultyItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'my-feedback', label: 'My Feedback', icon: MessageSquare },
    { id: 'analytics', label: 'Feedback Analytics', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: Smile },
    { id: 'comments', label: 'Student Comments', icon: History },
    { id: 'course-performance', label: 'Course Performance', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, badge: 'AI' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Download Reports', icon: Download },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Shield },
    { id: 'student-management', label: 'Student Management', icon: GraduationCap },
    { id: 'faculty-management', label: 'Faculty Management', icon: Users },
    { id: 'course-management', label: 'Course Management', icon: BookOpen },
    { id: 'dept-management', label: 'Department Management', icon: Layers },
    { id: 'subject-management', label: 'Subject Management', icon: BookMarked },
    { id: 'semester-management', label: 'Semester Management', icon: Calendar },
    { id: 'feedback-management', label: 'Feedback Management', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-insights', label: 'AI Insights', icon: Sparkles, badge: 'Smart' },
    { id: 'faculty-rankings', label: 'Faculty Rankings', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const navItems = role === 'ADMIN' ? adminItems : role === 'FACULTY' ? facultyItems : studentItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Role Identity Tag */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Portal Mode
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                role === 'STUDENT'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : role === 'FACULTY'
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {role}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">v2.5</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.badge === 'AI' || item.badge === 'Smart'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            id="sidebar-btn-logout"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
