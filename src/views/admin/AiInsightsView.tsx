import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Lightbulb,
  BookOpen,
  Cpu,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export const AiInsightsView: React.FC = () => {
  const { token } = useAuth();
  const [insights, setInsights] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/admin/ai-insights', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (e) {
      console.error('Failed to load AI insights:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchInsights();
  };

  if (isLoading || !insights) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const {
    overallSentiment,
    emotions,
    keywords,
    majorConcerns,
    positiveThemes,
    facultySuggestions,
    courseSuggestions,
  } = insights;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Gemini AI Academic Quality Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Campus-wide AI Feedback Synthesis & Semantic Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Automated NLP distillation of 1,248 student submissions, emotion indicators, topical keyword clouds, and actionable institutional remediations.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Re-analyze Feedback</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Positive Sentiment
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallSentiment.positive}%
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              High student appreciation for clarity
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Meh className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Neutral / Constructive
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallSentiment.neutral}%
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Balanced suggestions for pacing
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Frown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Negative / Areas to Fix
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {overallSentiment.negative}%
            </div>
            <p className="text-[11px] text-rose-500 font-medium">
              Focused on infrastructure & schedule
            </p>
          </div>
        </div>
      </div>

      {/* Emotion Breakdown Chart & Keyword Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Distribution Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Detected Student Emotion Classification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Frequency of dominant emotional markers extracted by Gemini
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
              NLP Engine
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotions} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="emotion" type="category" stroke="#94a3b8" fontSize={11} width={80} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="percentage" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {emotions.map((entry: any, index: number) => {
                    const colors: Record<string, string> = {
                      Satisfaction: '#10b981',
                      Appreciation: '#059669',
                      Happiness: '#14b8a6',
                      Concern: '#f59e0b',
                      Confusion: '#f97316',
                      Frustration: '#f43f5e',
                    };
                    return <Cell key={`cell-${index}`} fill={colors[entry.emotion] || '#8b5cf6'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Keyword Cloud */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Common Feedback Keywords Cloud
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Most recurring topical terms weighted by frequency in open-ended text
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {keywords.map((kw: any, i: number) => {
                const isBig = kw.weight >= 40;
                const isMedium = kw.weight >= 25 && kw.weight < 40;
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition hover:scale-105 ${
                      isBig
                        ? 'px-3.5 py-2 text-sm bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        : isMedium
                        ? 'px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>#{kw.text}</span>
                    <span className="text-[10px] opacity-70 font-mono">({kw.weight})</span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Aggregated across all 42 courses</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">Updated Hourly</span>
          </div>
        </div>
      </div>

      {/* Major Themes: Positive vs Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Commendations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/40 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Top Institutional Strengths</span>
          </div>
          <div className="space-y-3">
            {positiveThemes.map((item: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.topic}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Major Concerns */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Key Institutional Friction Points</span>
          </div>
          <div className="space-y-3">
            {majorConcerns.map((item: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.topic}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Suggestions: Faculty & Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Faculty Suggestions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Actionable Faculty Pedagogical Guidance</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {facultySuggestions.map((sug: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <span className="font-bold text-indigo-600">✓</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Suggestions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Course & Lab Infrastructure Guidance</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {courseSuggestions.map((sug: string, i: number) => (
              <li
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <span className="font-bold text-teal-600">✓</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
