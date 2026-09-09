import React from 'react';
import { ShieldCheck, HelpCircle, Sparkles, Lock, EyeOff, BookOpen } from 'lucide-react';

export const HelpFaqView: React.FC = () => {
  const faqs = [
    {
      q: 'How is student anonymity guaranteed?',
      a: 'The system decouples your student identity from the feedback submission. The database creates an irreversible cryptographic hash (Token) that is tied only to the feedback parameters. Neither faculty members nor department chairs can view your name, roll number, or personal identifiers.',
      icon: EyeOff,
    },
    {
      q: 'How does Gemini AI analyze my comments?',
      a: 'When feedback is submitted, the natural language text is passed to Google Gemini 3.8 Flash. The AI extracts positive aspects, constructive criticisms, student emotions (e.g. Satisfaction, Frustration), and key topics without ever receiving any student identifying metadata.',
      icon: Sparkles,
    },
    {
      q: 'Can faculty retaliate based on feedback ratings?',
      a: 'No. Faculty dashboards only display aggregated ratings and randomized comments with anonymous tokens (e.g., #TOK-7721). Furthermore, ratings are only unlocked after semester exam grade submissions are finalized.',
      icon: ShieldCheck,
    },
    {
      q: 'Can I edit or delete my feedback once submitted?',
      a: 'To maintain academic integrity, once an evaluation token is created and committed, ratings cannot be altered. You can, however, view your submitted tokens in your Feedback History tab.',
      icon: Lock,
    },
    {
      q: 'Who has access to the university-wide administrative reports?',
      a: 'Only authorized university administrators (Dean of Academics, Quality Assurance Cell, and Department Heads) have access to campus-wide ranking leaderboards and institutional analytics.',
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Academic governance, anonymous token architecture, and AI analysis transparency.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-9 leading-relaxed">
                {faq.a}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
