import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Search, Filter, Download, MessageSquare } from 'lucide-react';

export const FeedbackManagementView: React.FC = () => {
  const { token } = useAuth();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/feedback', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        }
      } catch (e) {
        console.error('Failed to load feedback:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  const filtered = feedbacks.filter(f => {
    const matchesSearch =
      (f.comments?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (f.anonymousToken?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (f.courseCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (f.facultyName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesSentiment =
      sentimentFilter === 'ALL' || f.sentiment?.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  const handleExportCSV = () => {
    window.open('/api/admin/reports/export?format=csv', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Institutional Feedback Submissions Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Decoupled cryptographic records ensuring authentic, confidential student sentiment.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Records (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'].map(sent => (
            <button
              key={sent}
              onClick={() => setSentimentFilter(sent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                sentimentFilter === sent
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sent.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search token, course, faculty..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Anonymous Token</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Sentiment & Emotion</th>
                <th className="py-3 px-4">Written Remarks</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.anonymousToken}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.courseCode}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {item.facultyName}
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.overallRating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.sentiment?.sentiment === 'POSITIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.sentiment?.sentiment === 'NEGATIVE'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.sentiment?.sentiment} • {item.sentiment?.detectedEmotion}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400 italic">
                    "{item.comments}"
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
