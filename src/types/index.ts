export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
}

export interface StudentProfile {
  id: string;
  rollNumber: string;
  department: string;
  departmentCode: string;
  batchYear: string;
  currentSemester: number;
  academicYear: string;
}

export interface FacultyProfile {
  id: string;
  employeeCode: string;
  departmentId: string;
  departmentName?: string;
  designation: string;
  specialization: string;
  averageRating: number;
  totalFeedbackCount: number;
}

export interface CourseOffering {
  offeringId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  facultyId: string;
  facultyName: string;
  facultyDesignation?: string;
  facultyAvatar?: string;
  semesterId: string;
  semesterName: string;
  isSubmitted: boolean;
  submissionDate?: string;
  ratingGiven?: number;
}

export interface FeedbackSubmissionPayload {
  facultyId: string;
  courseId: string;
  semesterId: string;
  ratings: {
    teachingQuality: number;
    communication: number;
    subjectKnowledge: number;
    courseContent: number;
    practicalKnowledge: number;
    infrastructure: number;
    laboratory: number;
    library: number;
    placements: number;
  };
  comments: string;
  isAnonymous: boolean;
}

export interface SentimentAnalysis {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  detectedEmotion: string;
  extractedKeywords: string[];
}

export interface FeedbackItem {
  id: string;
  anonymousToken: string;
  courseCode?: string;
  courseName?: string;
  facultyName?: string;
  departmentName?: string;
  semesterName?: string;
  overallRating: number;
  ratings?: Record<string, number>;
  comments: string;
  sentiment: SentimentAnalysis;
  submittedAt: string;
  isAnonymous?: boolean;
}

export interface FacultyRankingItem {
  rank: number;
  id: string;
  name: string;
  department: string;
  averageRating: number;
  totalFeedback: number;
  trend: 'up' | 'steady' | 'down';
  sparkline: number[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'CYCLE' | 'DEADLINE' | 'SUBMISSION' | 'REPORT' | 'ANNOUNCEMENT' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}

export interface AdminMetrics {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalFeedback: number;
  averageRating: number;
  responseRate: number;
  positiveFeedback: number;
  neutralFeedback: number;
  negativeFeedback: number;
  trends: {
    totalFeedbackChange: string;
    avgRatingChange: string;
    responseRateChange: string;
    coursesChange: string;
  };
}
