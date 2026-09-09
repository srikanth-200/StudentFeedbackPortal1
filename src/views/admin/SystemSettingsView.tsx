import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Calendar, Lock, CheckCircle2, Save } from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    academicYear: '2025-2026',
    activeSemesterId: 'sem-sp26',
    isFeedbackWindowOpen: true,
    feedbackStartDate: '2026-04-01',
    feedbackEndDate: '2026-05-30',
    allowAnonymousFeedback: true,
    autoRunAiSentiment: true,
    minCommentLength: 10,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Configuration & Evaluation Window
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Academic terms, evaluation window deadlines, privacy guardrails, and AI sentiment settings.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Calendar Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Academic Term & Window Dates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Active Academic Year
              </label>
              <input
                type="text"
                value={settings.academicYear}
                onChange={e => setSettings({ ...settings, academicYear: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Evaluation Window Status
              </label>
              <div className="flex items-center h-10 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.isFeedbackWindowOpen}
                    onChange={e =>
                      setSettings({ ...settings, isFeedbackWindowOpen: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Portal Open For Submissions</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Evaluation Start Date
              </label>
              <input
                type="date"
                value={settings.feedbackStartDate}
                onChange={e => setSettings({ ...settings, feedbackStartDate: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Evaluation Deadline
              </label>
              <input
                type="date"
                value={settings.feedbackEndDate}
                onChange={e => setSettings({ ...settings, feedbackEndDate: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Security Enforcement */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Anonymity & AI Pipeline Settings
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                checked={settings.allowAnonymousFeedback}
                onChange={e =>
                  setSettings({ ...settings, allowAnonymousFeedback: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Mandatory Anonymous Token Decoupling
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Separates student identity from ratings so faculty can never view student roll numbers or names.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                checked={settings.autoRunAiSentiment}
                onChange={e =>
                  setSettings({ ...settings, autoRunAiSentiment: e.target.checked })
                }
                className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Automated Gemini AI Sentiment & Emotion Extraction
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Passes incoming comments through Gemini 3.8 Flash to classify sentiment and extract keywords.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
