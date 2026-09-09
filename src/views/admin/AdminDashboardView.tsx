import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminMetrics, FacultyRankingItem } from '../../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  MessageSquare,
  Star,
  Activity,
  Smile,
  Frown,
  TrendingUp,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

interface AdminDashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

const SENTIMENT_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigateTab }) => {
  const { token } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [rankingFilter, setRankingFilter] = useState<'ALL' | 'TOP' | 'IMPROVED' | 'NEEDS_ATTENTION'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [token]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const {
    metrics,
    ratingsOverTime,
    facultyRankings,
    coursePerformance,
    sentimentDistribution,
    categoryRatings,
  } = data;

  const sentimentData = [
    { name: 'Positive', value: sentimentDistribution.positive },
    { name: 'Neutral', value: sentimentDistribution.neutral },
    { name: 'Negative', value: sentimentDistribution.negative },
  ];

  // Filter rankings according to selected category
  const filteredRankings = facultyRankings.filter((item: FacultyRankingItem) => {
    if (rankingFilter === 'TOP') return item.averageRating >= 4.7;
    if (rankingFilter === 'IMPROVED') return item.trend === 'up';
    if (rankingFilter === 'NEEDS_ATTENTION') return item.averageRating < 4.4;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs border border-indigo-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> University Executive Portal
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Institutional Quality & Feedback Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time analytics, AI sentiment classification, and departmental academic metrics across the university.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Generate Audit Report</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-insights')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold backdrop-blur-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Insights</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Students
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalStudents}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +12% YoY
          </span>
        </div>

        {/* Total Faculty */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Faculty
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalFaculty}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            5 Departments
          </span>
        </div>

        {/* Total Courses */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Courses
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalCourses}
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            Active in S26
          </span>
        </div>

        {/* Total Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Feedback
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.totalFeedback.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4%
          </span>
        </div>

        {/* Average Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Avg Rating
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1">
            <span>{metrics.averageRating}</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            Target: 4.0+
          </span>
        </div>

        {/* Response Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Response Rate
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {metrics.responseRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> High turnout
          </span>
        </div>

        {/* Positive % */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Positive
          </span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.positiveFeedback}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            AI Classified
          </span>
        </div>

        {/* Negative % */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
            Negative
          </span>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400">
            {metrics.negativeFeedback}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
            Action items
          </span>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ratings Over Time (Jan-Jun) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Ratings Over Time (Jan – Jun 2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly longitudinal tracking of institutional student feedback scores
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
              Campus-wide
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ratingsOverTime} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[3.0, 5.0]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  name="Avg Rating"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRating)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institutional Sentiment Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated across 1,248 student written reviews
            </p>
          </div>

          <div className="h-48 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {sentimentDistribution.positive}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                Positive
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-emerald-600 font-bold block">Positive</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{sentimentDistribution.positive}%</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 font-bold block">Neutral</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{sentimentDistribution.neutral}%</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 font-bold block">Negative</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{sentimentDistribution.negative}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Ranking Leaderboard (With Medals 🥇 🥈 🥉, Categorization, & Sparkline) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Faculty Ranking Leaderboard
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Spring 2026 Rankings
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rankings computed using Bayesian average satisfaction across enrolled courses.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setRankingFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                rankingFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Faculty
            </button>
            <button
              onClick={() => setRankingFilter('TOP')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                rankingFilter === 'TOP'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Top Performing
            </button>
            <button
              onClick={() => setRankingFilter('IMPROVED')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                rankingFilter === 'IMPROVED'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Most Improved
            </button>
            <button
              onClick={() => setRankingFilter('NEEDS_ATTENTION')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                rankingFilter === 'NEEDS_ATTENTION'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Needing Attention
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Faculty Member</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Average Rating</th>
                <th className="py-3 px-3">Submissions</th>
                <th className="py-3 px-3">Trend Sparkline</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredRankings.map((fac: FacultyRankingItem) => {
                const getRankBadge = (rank: number) => {
                  if (rank === 1) return <span className="text-base" title="Gold Medal">🥇</span>;
                  if (rank === 2) return <span className="text-base" title="Silver Medal">🥈</span>;
                  if (rank === 3) return <span className="text-base" title="Bronze Medal">🥉</span>;
                  return (
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {rank}
                    </span>
                  );
                };

                return (
                  <tr key={fac.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold">
                      <div className="flex items-center gap-1.5">{getRankBadge(fac.rank)}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {fac.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {fac.department}
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{fac.averageRating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {fac.totalFeedback} reviews
                    </td>
                    <td className="py-3 px-3">
                      {/* Mini Sparkline Visualization */}
                      <div className="flex items-end gap-1 h-5 w-20">
                        {fac.sparkline?.map((val, i) => (
                          <div
                            key={i}
                            className={`w-3.5 rounded-xs transition-all ${
                              fac.trend === 'up'
                                ? 'bg-emerald-500'
                                : fac.trend === 'down'
                                ? 'bg-rose-500'
                                : 'bg-indigo-500'
                            }`}
                            style={{ height: `${(val / 5.0) * 100}%` }}
                            title={`Month ${i + 1}: ${val}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          fac.averageRating >= 4.7
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : fac.averageRating >= 4.4
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {fac.averageRating >= 4.7 ? 'Excellent' : fac.averageRating >= 4.4 ? 'Commended' : 'Support Advised'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Performance & Category Radar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Course Performance Summary
            </h3>
            <button
              onClick={() => onNavigateTab('course-management')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Manage Courses →
            </button>
          </div>

          <div className="space-y-3">
            {coursePerformance.map((c: any) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {c.feedbackCount} Reviews • {c.sentimentPositive}% Positive
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{c.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Category Dimension Scores */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Institutional Dimension Benchmarks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Mean aggregate score across campus academic pillars (Scale: 1 - 5)
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRatings} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} angle={-20} textAnchor="end" />
                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
