import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CourseOffering } from '../../types';
import {
  Star,
  ShieldCheck,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  User,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';

interface SubmitFeedbackViewProps {
  preselectedOfferingId?: string;
  onSuccess: () => void;
  onViewHistory: () => void;
}

const RATING_CRITERIA = [
  { key: 'teachingQuality', label: 'Teaching Quality', desc: 'Clarity of explanations, engagement, and lecture organization' },
  { key: 'communication', label: 'Communication & Approachability', desc: 'Prompt doubt resolution, responsiveness, and openness' },
  { key: 'subjectKnowledge', label: 'Subject Knowledge', desc: 'Depth of technical competence and domain mastery' },
  { key: 'courseContent', label: 'Course Content & Syllabus', desc: 'Relevance, modern curriculum alignment, and materials' },
  { key: 'practicalKnowledge', label: 'Practical / Hands-on Learning', desc: 'Lab experiments, real-world case studies, and exercises' },
  { key: 'infrastructure', label: 'Classroom Infrastructure', desc: 'Audio-visual clarity, seating comfort, and room environment' },
  { key: 'laboratory', label: 'Laboratory Facilities', desc: 'Computer/hardware availability, tool setups, and software' },
  { key: 'library', label: 'Library & Learning Resources', desc: 'Reference textbooks, digital IEEE access, and study materials' },
  { key: 'placements', label: 'Placement & Career Alignment', desc: 'Industry readiness, interview tips, and skills relevance' },
];

export const SubmitFeedbackView: React.FC<SubmitFeedbackViewProps> = ({
  preselectedOfferingId,
  onSuccess,
  onViewHistory,
}) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<CourseOffering[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [semesterId, setSemesterId] = useState<string>('sem-sp26');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [comments, setComments] = useState<string>('');

  const [ratings, setRatings] = useState<Record<string, number>>({
    teachingQuality: 5,
    communication: 4,
    subjectKnowledge: 5,
    courseContent: 4,
    practicalKnowledge: 4,
    infrastructure: 4,
    laboratory: 4,
    library: 4,
    placements: 4,
  });

  const [hoveredStar, setHoveredStar] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);

  // Fetch available courses
  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          if (preselectedOfferingId) {
            const found = data.courses.find((c: any) => c.offeringId === preselectedOfferingId || c.courseId === preselectedOfferingId);
            if (found) setSelectedCourseId(found.courseId);
          } else if (data.courses.length > 0) {
            // Select first pending course by default
            const pending = data.courses.find((c: any) => !c.isSubmitted);
            setSelectedCourseId(pending ? pending.courseId : data.courses[0].courseId);
          }
        }
      } catch (e) {
        console.error('Failed to load courses for feedback:', e);
      }
    }
    loadDashboard();
  }, [token, preselectedOfferingId]);

  const currentCourse = courses.find(c => c.courseId === selectedCourseId);

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const calculateOverallAverage = () => {
    const values = Object.values(ratings) as number[];
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / (values.length || 1)).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) {
      setError('Please select a course to evaluate.');
      return;
    }
    if (currentCourse.isSubmitted) {
      setError('You have already submitted feedback for this course this semester. Duplicate submissions are strictly forbidden.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        facultyId: currentCourse.facultyId,
        courseId: currentCourse.courseId,
        semesterId: currentCourse.semesterId || semesterId,
        ratings,
        comments,
        isAnonymous,
      };

      const res = await fetch('/api/student/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmittedResult(data.feedback);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedResult) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Feedback Submitted Successfully!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Thank you for helping improve academic excellence. Your ratings have been aggregated into the institutional analytics.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Course Evaluated:
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentCourse?.courseCode} - {currentCourse?.courseName}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Anonymous Verification Token:
              </span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {submittedResult.anonymousToken}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Overall Rating Given:
              </span>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> {submittedResult.overallRating} / 5.0
              </span>
            </div>

            {submittedResult.sentiment && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  AI Sentiment Classification:
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {submittedResult.sentiment.sentiment} ({submittedResult.sentiment.detectedEmotion})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmittedResult(null);
                setComments('');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              Submit Another Course
            </button>
            <button
              onClick={onViewHistory}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>View Feedback History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" /> Anonymous Evaluation System
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Course & Faculty Feedback Form
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
              Provide honest, constructive feedback. Your identity is separated from the evaluation to ensure complete confidentiality.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/20 text-center min-w-[140px]">
            <span className="text-[11px] text-emerald-100 uppercase tracking-wider block font-semibold">
              Live Average
            </span>
            <div className="text-2xl font-black flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
              <span>{calculateOverallAverage()}</span>
              <span className="text-xs font-normal text-emerald-200">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course & Faculty Selection Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            1. Select Course & Instructor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Course Offered:
              </label>
              <select
                id="select-feedback-course"
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                {courses.map(c => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseCode} - {c.courseName} {c.isSubmitted ? '(Already Submitted)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Assigned Faculty:
              </label>
              <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                {currentCourse?.facultyAvatar ? (
                  <img
                    src={currentCourse.facultyAvatar}
                    alt={currentCourse.facultyName}
                    className="w-8 h-8 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentCourse?.facultyName?.charAt(0) || 'F'}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentCourse?.facultyName || 'Faculty Member'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentCourse?.facultyDesignation || 'Professor'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {currentCourse?.isSubmitted && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You have already submitted an evaluation for this course. Please select another course.</span>
            </div>
          )}
        </div>

        {/* 9 Evaluation Categories */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              2. Detailed Parameter Ratings (1 - 5 Stars)
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              1 = Poor, 5 = Excellent
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {RATING_CRITERIA.map(item => {
              const currentScore = ratings[item.key] || 0;
              const hovered = hoveredStar[item.key] || 0;
              const displayScore = hovered || currentScore;

              return (
                <div
                  key={item.key}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="max-w-md">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => {
                        const isFilled = star <= displayScore;
                        return (
                          <button
                            type="button"
                            key={star}
                            id={`star-${item.key}-${star}`}
                            onClick={() => handleRatingChange(item.key, star)}
                            onMouseEnter={() =>
                              setHoveredStar(prev => ({ ...prev, [item.key]: star }))
                            }
                            onMouseLeave={() =>
                              setHoveredStar(prev => ({ ...prev, [item.key]: 0 }))
                            }
                            className="p-1 hover:scale-115 transition-transform"
                            aria-label={`${star} stars for ${item.label}`}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-8 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                      {currentScore}.0
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Written Feedback & AI Analysis Prompt */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              3. Written Comments & Constructive Remarks
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {comments.length} characters (Min 10 recommended)
            </span>
          </div>

          <textarea
            id="feedback-comments-input"
            rows={4}
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Share specific observations on lectures, lab demonstrations, syllabus pacing, or faculty support. Constructive comments directly assist instructors and academic leadership in refining course modules."
            className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />

          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/40 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              <strong>AI Academic Insight Engine:</strong> Comments are analyzed for sentiment, emotion, and topical keywords to extract actionable institutional recommendations without ever revealing the student's personal identity.
            </p>
          </div>
        </div>

        {/* Anonymous Submission & Terms */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="checkbox-is-anonymous"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Submit Anonymously (Recommended)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-lg mt-0.5">
                Faculty dashboards will display only aggregate statistics and anonymized token identifiers. Your name and roll number remain completely confidential.
              </p>
            </div>
          </label>

          <button
            type="submit"
            id="btn-submit-feedback"
            disabled={isSubmitting || currentCourse?.isSubmitted}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Analyzing & Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Evaluation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
