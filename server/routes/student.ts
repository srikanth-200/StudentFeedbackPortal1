import { Router, Response } from 'express';
import { db, FeedbackRecord } from '../db';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../middleware';
import { analyzeFeedbackText } from '../ai';

const router = Router();

// Apply auth middleware for all student endpoints
router.use(authenticateToken);
router.use(requireRole(['STUDENT']));

// Helper to get student record for current user
function getStudentForUser(userId: string) {
  return db.students.find(s => s.userId === userId);
}

// GET /api/student/dashboard
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const student = getStudentForUser(req.user!.id);
  if (!student) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  // Active semester
  const activeSem = db.semesters.find(s => s.isActive) || db.semesters[0];

  // Enrolled courses (CS courses for CS dept student or core offerings)
  const enrolledOfferings = db.subjects.filter(sbj => sbj.semesterId === activeSem.id);

  // Student's submissions
  const studentFeedbacks = db.feedbacks.filter(f => f.studentId === student.id && f.semesterId === activeSem.id);

  const totalSubmitted = studentFeedbacks.length;
  const totalCourses = enrolledOfferings.length;
  const pendingFeedbackCount = Math.max(0, totalCourses - totalSubmitted);
  const completedFeedbackCount = totalSubmitted;

  // Set of evaluated faculty IDs
  const evaluatedFacultyIds = new Set(studentFeedbacks.map(f => f.facultyId));

  // Build list of courses with submission status
  const coursesWithStatus = enrolledOfferings.map(offering => {
    const course = db.courses.find(c => c.id === offering.courseId);
    const faculty = db.faculty.find(f => f.id === offering.facultyId);
    const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
    const existingSubmission = studentFeedbacks.find(f => f.courseId === offering.courseId);

    return {
      offeringId: offering.id,
      courseId: offering.courseId,
      courseCode: course?.code || 'N/A',
      courseName: course?.name || 'N/A',
      credits: course?.credits || 3,
      facultyId: offering.facultyId,
      facultyName: facultyUser?.name || 'Faculty Member',
      facultyDesignation: faculty?.designation || '',
      facultyAvatar: facultyUser?.avatarUrl,
      semesterId: offering.semesterId,
      semesterName: activeSem.name,
      isSubmitted: !!existingSubmission,
      submissionDate: existingSubmission?.submittedAt,
      ratingGiven: existingSubmission?.overallRating,
    };
  });

  // Recent notifications for students
  const notifications = db.notifications
    .filter(n => n.roleTarget === 'ALL' || n.roleTarget === 'STUDENT' || n.userId === req.user!.id)
    .slice(0, 5);

  res.json({
    metrics: {
      totalFeedbackSubmitted: totalSubmitted,
      pendingFeedback: pendingFeedbackCount,
      completedFeedback: completedFeedbackCount,
      coursesCount: totalCourses,
      facultyEvaluated: evaluatedFacultyIds.size,
    },
    activeSemester: activeSem,
    courses: coursesWithStatus,
    recentFeedback: studentFeedbacks.slice(0, 5),
    notifications,
  });
});

// GET /api/student/courses
router.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  const student = getStudentForUser(req.user!.id);
  if (!student) return res.status(404).json({ error: 'Student record not found.' });

  const activeSem = db.semesters.find(s => s.isActive) || db.semesters[0];
  const offerings = db.subjects.filter(s => s.semesterId === activeSem.id);

  const courses = offerings.map(offering => {
    const course = db.courses.find(c => c.id === offering.courseId);
    const faculty = db.faculty.find(f => f.id === offering.facultyId);
    const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
    const isSubmitted = db.feedbacks.some(
      f => f.studentId === student.id && f.courseId === offering.courseId && f.semesterId === activeSem.id
    );

    return {
      id: course?.id,
      code: course?.code,
      name: course?.name,
      credits: course?.credits,
      description: course?.description,
      facultyId: faculty?.id,
      facultyName: facultyUser?.name,
      facultyEmail: facultyUser?.email,
      facultyAvatar: facultyUser?.avatarUrl,
      isSubmitted,
    };
  });

  res.json(courses);
});

// GET /api/student/faculty
router.get('/faculty', (req: AuthenticatedRequest, res: Response) => {
  const student = getStudentForUser(req.user!.id);
  if (!student) return res.status(404).json({ error: 'Student record not found.' });

  const activeSem = db.semesters.find(s => s.isActive) || db.semesters[0];
  const offerings = db.subjects.filter(s => s.semesterId === activeSem.id);

  const facultyList = offerings.map(offering => {
    const faculty = db.faculty.find(f => f.id === offering.facultyId);
    const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
    const course = db.courses.find(c => c.id === offering.courseId);
    const dept = faculty ? db.departments.find(d => d.id === faculty.departmentId) : null;

    return {
      facultyId: faculty?.id,
      name: facultyUser?.name,
      email: facultyUser?.email,
      avatarUrl: facultyUser?.avatarUrl,
      designation: faculty?.designation,
      specialization: faculty?.specialization,
      department: dept?.name,
      teachingCourse: course?.name,
      courseCode: course?.code,
    };
  });

  res.json(facultyList);
});

// POST /api/student/feedback/submit
router.post('/feedback/submit', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const student = getStudentForUser(req.user!.id);
    if (!student) return res.status(404).json({ error: 'Student record not found.' });

    const {
      facultyId,
      courseId,
      semesterId,
      ratings,
      comments,
      isAnonymous = true,
    } = req.body;

    if (!facultyId || !courseId || !semesterId) {
      return res.status(400).json({ error: 'Faculty, Course, and Semester selections are required.' });
    }

    // STRICT ENFORCEMENT: "One feedback submission per student per course per semester."
    const existing = db.feedbacks.find(
      f => f.studentId === student.id && f.courseId === courseId && f.semesterId === semesterId
    );

    if (existing) {
      return res.status(400).json({
        error: 'You have already submitted feedback for this course in this semester. Duplicate submissions are not allowed.',
      });
    }

    // Calculate overall rating from ratings object
    const numericRatings = [
      Number(ratings?.teachingQuality || 4),
      Number(ratings?.communication || 4),
      Number(ratings?.subjectKnowledge || 4),
      Number(ratings?.courseContent || 4),
      Number(ratings?.practicalKnowledge || 4),
      Number(ratings?.infrastructure || 4),
      Number(ratings?.laboratory || 4),
      Number(ratings?.library || 4),
      Number(ratings?.placements || 4),
    ];
    const overallRating = Number((numericRatings.reduce((a, b) => a + b, 0) / numericRatings.length).toFixed(2));

    // AI Sentiment Analysis on the student's open-ended comments
    const sentimentResult = await analyzeFeedbackText(comments || '', overallRating);

    // Generate secure cryptographic-like anonymous token
    const anonymousToken = `ANON-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newFeedback: FeedbackRecord = {
      id: `fb-${Date.now()}`,
      studentId: student.id,
      facultyId,
      courseId,
      semesterId,
      isAnonymous: Boolean(isAnonymous),
      anonymousToken,
      overallRating,
      ratings: {
        teachingQuality: Number(ratings?.teachingQuality || 4),
        communication: Number(ratings?.communication || 4),
        subjectKnowledge: Number(ratings?.subjectKnowledge || 4),
        courseContent: Number(ratings?.courseContent || 4),
        practicalKnowledge: Number(ratings?.practicalKnowledge || 4),
        infrastructure: Number(ratings?.infrastructure || 4),
        laboratory: Number(ratings?.laboratory || 4),
        library: Number(ratings?.library || 4),
        placements: Number(ratings?.placements || 4),
      },
      comments: comments?.trim() || '',
      sentiment: {
        sentiment: sentimentResult.sentiment,
        positiveScore: sentimentResult.positiveScore,
        neutralScore: sentimentResult.neutralScore,
        negativeScore: sentimentResult.negativeScore,
        detectedEmotion: sentimentResult.detectedEmotion,
        extractedKeywords: sentimentResult.extractedKeywords,
      },
      submittedAt: new Date().toISOString(),
    };

    db.feedbacks.unshift(newFeedback);

    // Update faculty average rating and feedback count
    const targetFaculty = db.faculty.find(f => f.id === facultyId);
    if (targetFaculty) {
      const allFacultyFeedback = db.feedbacks.filter(f => f.facultyId === facultyId);
      const totalScores = allFacultyFeedback.reduce((sum, f) => sum + f.overallRating, 0);
      targetFaculty.totalFeedbackCount = allFacultyFeedback.length;
      targetFaculty.averageRating = Number((totalScores / allFacultyFeedback.length).toFixed(2));
    }

    // Add confirmation notification
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: req.user!.id,
      roleTarget: 'STUDENT',
      title: 'Feedback Successfully Recorded',
      message: `Your anonymous feedback for course ${courseId} has been securely submitted and processed. Anonymous verification token: ${anonymousToken}.`,
      type: 'SUBMISSION',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: newFeedback.id,
        anonymousToken: newFeedback.anonymousToken,
        overallRating: newFeedback.overallRating,
        sentiment: newFeedback.sentiment,
        submittedAt: newFeedback.submittedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error submitting feedback' });
  }
});

// GET /api/student/history
router.get('/history', (req: AuthenticatedRequest, res: Response) => {
  const student = getStudentForUser(req.user!.id);
  if (!student) return res.status(404).json({ error: 'Student record not found.' });

  const history = db.feedbacks
    .filter(f => f.studentId === student.id)
    .map(f => {
      const course = db.courses.find(c => c.id === f.courseId);
      const faculty = db.faculty.find(fac => fac.id === f.facultyId);
      const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
      const sem = db.semesters.find(s => s.id === f.semesterId);

      return {
        id: f.id,
        anonymousToken: f.anonymousToken,
        courseCode: course?.code || 'N/A',
        courseName: course?.name || 'N/A',
        facultyName: facultyUser?.name || 'Faculty Member',
        facultyDesignation: faculty?.designation,
        semesterName: sem?.name || 'Current',
        overallRating: f.overallRating,
        ratings: f.ratings,
        comments: f.comments,
        sentiment: f.sentiment,
        submittedAt: f.submittedAt,
        isAnonymous: f.isAnonymous,
      };
    });

  res.json(history);
});

// GET /api/student/profile
router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const student = getStudentForUser(user.id);
  const dept = student ? db.departments.find(d => d.id === student.departmentId) : null;

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    rollNumber: student?.rollNumber,
    department: dept?.name,
    departmentCode: dept?.code,
    batchYear: student?.batchYear,
    currentSemester: student?.currentSemester,
    academicYear: student?.academicYear,
  });
});

// PUT /api/student/profile
router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, avatarUrl } = req.body;

  if (name) user.name = name.trim();
  if (avatarUrl) user.avatarUrl = avatarUrl;

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });
});

export default router;
