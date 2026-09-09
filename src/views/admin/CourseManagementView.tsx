import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Search, Layers, Edit2, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const CourseManagementView: React.FC = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'COURSES' | 'DEPTS'>('COURSES');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);

  // New course form
  const [courseForm, setCourseForm] = useState({
    code: '',
    name: '',
    departmentId: 'dept-cs',
    credits: 4,
    semesterNumber: 4,
    description: '',
  });

  // New dept form
  const [deptForm, setDeptForm] = useState({
    code: '',
    name: '',
    headOfDept: '',
    description: '',
  });

  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        fetch('/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (cRes.ok) setCourses(await cRes.json());
      if (dRes.ok) setDepartments(await dRes.json());
    } catch (e) {
      console.error('Failed to load courses:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseForm),
      });
      if (res.ok) {
        setShowAddCourse(false);
        setCourseForm({
          code: '',
          name: '',
          departmentId: 'dept-cs',
          credits: 4,
          semesterNumber: 4,
          description: '',
        });
        setMessage('New course successfully registered.');
        setTimeout(() => setMessage(null), 3000);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deptForm),
      });
      if (res.ok) {
        setShowAddDept(false);
        setDeptForm({ code: '', name: '', headOfDept: '', description: '' });
        setMessage('New academic department created.');
        setTimeout(() => setMessage(null), 3000);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Curriculum & Academic Structure Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure departments, course catalogs, credit distributions, and subject offerings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'COURSES' ? (
            <button
              onClick={() => setShowAddCourse(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddDept(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('COURSES')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'COURSES'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('DEPTS')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'DEPTS'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Departments ({departments.length})
          </button>
        </div>

        {activeTab === 'COURSES' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search course code or name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Courses List */}
      {activeTab === 'COURSES' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Assigned Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {c.departmentName || 'Computer Science'}
                    </td>
                    <td className="py-3 px-4 font-mono">{c.credits} Credits</td>
                    <td className="py-3 px-4">Semester {c.semesterNumber}</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {c.assignedFacultyCount || 1} Faculty Member
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Departments List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(d => (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {d.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {d.courseCount || 10} Courses
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{d.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Head of Dept: <strong>{d.headOfDept || 'Academic Dean'}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Faculty: {d.facultyCount || 12}</span>
                <span className="text-emerald-600 font-semibold">Active Accreditation</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add New Academic Course
              </h3>
              <button onClick={() => setShowAddCourse(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-402"
                  value={courseForm.code}
                  onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Cloud Computing"
                  value={courseForm.name}
                  onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={courseForm.credits}
                    onChange={e => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={courseForm.semesterNumber}
                    onChange={e => setCourseForm({ ...courseForm, semesterNumber: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dept Modal */}
      {showAddDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Academic Department
              </h3>
              <button onClick={() => setShowAddDept(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-ML"
                  value={deptForm.code}
                  onChange={e => setDeptForm({ ...deptForm, code: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Head of Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Catherine Brooks"
                  value={deptForm.headOfDept}
                  onChange={e => setDeptForm({ ...deptForm, headOfDept: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDept(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
