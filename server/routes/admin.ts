import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, User } from '../db';
import { AuthenticatedRequest, authenticateToken, requireRole } from '../middleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole(['ADMIN']));

// GET /api/admin/dashboard
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  const metrics = db.getAdminMetrics();
  const ratingsOverTime = db.getRatingsOverTime();
  const facultyRankings = db.getFacultyRankings().slice(0, 5);
  const categoryRatings = db.getCategoryRatings();
  const emotionDistribution = db.getEmotionDistribution();
  const keywords = db.getKeywordsCloud();

  // Course performance list
  const coursePerformance = db.courses.slice(0, 6).map((c, i) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    credits: c.credits,
    averageRating: [4.7, 4.4, 4.2, 4.5, 4.1, 4.3][i % 6],
    feedbackCount: [142, 118, 96, 128, 84, 102][i % 6],
    sentimentPositive: [74, 68, 62, 70, 58, 64][i % 6],
  }));

  res.json({
    metrics,
    ratingsOverTime,
    facultyRankings,
    coursePerformance,
    categoryRatings,
    sentimentDistribution: {
      positive: metrics.positiveFeedback,
      neutral: metrics.neutralFeedback,
      negative: metrics.negativeFeedback,
    },
    emotionDistribution,
    keywords,
    recentFeedback: db.feedbacks.slice(0, 8).map(f => {
      const course = db.courses.find(c => c.id === f.courseId);
      const faculty = db.faculty.find(fac => fac.id === f.facultyId);
      const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
      return {
        id: f.id,
        anonymousToken: f.anonymousToken,
        courseCode: course?.code,
        facultyName: facultyUser?.name,
        rating: f.overallRating,
        sentiment: f.sentiment,
        comments: f.comments,
        submittedAt: f.submittedAt,
      };
    }),
  });
});

// GET /api/admin/users
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  const usersList = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    status: u.status,
    lastLogin: u.lastLogin,
    createdAt: u.createdAt,
  }));
  res.json(usersList);
});

// POST /api/admin/users (Add user)
router.post('/users', (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role, status = 'ACTIVE' } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: 'A user with this email already exists.' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: bcrypt.hashSync(password, 8),
    role,
    status,
    createdAt: new Date().toISOString(),
  };

  db.users.unshift(newUser);

  // If faculty or student, create corresponding entity
  if (role === 'FACULTY') {
    db.faculty.push({
      id: `fac-${Date.now()}`,
      userId: newUser.id,
      employeeCode: `FAC-${Math.floor(100 + Math.random() * 900)}`,
      departmentId: req.body.departmentId || 'dept-cs',
      designation: req.body.designation || 'Assistant Professor',
      specialization: req.body.specialization || 'Computer Science',
      averageRating: 4.0,
      totalFeedbackCount: 0,
    });
  } else if (role === 'STUDENT') {
    db.students.push({
      id: `stu-${Date.now()}`,
      userId: newUser.id,
      rollNumber: req.body.rollNumber || `2024-STU-${Math.floor(100 + Math.random() * 900)}`,
      departmentId: req.body.departmentId || 'dept-cs',
      batchYear: '2024-2028',
      currentSemester: 4,
      academicYear: '2025-2026',
    });
  }

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

// PUT /api/admin/users/:id (Edit user / status toggle)
router.put('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { name, email, role, status, password } = req.body;
  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (role) user.role = role;
  if (status) user.status = status;
  if (password) user.passwordHash = bcrypt.hashSync(password, 8);

  res.json({ message: 'User updated successfully', user });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found.' });

  const [removed] = db.users.splice(index, 1);
  // Also clean up dependent student / faculty
  db.students = db.students.filter(s => s.userId !== removed.id);
  db.faculty = db.faculty.filter(f => f.userId !== removed.id);

  res.json({ message: 'User deleted successfully' });
});

// GET /api/admin/faculty
router.get('/faculty', (req: AuthenticatedRequest, res: Response) => {
  const facultyList = db.faculty.map(f => {
    const user = db.users.find(u => u.id === f.userId);
    const dept = db.departments.find(d => d.id === f.departmentId);
    return {
      id: f.id,
      userId: f.userId,
      name: user?.name || 'Faculty Member',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl,
      employeeCode: f.employeeCode,
      departmentId: f.departmentId,
      departmentName: dept?.name || 'N/A',
      designation: f.designation,
      specialization: f.specialization,
      averageRating: f.averageRating,
      totalFeedbackCount: f.totalFeedbackCount,
      status: user?.status || 'ACTIVE',
    };
  });
  res.json(facultyList);
});

// GET /api/admin/students
router.get('/students', (req: AuthenticatedRequest, res: Response) => {
  const studentsList = db.students.map(s => {
    const user = db.users.find(u => u.id === s.userId);
    const dept = db.departments.find(d => d.id === s.departmentId);
    const feedbackCount = db.feedbacks.filter(f => f.studentId === s.id).length;
    return {
      id: s.id,
      userId: s.userId,
      name: user?.name || 'Student',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl,
      rollNumber: s.rollNumber,
      departmentId: s.departmentId,
      departmentName: dept?.name || 'N/A',
      batchYear: s.batchYear,
      currentSemester: s.currentSemester,
      academicYear: s.academicYear,
      feedbackSubmittedCount: feedbackCount,
      status: user?.status || 'ACTIVE',
    };
  });
  res.json(studentsList);
});

// CRUD Courses
router.get('/courses', (req: AuthenticatedRequest, res: Response) => {
  const list = db.courses.map(c => {
    const dept = db.departments.find(d => d.id === c.departmentId);
    const offerings = db.subjects.filter(s => s.courseId === c.id);
    return {
      ...c,
      departmentName: dept?.name,
      assignedFacultyCount: offerings.length,
    };
  });
  res.json(list);
});

router.post('/courses', (req: AuthenticatedRequest, res: Response) => {
  const { code, name, departmentId, credits, semesterNumber, description } = req.body;
  if (!code || !name || !departmentId) {
    return res.status(400).json({ error: 'Code, name, and department are required.' });
  }

  const newCourse = {
    id: `crs-${Date.now()}`,
    code: code.trim(),
    name: name.trim(),
    departmentId,
    credits: Number(credits || 3),
    semesterNumber: Number(semesterNumber || 1),
    description: description || '',
  };
  db.courses.push(newCourse);
  res.status(201).json({ message: 'Course created successfully', course: newCourse });
});

// CRUD Departments
router.get('/departments', (req: AuthenticatedRequest, res: Response) => {
  const list = db.departments.map(d => {
    const facCount = db.faculty.filter(f => f.departmentId === d.id).length;
    const crsCount = db.courses.filter(c => c.departmentId === d.id).length;
    return {
      ...d,
      facultyCount: facCount,
      courseCount: crsCount,
    };
  });
  res.json(list);
});

router.post('/departments', (req: AuthenticatedRequest, res: Response) => {
  const { code, name, headOfDept, description } = req.body;
  if (!code || !name) {
    return res.status(400).json({ error: 'Department code and name are required.' });
  }
  const newDept = {
    id: `dept-${Date.now()}`,
    code: code.trim(),
    name: name.trim(),
    headOfDept: headOfDept || '',
    description: description || '',
  };
  db.departments.push(newDept);
  res.status(201).json({ message: 'Department created successfully', department: newDept });
});

// CRUD Semesters
router.get('/semesters', (req: AuthenticatedRequest, res: Response) => {
  res.json(db.semesters);
});

router.post('/semesters', (req: AuthenticatedRequest, res: Response) => {
  const { name, code, academicYear, startDate, endDate, isActive } = req.body;
  const newSem = {
    id: `sem-${Date.now()}`,
    name,
    code,
    academicYear,
    startDate,
    endDate,
    isActive: Boolean(isActive),
  };
  if (newSem.isActive) {
    db.semesters.forEach(s => s.isActive = false);
  }
  db.semesters.unshift(newSem);
  res.status(201).json(newSem);
});

// Feedback Management with filters
router.get('/feedback', (req: AuthenticatedRequest, res: Response) => {
  const { departmentId, courseId, facultyId, sentiment, search } = req.query;

  let filtered = db.feedbacks;

  if (courseId) {
    filtered = filtered.filter(f => f.courseId === courseId);
  }
  if (facultyId) {
    filtered = filtered.filter(f => f.facultyId === facultyId);
  }
  if (sentiment) {
    filtered = filtered.filter(f => f.sentiment?.sentiment === sentiment);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(f =>
      f.comments.toLowerCase().includes(q) ||
      f.anonymousToken.toLowerCase().includes(q)
    );
  }

  const enriched = filtered.map(f => {
    const course = db.courses.find(c => c.id === f.courseId);
    const faculty = db.faculty.find(fac => fac.id === f.facultyId);
    const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
    const dept = faculty ? db.departments.find(d => d.id === faculty.departmentId) : null;

    return {
      id: f.id,
      anonymousToken: f.anonymousToken,
      courseCode: course?.code,
      courseName: course?.name,
      facultyName: facultyUser?.name,
      departmentName: dept?.name,
      overallRating: f.overallRating,
      ratings: f.ratings,
      comments: f.comments,
      sentiment: f.sentiment,
      submittedAt: f.submittedAt,
    };
  });

  res.json(enriched);
});

// AI Insights Page endpoint
router.get('/ai-insights', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    overallSentiment: {
      positive: 62,
      neutral: 25,
      negative: 13,
    },
    emotions: db.getEmotionDistribution(),
    keywords: db.getKeywordsCloud(),
    majorConcerns: [
      { topic: 'Workload Clashes', description: 'Coincidence of lab submissions with mid-term written exam schedules in Week 7 & 8.' },
      { topic: 'Lab GPU Compute Resources', description: 'High wait times for batch training runs on deep learning workstations.' },
      { topic: 'Air Conditioning Maintenance', description: 'Intermittent HVAC noise and cooling in Block B lecture halls.' }
    ],
    positiveThemes: [
      { topic: 'Teaching Pedagogical Clarity', description: 'Faculty commended for interactive problem-solving and structured slide decks.' },
      { topic: 'Faculty Mentorship Accessibility', description: 'High appreciation for prompt responses on discussion forums and office hours.' },
      { topic: 'Placement Industry Relevance', description: 'Mock interviews and technical bootcamps significantly boosted student confidence.' }
    ],
    facultySuggestions: [
      'Incorporate 10-minute live coding recaps at the start of complex algorithm lectures.',
      'Stagger programming project deadlines to avoid mid-term exam crunches.',
      'Offer optional advanced bonus modules for students aiming for research publications.'
    ],
    courseSuggestions: [
      'Upgrade CS-301 lab image containers with pre-installed PyTorch CUDA runtimes.',
      'Introduce additional hardware debugging kits in EC-301 Embedded Systems labs.',
      'Extend library digital checkout periods for high-demand core textbooks.'
    ]
  });
});

// Faculty Rankings
router.get('/rankings', (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getFacultyRankings());
});

// Reports generation endpoint
router.get('/reports/export', (req: AuthenticatedRequest, res: Response) => {
  const { format = 'csv', scope = 'ALL' } = req.query;

  if (format === 'csv') {
    let csv = 'Submission ID,Anonymous Token,Course Code,Course Name,Faculty,Department,Rating,Teaching,Communication,Subject Knowledge,Sentiment,Emotion,Comments,Date\n';
    db.feedbacks.forEach(f => {
      const course = db.courses.find(c => c.id === f.courseId);
      const faculty = db.faculty.find(fac => fac.id === f.facultyId);
      const facultyUser = faculty ? db.users.find(u => u.id === faculty.userId) : null;
      const dept = faculty ? db.departments.find(d => d.id === faculty.departmentId) : null;
      const cleanComments = (f.comments || '').replace(/"/g, '""').replace(/\n/g, ' ');

      csv += `"${f.id}","${f.anonymousToken}","${course?.code || ''}","${course?.name || ''}","${facultyUser?.name || ''}","${dept?.name || ''}","${f.overallRating}","${f.ratings?.teachingQuality || 4}","${f.ratings?.communication || 4}","${f.ratings?.subjectKnowledge || 4}","${f.sentiment?.sentiment || 'POSITIVE'}","${f.sentiment?.detectedEmotion || 'Satisfaction'}","${cleanComments}","${f.submittedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="institutional_feedback_report_${Date.now()}.csv"`);
    return res.send(csv);
  }

  res.json({
    reportTitle: 'Institutional Student Feedback Comprehensive Audit',
    metrics: db.getAdminMetrics(),
    rankings: db.getFacultyRankings(),
    categories: db.getCategoryRatings(),
    totalRecords: db.feedbacks.length,
    generatedAt: new Date().toISOString(),
  });
});

// System Settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  res.json(db.systemSettings);
});

router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  Object.assign(db.systemSettings, req.body);
  res.json({ message: 'Settings saved successfully', settings: db.systemSettings });
});

// Notifications
router.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  res.json(db.notifications);
});

router.post('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const { title, message, roleTarget = 'ALL', type = 'ANNOUNCEMENT' } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required.' });
  }

  const newNotif = {
    id: `notif-${Date.now()}`,
    roleTarget,
    title: title.trim(),
    message: message.trim(),
    type,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(newNotif);
  res.status(201).json(newNotif);
});

export default router;
