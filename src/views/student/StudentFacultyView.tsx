import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Star, Mail, BookOpen, Award } from 'lucide-react';

export const StudentFacultyView: React.FC = () => {
  const { token } = useAuth();
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/faculty', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFacultyList(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Department Faculty Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Instructors, professors, and course coordinators across your enrolled programs.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyList.map(f => (
            <div
              key={f.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {f.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{f.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {f.designation || 'Professor'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Department:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {f.departmentName || 'Computer Science'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Institutional Email:</span>
                  <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
                    {f.email}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
