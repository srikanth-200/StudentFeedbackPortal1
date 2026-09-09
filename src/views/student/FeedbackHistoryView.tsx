import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FeedbackItem } from '../../types';
import {
  History,
  Star,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

export const FeedbackHistoryView: React.FC = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/student/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (e) {
        console.error('Failed to load history:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  const filtered = history.filter(item =>
    (item.courseName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.courseCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.anonymousToken?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Feedback History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit log of all course evaluations submitted across past and current academic terms.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search course or token..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No submissions found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Evaluations you submit will appear here with cryptographic anonymous tokens.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {item.courseCode}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.courseName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Instructor: {item.facultyName} • {item.semesterName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{item.overallRating}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.anonymousToken}
                  </span>
                </div>
              </div>

              {item.comments && (
                <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="italic">"{item.comments}"</p>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  {item.sentiment && (
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        item.sentiment.sentiment === 'POSITIVE'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.sentiment.sentiment === 'NEGATIVE'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      AI: {item.sentiment.sentiment} ({item.sentiment.detectedEmotion})
                    </span>
                  )}
                  {item.sentiment?.extractedKeywords && (
                    <span className="hidden md:inline text-slate-400">
                      Keywords: {item.sentiment.extractedKeywords.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted {new Date(item.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
