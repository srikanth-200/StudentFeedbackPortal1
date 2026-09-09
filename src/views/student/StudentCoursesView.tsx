import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseOffering } from '../../types';
import { BookOpen, User, Calendar, Star, CheckCircle2, MessageSquarePlus, Clock } from 'lucide-react';

interface StudentCoursesViewProps {
  onEvaluateCourse: (courseOfferingId: string) => void;
}

export const StudentCoursesView: React.FC<StudentCoursesViewProps> = ({ onEvaluateCourse }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadCourses();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Enrolled Courses (Spring 2026)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active semester course enrollments and confidential evaluation status.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div
              key={course.offeringId}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {course.courseCode}
                  </span>
                  {course.isSubmitted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> Pending Feedback
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {course.courseName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Term: {course.semesterName}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {course.facultyName}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{course.credits} Credits</span>
                </div>
              </div>

              <div className="pt-2">
                {course.isSubmitted ? (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                  >
                    Feedback Already Recorded
                  </button>
                ) : (
                  <button
                    onClick={() => onEvaluateCourse(course.offeringId)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Submit Anonymous Evaluation</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
