import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './views/auth/AuthView';

// Student views
import { StudentDashboardView } from './views/student/StudentDashboardView';
import { SubmitFeedbackView } from './views/student/SubmitFeedbackView';
import { FeedbackHistoryView } from './views/student/FeedbackHistoryView';
import { StudentProfileView } from './views/student/StudentProfileView';
import { StudentCoursesView } from './views/student/StudentCoursesView';
import { StudentFacultyView } from './views/student/StudentFacultyView';

// Faculty views
import { FacultyDashboardView } from './views/faculty/FacultyDashboardView';
import { FacultyCommentsView } from './views/faculty/FacultyCommentsView';

// Admin views
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { UserManagementView } from './views/admin/UserManagementView';
import { CourseManagementView } from './views/admin/CourseManagementView';
import { FeedbackManagementView } from './views/admin/FeedbackManagementView';
import { AiInsightsView } from './views/admin/AiInsightsView';
import { ReportsView } from './views/admin/ReportsView';
import { SystemSettingsView } from './views/admin/SystemSettingsView';

// Shared views
import { NotificationsView } from './views/NotificationsView';
import { HelpFaqView } from './views/HelpFaqView';

export default function App() {
  const { user, token, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourseForFeedback, setSelectedCourseForFeedback] = useState<string | undefined>(undefined);

  // Reset to dashboard when user role switches
  useEffect(() => {
    setActiveTab('dashboard');
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
            Loading Academic Portal...
          </span>
        </div>
      </div>
    );
  }

  // Unauthenticated view
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
        <AuthView onSuccess={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  // Navigation router according to user role and activeTab
  const renderCurrentView = () => {
    const role = user.role;

    // Student Views
    if (role === 'STUDENT') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StudentDashboardView
              onNavigateToFeedback={(courseId) => {
                setSelectedCourseForFeedback(courseId);
                setActiveTab('submit-feedback');
              }}
              onNavigateToHistory={() => setActiveTab('history')}
            />
          );
        case 'profile':
          return <StudentProfileView />;
        case 'submit-feedback':
          return (
            <SubmitFeedbackView
              preselectedOfferingId={selectedCourseForFeedback}
              onSuccess={() => setActiveTab('history')}
              onViewHistory={() => setActiveTab('history')}
            />
          );
        case 'history':
          return <FeedbackHistoryView />;
        case 'courses':
          return (
            <StudentCoursesView
              onEvaluateCourse={(courseId) => {
                setSelectedCourseForFeedback(courseId);
                setActiveTab('submit-feedback');
              }}
            />
          );
        case 'faculty':
          return <StudentFacultyView />;
        case 'notifications':
          return <NotificationsView />;
        case 'help':
          return <HelpFaqView />;
        default:
          return (
            <StudentDashboardView
              onNavigateToFeedback={(courseId) => {
                setSelectedCourseForFeedback(courseId);
                setActiveTab('submit-feedback');
              }}
              onNavigateToHistory={() => setActiveTab('history')}
            />
          );
      }
    }

    // Faculty Views
    if (role === 'FACULTY') {
      switch (activeTab) {
        case 'dashboard':
        case 'my-feedback':
        case 'analytics':
        case 'sentiment':
        case 'course-performance':
        case 'recommendations':
          return <FacultyDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
        case 'comments':
          return <FacultyCommentsView />;
        case 'profile':
          return <StudentProfileView />;
        case 'reports':
          return <ReportsView />;
        case 'notifications':
          return <NotificationsView />;
        default:
          return <FacultyDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    // Admin Views
    if (role === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
        case 'user-management':
        case 'student-management':
        case 'faculty-management':
          return <UserManagementView />;
        case 'course-management':
        case 'dept-management':
        case 'subject-management':
        case 'semester-management':
          return <CourseManagementView />;
        case 'feedback-management':
          return <FeedbackManagementView />;
        case 'ai-insights':
        case 'analytics':
          return <AiInsightsView />;
        case 'faculty-rankings':
          return <AdminDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
        case 'reports':
          return <ReportsView />;
        case 'settings':
          return <SystemSettingsView />;
        case 'notifications':
          return <NotificationsView />;
        default:
          return <AdminDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 transition-colors flex flex-col">
      {/* Top Academic Navigation Bar */}
      <Navbar
        activeRole={user.role}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex">
        {/* Left Side Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
