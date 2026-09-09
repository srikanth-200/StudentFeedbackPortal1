import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  Users,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Download,
  Sparkles,
  BookOpen,
  MessageSquare,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet
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
  Legend
} from 'recharts';

interface FacultyDashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

const SENTIMENT_COLORS = {
  positive: '#10b981', // emerald-500
  neutral: '#f59e0b',  // amber-500
  negative: '#f43f5e', // rose-500
};

export const FacultyDashboardView: React.FC<FacultyDashboardViewProps> = ({ onNavigateTab }) => {
  const { token, user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadFacultyData() {
      try {
        const res = await fetch('/api/faculty/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load faculty dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFacultyData();
  }, [token]);

  const handleExportCSV = () => {
    window.open(`/api/faculty/export?format=csv`, '_blank');
    setDownloadSuccess('CSV Feedback Report downloaded successfully');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportJSON = () => {
    window.open(`/api/faculty/export?format=json`, '_blank');
    setDownloadSuccess('Comprehensive Faculty Evaluation Report generated');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const {
    metrics,
    faculty,
    courses,
    recentComments,
    aiSummary,
    monthlyTrends,
    categoryRatings,
    keywords,
  } = data;

  const sentimentData = [
    { name: 'Positive', value: metrics.positiveFeedback, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: metrics.neutralFeedback, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: metrics.negativeFeedback, color: SENTIMENT_COLORS.negative },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {faculty.avatarUrl ? (
              <img
                src={faculty.avatarUrl}
                alt={faculty.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-sm">
                {faculty.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{faculty.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  {faculty.designation}
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Specialization: {faculty.specialization} • Department of Computer Science
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              id="btn-faculty-export-csv"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              id="btn-faculty-export-report"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 6 Faculty KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Average Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Rating
            </span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{metrics.averageRating}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 5% Faculty
          </p>
        </div>

        {/* Total Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Reviews
            </span>
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalFeedback}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Verified Submissions
          </p>
        </div>

        {/* Positive Sentiment */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Positive
            </span>
            <Smile className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {metrics.positiveFeedback}%
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Favorable comments
          </p>
        </div>

        {/* Neutral Sentiment */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Neutral
            </span>
            <Meh className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {metrics.neutralFeedback}%
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Constructive/Balanced
          </p>
        </div>

        {/* Negative Sentiment */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Negative
            </span>
            <Frown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {metrics.negativeFeedback}%
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Attention needed
          </p>
        </div>

        {/* Improvement Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Progress
            </span>
            <Award className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white truncate">
            {metrics.improvementRate}
          </div>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
            Steady upward trend
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Trend (Monthly) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Semester Rating Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monthly average satisfaction score across all lectures & labs
              </p>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
              Spring 2026
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="rating"
                  name="Avg Rating"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0d9488' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Sentiment Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI NLP classified comment emotional breakdown
            </p>
          </div>

          <div className="h-48 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {metrics.positiveFeedback}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Positive</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-emerald-600 font-bold block">Positive</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{metrics.positiveFeedback}%</span>
            </div>
            <div>
              <span className="text-[10px] text-amber-600 font-bold block">Neutral</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{metrics.neutralFeedback}%</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-600 font-bold block">Negative</span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{metrics.negativeFeedback}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Taught Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Category Evaluation Scores
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Scores across the 6 core academic dimensions (Max: 5.0)
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryRatings}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} horizontal={false} />
                <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="score" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taught Courses List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            Course Performance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Student feedback breakdown for your active course allocations
          </p>

          <div className="space-y-3">
            {courses.map((crs: any) => (
              <div
                key={crs.courseId}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                      {crs.courseCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {crs.courseName}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {crs.credits} Credits • {crs.feedbackCount} Submissions
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-amber-500 flex items-center justify-end gap-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{crs.averageRating}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Satisfactory (94%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Executive Recommendations (Powered by Gemini) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-200 dark:border-purple-900/40 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Academic Quality Summary & Pedagogical Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesized from recent anonymous student evaluations
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Gemini AI Insights
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-purple-50/50 dark:bg-purple-950/20 p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/30">
          "{aiSummary?.executiveSummary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Top Pedagogical Strengths</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              {aiSummary?.strengths?.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Areas for Improvement</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              {aiSummary?.areasForImprovement?.map((imp: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-4 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 mb-2">
              <Lightbulb className="w-4 h-4 text-teal-600" />
              <span>Actionable Next Steps</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              {aiSummary?.recommendations?.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-500 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Anonymized Student Comments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Anonymized Student Feedback Feed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal student identifiers are strictly hidden to ensure candor and psychological safety.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('comments')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            View All Comments →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentComments.map((item: any) => (
            <div key={item.id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.anonymousToken}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {item.courseCode}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.sentiment?.sentiment === 'POSITIVE'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : item.sentiment?.sentiment === 'NEGATIVE'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {item.sentiment?.sentiment} ({item.sentiment?.detectedEmotion || 'Neutral'})
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                "{item.comments}"
              </p>

              {item.sentiment?.extractedKeywords && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.sentiment.extractedKeywords.map((kw: string, kidx: number) => (
                    <span
                      key={kidx}
                      className="text-[10px] px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
