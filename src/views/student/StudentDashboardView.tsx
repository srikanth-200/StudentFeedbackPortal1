import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseOffering } from '../../types';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  Star,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface StudentDashboardViewProps {
  onNavigateToFeedback: (courseOfferingId?: string) => void;
  onNavigateToHistory: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onNavigateToFeedback,
  onNavigateToHistory,
}) => {
  const { user, token } = useAuth();
  const [data, setData] = useState<{
    metrics: {
      totalFeedbackSubmitted: number;
      pendingFeedback: number;
      completedFeedback: number;
      coursesCount: number;
      facultyEvaluated: number;
    };
    courses: CourseOffering[];
    notifications: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const { metrics, courses, notifications } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" /> Spring 2026 Academic Evaluation Cycle
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Anonymous student feedback directly drives curriculum updates, classroom improvements, and faculty recognition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToFeedback()}
              id="btn-quick-submit-feedback"
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Academic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Submitted */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Submitted
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalFeedbackSubmitted}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Recorded in database
          </p>
        </div>

        {/* Pending Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.pendingFeedback}
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Awaiting your evaluation
          </p>
        </div>

        {/* Completed Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.completedFeedback}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            This active semester
          </p>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Courses
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.coursesCount}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Registered subjects
          </p>
        </div>

        {/* Faculty Evaluated */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Faculty Rated
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.facultyEvaluated}
          </div>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
            Distinct instructors
          </p>
        </div>
      </div>

      {/* Courses & Evaluation Status Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Enrolled Courses & Feedback Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any pending course to submit your evaluation for this semester.
            </p>
          </div>

          <button
            onClick={onNavigateToHistory}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div
              key={course.courseId}
              className={`rounded-xl border p-4.5 transition flex flex-col justify-between ${
                course.isSubmitted
                  ? 'border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-emerald-400 dark:hover:border-emerald-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {course.courseCode}
                  </span>
                  {course.isSubmitted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-2">
                  {course.courseName}
                </h3>

                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {course.facultyAvatar ? (
                    <img
                      src={course.facultyAvatar}
                      alt={course.facultyName}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {course.facultyName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {course.facultyName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {course.facultyDesignation || 'Course Instructor'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {course.credits} Credits
                </span>

                {course.isSubmitted ? (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.ratingGiven || '4.8'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigateToFeedback(course.courseId)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1"
                  >
                    <span>Evaluate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Privacy Commitment Banner */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Anonymous Feedback Guarantee
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Your name, email, and roll number are mathematically decoupled from ratings and comments using one-way cryptographic tokens. Instructors receive only aggregated analytics and anonymous qualitative themes.
          </p>
        </div>
      </div>
    </div>
  );
};
