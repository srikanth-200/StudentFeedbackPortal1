import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    window.open('/api/admin/reports/export?format=csv', '_blank');
    setDownloadMsg('Institutional CSV Report generated and downloaded.');
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  const handleDownloadJSON = () => {
    window.open('/api/admin/reports/export?format=json', '_blank');
    setDownloadMsg('Comprehensive JSON Audit archive downloaded.');
    setTimeout(() => setDownloadMsg(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Institutional Audit & Export Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official feedback summaries, departmental performance data, and NAAC/ABET accreditation packs.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Print Audit Sheet</span>
        </button>
      </div>

      {downloadMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CSV Raw Data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Raw Feedback Dataset (CSV)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Includes all decoupled anonymous tokens, 9 parameter ratings, course codes, and timestamps.
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* JSON / Data Pipeline Archive */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Full Audit Archive (JSON)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete structured dataset with AI sentiment scores, emotion models, and Bayesian rankings.
            </p>
          </div>

          <button
            onClick={handleDownloadJSON}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Archive</span>
          </button>
        </div>

        {/* Accreditation Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Executive Evaluation Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Printable institutional quality audit packet ready for Academic Senate & Accreditation reviews.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Executive Sheet</span>
          </button>
        </div>
      </div>

      {/* Accreditation Audit Preview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Spring 2026 Institutional Quality Metrics Summary
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Evaluation Period</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              Spring 2026 (Active)
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Campus Feedback Volume</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              1,248 Verified Submissions
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Participation Rate</span>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              78% of Enrolled Students
            </p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Mean Institutional Score</span>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              4.2 / 5.0 (Standard Deviation: 0.38)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
