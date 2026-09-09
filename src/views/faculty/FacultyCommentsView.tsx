import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Search, Filter, Smile, Meh, Frown, Download } from 'lucide-react';

export const FacultyCommentsView: React.FC = () => {
  const { token } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/faculty/comments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        console.error('Failed to load comments:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  const filtered = comments.filter(c => {
    const matchesSearch =
      (c.comments?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.courseCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.anonymousToken?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesSentiment =
      sentimentFilter === 'ALL' || c.sentiment?.sentiment === sentimentFilter;

    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Anonymized Student Comments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real student remarks across all your courses with AI sentiment analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sentiment Filter Pills */}
          <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {['ALL', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'].map(sent => (
              <button
                key={sent}
                onClick={() => setSentimentFilter(sent)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition ${
                  sentimentFilter === sent
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sent.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No comments matching filter
          </p>
          <p className="text-xs text-slate-400 mt-1">Try selecting 'All' or clearing search query.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.courseCode}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Token: <strong className="font-mono">{item.anonymousToken}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.sentiment?.sentiment === 'POSITIVE'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : item.sentiment?.sentiment === 'NEGATIVE'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {item.sentiment?.sentiment} • {item.sentiment?.detectedEmotion}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                "{item.comments}"
              </p>

              {item.sentiment?.extractedKeywords && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold">Topics:</span>
                  {item.sentiment.extractedKeywords.map((kw: string, kidx: number) => (
                    <span
                      key={kidx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
