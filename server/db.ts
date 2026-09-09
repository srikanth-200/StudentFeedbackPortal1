import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDept: string;
  description: string;
}

export interface FacultyRecord {
  id: string;
  userId: string;
  employeeCode: string;
  departmentId: string;
  designation: string;
  specialization: string;
  averageRating: number;
  totalFeedbackCount: number;
}

export interface StudentRecord {
  id: string;
  userId: string;
  rollNumber: string;
  departmentId: string;
  batchYear: string;
  currentSemester: number;
  academicYear: string;
}

export interface Semester {
  id: string;
  name: string;
  code: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  credits: number;
  semesterNumber: number;
  description: string;
}

export interface SubjectOffering {
  id: string;
  courseId: string;
  facultyId: string;
  semesterId: string;
  academicYear: string;
}

export interface FeedbackRatingScores {
  teachingQuality: number;
  communication: number;
  subjectKnowledge: number;
  courseContent: number;
  practicalKnowledge: number;
  infrastructure: number;
  laboratory: number;
  library: number;
  placements: number;
}

export interface SentimentData {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  detectedEmotion: string;
  extractedKeywords: string[];
}

export interface FeedbackRecord {
  id: string;
  studentId: string;
  facultyId: string;
  courseId: string;
  semesterId: string;
  isAnonymous: boolean;
  anonymousToken: string;
  overallRating: number;
  ratings: FeedbackRatingScores;
  comments: string;
  sentiment: SentimentData;
  submittedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget: 'ALL' | 'STUDENT' | 'FACULTY' | 'ADMIN';
  title: string;
  message: string;
  type: 'CYCLE' | 'DEADLINE' | 'SUBMISSION' | 'REPORT' | 'ANNOUNCEMENT' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

// In-Memory Relational Database Instance
class DatabaseStore {
  users: User[] = [];
  departments: Department[] = [];
  faculty: FacultyRecord[] = [];
  students: StudentRecord[] = [];
  semesters: Semester[] = [];
  courses: Course[] = [];
  subjects: SubjectOffering[] = [];
  feedbacks: FeedbackRecord[] = [];
  notifications: NotificationItem[] = [];
  auditLogs: AuditLog[] = [];
  systemSettings = {
    collegeName: 'National Institute of Engineering & Technology',
    academicYear: '2025-2026',
    activeSemesterId: 'sem-2026-spring',
    allowAnonymousFeedback: true,
    requireAllCriteriaRatings: true,
    feedbackSubmissionDeadline: '2026-05-15',
    sentimentEngineVersion: 'Gemini 3.8 Flash Hybrid NLP',
    autoSummarizeThreshold: 5,
  };

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    const defaultPasswordHash = bcrypt.hashSync('demo1234', 8);

    // Departments
    this.departments = [
      { id: 'dept-cs', code: 'CSE', name: 'Computer Science & Engineering', headOfDept: 'Dr. Arvind Rao', description: 'Algorithms, AI, Systems, and Software Engineering' },
      { id: 'dept-ece', code: 'ECE', name: 'Electronics & Communication', headOfDept: 'Dr. Sunita Deshmukh', description: 'Embedded Systems, VLSI, IoT and Signal Processing' },
      { id: 'dept-me', code: 'MECH', name: 'Mechanical Engineering', headOfDept: 'Dr. Rajesh Kulkarni', description: 'Robotics, Mechatronics, CAD/CAM and Thermodynamics' },
      { id: 'dept-it', code: 'IT', name: 'Information Technology', headOfDept: 'Dr. Monica Sen', description: 'Cloud Computing, DevOps, Cybersecurity and Web Systems' },
      { id: 'dept-ce', code: 'CIVIL', name: 'Civil Engineering', headOfDept: 'Dr. H. N. Murthy', description: 'Structural Dynamics, Materials and Green Infrastructure' },
      { id: 'dept-mgmt', code: 'MBA', name: 'Department of Management', headOfDept: 'Dr. Shalini Mehta', description: 'Business Analytics, Operations, Finance and Strategy' }
    ];

    // Semesters
    this.semesters = [
      { id: 'sem-2026-spring', name: 'Spring 2026', code: 'SEM-SP26', academicYear: '2025-2026', startDate: '2026-01-10', endDate: '2026-05-30', isActive: true },
      { id: 'sem-2025-fall', name: 'Fall 2025', code: 'SEM-FA25', academicYear: '2025-2026', startDate: '2025-08-01', endDate: '2025-12-20', isActive: false },
      { id: 'sem-2025-spring', name: 'Spring 2025', code: 'SEM-SP25', academicYear: '2024-2025', startDate: '2025-01-10', endDate: '2025-05-28', isActive: false }
    ];

    // Core Admin User
    this.users.push({
      id: 'usr-admin',
      name: 'Dr. Meenakshi Sundaram',
      email: 'admin@feedback.edu',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
    });

    // Faculty definitions matching the uploaded image and user prompt
    const facultyData = [
      { id: 'fac-1', userId: 'usr-fac-1', name: 'Dr. Anil Kumar', email: 'anil.kumar@feedback.edu', deptId: 'dept-cs', designation: 'Professor & Head', specialization: 'Machine Learning & Neural Networks', rating: 4.8, count: 156, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-2', userId: 'usr-fac-2', name: 'Dr. Priya Sharma', email: 'priya.sharma@feedback.edu', deptId: 'dept-ece', designation: 'Associate Professor', specialization: 'Embedded IoT & Signal Processing', rating: 4.6, count: 142, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-3', userId: 'usr-fac-3', name: 'Dr. Rohan Verma', email: 'rohan.verma@feedback.edu', deptId: 'dept-me', designation: 'Associate Professor', specialization: 'Robotics & Automation Systems', rating: 4.5, count: 118, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-4', userId: 'usr-fac-4', name: 'Dr. Neha Singh', email: 'neha.singh@feedback.edu', deptId: 'dept-it', designation: 'Assistant Professor', specialization: 'Cloud Computing & Distributed Systems', rating: 4.3, count: 110, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-5', userId: 'usr-fac-5', name: 'Dr. Mohit Patel', email: 'mohit.patel@feedback.edu', deptId: 'dept-ce', designation: 'Assistant Professor', specialization: 'Smart Infrastructure & Structural Dynamics', rating: 4.1, count: 98, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-6', userId: 'usr-fac-6', name: 'Dr. Sunita Deshmukh', email: 'sunita.deshmukh@feedback.edu', deptId: 'dept-ece', designation: 'Professor', specialization: 'VLSI Design & Microelectronics', rating: 4.0, count: 88, avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-7', userId: 'usr-fac-7', name: 'Dr. Rajesh Kulkarni', email: 'rajesh.kulkarni@feedback.edu', deptId: 'dept-me', designation: 'Professor', specialization: 'Fluid Dynamics & Thermodynamics', rating: 3.9, count: 84, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-8', userId: 'usr-fac-8', name: 'Dr. Monica Sen', email: 'monica.sen@feedback.edu', deptId: 'dept-it', designation: 'Associate Professor', specialization: 'Cybersecurity & Cryptography', rating: 3.8, count: 76, avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-9', userId: 'usr-fac-9', name: 'Dr. Shalini Mehta', email: 'shalini.mehta@feedback.edu', deptId: 'dept-mgmt', designation: 'Dean & Professor', specialization: 'Strategic Management & Leadership', rating: 4.4, count: 92, avatar: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=150&auto=format&fit=crop&q=80' },
      { id: 'fac-10', userId: 'usr-fac-10', name: 'Dr. Arvind Rao', email: 'arvind.rao@feedback.edu', deptId: 'dept-cs', designation: 'Senior Professor', specialization: 'Distributed Systems & Database Architectures', rating: 4.7, count: 125, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' }
    ];

    facultyData.forEach((f, idx) => {
      this.users.push({
        id: f.userId,
        name: f.name,
        email: f.email,
        passwordHash: defaultPasswordHash,
        role: 'FACULTY',
        avatarUrl: f.avatar,
        status: 'ACTIVE',
        createdAt: '2025-01-01T00:00:00Z',
      });
      this.faculty.push({
        id: f.id,
        userId: f.userId,
        employeeCode: `FAC-${100 + idx}`,
        departmentId: f.deptId,
        designation: f.designation,
        specialization: f.specialization,
        averageRating: f.rating,
        totalFeedbackCount: f.count,
      });
    });

    // Primary Student User
    this.users.push({
      id: 'usr-student-1',
      name: 'Aarav Gupta',
      email: 'student@feedback.edu',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
    });

    this.students.push({
      id: 'stu-1',
      userId: 'usr-student-1',
      rollNumber: '2023-CS-042',
      departmentId: 'dept-cs',
      batchYear: '2023-2027',
      currentSemester: 6,
      academicYear: '2025-2026',
    });

    // Additional sample student users
    const sampleStudents = [
      { id: 'stu-2', userId: 'usr-stu-2', name: 'Rhea Chakraborty', email: 'rhea.c@feedback.edu', roll: '2023-CS-043', deptId: 'dept-cs' },
      { id: 'stu-3', userId: 'usr-stu-3', name: 'Vikramaditya Bose', email: 'vikram.b@feedback.edu', roll: '2023-EC-012', deptId: 'dept-ece' },
      { id: 'stu-4', userId: 'usr-stu-4', name: 'Ananya Deshpande', email: 'ananya.d@feedback.edu', roll: '2023-ME-029', deptId: 'dept-me' },
      { id: 'stu-5', userId: 'usr-stu-5', name: 'Kabir Nambiar', email: 'kabir.n@feedback.edu', roll: '2023-IT-055', deptId: 'dept-it' }
    ];

    sampleStudents.forEach((s) => {
      this.users.push({
        id: s.userId,
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: '2025-01-01T00:00:00Z',
      });
      this.students.push({
        id: s.id,
        userId: s.userId,
        rollNumber: s.roll,
        departmentId: s.deptId,
        batchYear: '2023-2027',
        currentSemester: 6,
        academicYear: '2025-2026',
      });
    });

    // Courses (42 courses total represented; 12 detailed active courses)
    this.courses = [
      { id: 'crs-cs301', code: 'CS-301', name: 'Advanced Deep Learning & AI', departmentId: 'dept-cs', credits: 4, semesterNumber: 6, description: 'Neural architecture design, transformers, LLM tuning and computer vision applications.' },
      { id: 'crs-cs302', code: 'CS-302', name: 'Cloud Computing & DevOps', departmentId: 'dept-cs', credits: 4, semesterNumber: 6, description: 'Microservices architecture, Docker containers, Kubernetes cluster management and CI/CD pipelines.' },
      { id: 'crs-cs303', code: 'CS-303', name: 'Distributed Systems & Microservices', departmentId: 'dept-cs', credits: 3, semesterNumber: 6, description: 'Consensus algorithms, Raft, Paxos, Kafka message streaming and fault tolerance.' },
      { id: 'crs-ec301', code: 'EC-301', name: 'Embedded Systems & IoT Architectures', departmentId: 'dept-ece', credits: 4, semesterNumber: 6, description: 'ARM Cortex programming, RTOS scheduling, wireless sensor networks and MQTT communication.' },
      { id: 'crs-ec302', code: 'EC-302', name: 'Digital VLSI Design', departmentId: 'dept-ece', credits: 3, semesterNumber: 6, description: 'CMOS logic, FPGA synthesis, Verilog HDL modeling and timing closure.' },
      { id: 'crs-me301', code: 'ME-301', name: 'Robotics & Mechatronics Automation', departmentId: 'dept-me', credits: 4, semesterNumber: 6, description: 'Forward & inverse kinematics, dynamic modeling, ROS 2 integration and computer vision.' },
      { id: 'crs-me302', code: 'ME-302', name: 'Thermal Engineering & Energy Systems', departmentId: 'dept-me', credits: 3, semesterNumber: 6, description: 'Rankine cycles, heat exchangers, renewable energy storage and computational fluid dynamics.' },
      { id: 'crs-it301', code: 'IT-301', name: 'Modern Full-Stack Engineering', departmentId: 'dept-it', credits: 4, semesterNumber: 6, description: 'React, Node.js, GraphQL, scalable database designs and REST API security.' },
      { id: 'crs-it302', code: 'IT-302', name: 'Cybersecurity & Threat Intelligence', departmentId: 'dept-it', credits: 3, semesterNumber: 6, description: 'Penetration testing, cryptographic protocols, zero-trust network architectures and ethical hacking.' },
      { id: 'crs-ce301', code: 'CE-301', name: 'Smart Infrastructure & Structural Dynamics', departmentId: 'dept-ce', credits: 4, semesterNumber: 6, description: 'Seismic mitigation, smart sensors in bridges, BIM modeling and sustainable concrete design.' },
      { id: 'crs-mg301', code: 'MG-301', name: 'Data-Driven Business Analytics', departmentId: 'dept-mgmt', credits: 3, semesterNumber: 6, description: 'Predictive modeling, marketing analytics, executive decision frameworks and KPI visualization.' },
      { id: 'crs-mg302', code: 'MG-302', name: 'Technology Entrepreneurship & Product Management', departmentId: 'dept-mgmt', credits: 3, semesterNumber: 6, description: 'Product discovery, Lean startup validation, venture finance and intellectual property.' }
    ];

    // Subject Offerings
    this.subjects = [
      { id: 'sbj-1', courseId: 'crs-cs301', facultyId: 'fac-1', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-2', courseId: 'crs-cs302', facultyId: 'fac-4', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-3', courseId: 'crs-cs303', facultyId: 'fac-10', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-4', courseId: 'crs-ec301', facultyId: 'fac-2', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-5', courseId: 'crs-ec302', facultyId: 'fac-6', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-6', courseId: 'crs-me301', facultyId: 'fac-3', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-7', courseId: 'crs-it301', facultyId: 'fac-4', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-8', courseId: 'crs-ce301', facultyId: 'fac-5', semesterId: 'sem-2026-spring', academicYear: '2025-2026' },
      { id: 'sbj-9', courseId: 'crs-mg301', facultyId: 'fac-9', semesterId: 'sem-2026-spring', academicYear: '2025-2026' }
    ];

    // Notifications
    this.notifications = [
      {
        id: 'notif-1',
        roleTarget: 'ALL',
        title: 'Spring 2026 Mid-Semester Feedback Window Open',
        message: 'The official feedback portal is open for all departments. Your ratings and anonymous reviews help us maintain high academic standards.',
        type: 'CYCLE',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'notif-2',
        roleTarget: 'STUDENT',
        title: 'Feedback Submission Deadline: 10 Days Remaining',
        message: 'Please submit feedback for your enrolled courses and campus facilities before the evaluation window closes.',
        type: 'DEADLINE',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'notif-3',
        roleTarget: 'FACULTY',
        title: 'Spring 2026 AI Feedback Analytics Ready',
        message: 'Aggregated student ratings and AI-generated sentiment insights for Spring 2026 have been generated. Individual anonymity is strictly preserved.',
        type: 'REPORT',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'notif-4',
        roleTarget: 'ADMIN',
        title: 'Campus Participation Milestone: 1,248 Submissions',
        message: 'Student feedback volume has reached 78% participation rate across 42 active courses. Response rate is up 8% compared to last semester.',
        type: 'ALERT',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];

    // Seed Realistic Feedback Records matching:
    // 1,248 Total Feedback Records
    // 62% Positive, 25% Neutral, 13% Negative
    // Overall Average Rating: 4.2 / 5
    // Top faculty: Dr. Anil Kumar (4.8), Dr. Priya Sharma (4.6), Dr. Rohan Verma (4.5)
    this.seedRealisticFeedbacks();
  }

  private seedRealisticFeedbacks() {
    const feedbackSamples = [
      {
        comments: "Dr. Anil Kumar explains deep learning models with incredible clarity and enthusiasm. His coding walkthroughs and real-world transformer projects made abstract concepts intuitive.",
        ratings: { teachingQuality: 5, communication: 5, subjectKnowledge: 5, courseContent: 5, practicalKnowledge: 5, infrastructure: 4, laboratory: 5, library: 4, placements: 5 },
        facultyId: 'fac-1',
        courseId: 'crs-cs301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Appreciation',
        keywords: ['Teaching', 'Deep Learning', 'Projects', 'Communication', 'Clarity']
      },
      {
        comments: "The laboratory hardware is high quality, but we could benefit from more GPU compute nodes for larger training datasets. The professor's guidance is top notch.",
        ratings: { teachingQuality: 5, communication: 4, subjectKnowledge: 5, courseContent: 4, practicalKnowledge: 4, infrastructure: 4, laboratory: 4, library: 4, placements: 4 },
        facultyId: 'fac-1',
        courseId: 'crs-cs301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Satisfaction',
        keywords: ['Labs', 'Compute', 'Teaching', 'Assignments']
      },
      {
        comments: "Dr. Priya Sharma is very supportive and patient during embedded systems lab sessions. She helps debug tricky RTOS deadlocks and always provides constructive feedback.",
        ratings: { teachingQuality: 5, communication: 5, subjectKnowledge: 5, courseContent: 4, practicalKnowledge: 5, infrastructure: 4, laboratory: 4, library: 4, placements: 4 },
        facultyId: 'fac-2',
        courseId: 'crs-ec301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Appreciation',
        keywords: ['Communication', 'Embedded Systems', 'Labs', 'Practical Knowledge']
      },
      {
        comments: "Course content is comprehensive. Sometimes the pacing in week 4 felt rushed, but the supplementary video recordings helped bridge the gap.",
        ratings: { teachingQuality: 4, communication: 4, subjectKnowledge: 5, courseContent: 3, practicalKnowledge: 4, infrastructure: 4, laboratory: 4, library: 4, placements: 3 },
        facultyId: 'fac-2',
        courseId: 'crs-ec301',
        sentiment: 'NEUTRAL' as const,
        emotion: 'Confusion',
        keywords: ['Course Content', 'Pacing', 'Recordings', 'Exams']
      },
      {
        comments: "Dr. Rohan Verma's robotics sessions are hands-on and inspiring. The integration with ROS 2 and robotic arms gave us practical industry-ready competence.",
        ratings: { teachingQuality: 5, communication: 4, subjectKnowledge: 5, courseContent: 5, practicalKnowledge: 5, infrastructure: 4, laboratory: 4, library: 4, placements: 5 },
        facultyId: 'fac-3',
        courseId: 'crs-me301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Happiness',
        keywords: ['Robotics', 'Practical Knowledge', 'Industry', 'Labs']
      },
      {
        comments: "The air conditioning in lecture hall 302 was malfunctioning for two weeks during peak heat. The lecture material itself was good.",
        ratings: { teachingQuality: 4, communication: 4, subjectKnowledge: 4, courseContent: 4, practicalKnowledge: 3, infrastructure: 2, laboratory: 3, library: 4, placements: 3 },
        facultyId: 'fac-4',
        courseId: 'crs-it301',
        sentiment: 'NEGATIVE' as const,
        emotion: 'Frustration',
        keywords: ['Infrastructure', 'Classrooms', 'Comfort', 'Maintenance']
      },
      {
        comments: "Dr. Neha Singh provides clear guidelines for full-stack projects and code reviews. Would love more workshops on Kubernetes deployment.",
        ratings: { teachingQuality: 4, communication: 5, subjectKnowledge: 4, courseContent: 4, practicalKnowledge: 4, infrastructure: 4, laboratory: 4, library: 4, placements: 4 },
        facultyId: 'fac-4',
        courseId: 'crs-it301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Satisfaction',
        keywords: ['Full-Stack', 'DevOps', 'Communication', 'Assignments']
      },
      {
        comments: "Assignments took longer than expected and coincided with mid-term exams. Better calendar coordination across faculty would help balance student workload.",
        ratings: { teachingQuality: 3, communication: 3, subjectKnowledge: 4, courseContent: 3, practicalKnowledge: 3, infrastructure: 4, laboratory: 3, library: 4, placements: 3 },
        facultyId: 'fac-5',
        courseId: 'crs-ce301',
        sentiment: 'NEUTRAL' as const,
        emotion: 'Concern',
        keywords: ['Assignments', 'Exams', 'Workload', 'Deadlines']
      },
      {
        comments: "Dr. Mohit Patel is approachable and provides good structural engineering site examples. More software training on STAAD Pro would be great.",
        ratings: { teachingQuality: 4, communication: 4, subjectKnowledge: 4, courseContent: 4, practicalKnowledge: 4, infrastructure: 4, laboratory: 4, library: 4, placements: 4 },
        facultyId: 'fac-5',
        courseId: 'crs-ce301',
        sentiment: 'POSITIVE' as const,
        emotion: 'Satisfaction',
        keywords: ['Civil Engineering', 'Practical Knowledge', 'Software', 'Teaching']
      },
      {
        comments: "The library digital catalog was down during final project research week, causing significant delays in accessing IEEE papers.",
        ratings: { teachingQuality: 3, communication: 3, subjectKnowledge: 4, courseContent: 3, practicalKnowledge: 3, infrastructure: 2, laboratory: 3, library: 1, placements: 3 },
        facultyId: 'fac-8',
        courseId: 'crs-it302',
        sentiment: 'NEGATIVE' as const,
        emotion: 'Frustration',
        keywords: ['Library', 'Digital Access', 'Infrastructure', 'Research']
      }
    ];

    // Seed 30 explicit diverse records for concrete browsing, plus virtual aggregation matching 1,248
    const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
    
    // Seed initial demo records
    for (let i = 0; i < 35; i++) {
      const template = feedbackSamples[i % feedbackSamples.length];
      const student = this.students[i % this.students.length];
      const anonToken = `ANON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const monthStr = months[i % months.length];
      const day = ((i * 7) % 27) + 1;
      const submittedAt = `${monthStr}-${day < 10 ? '0' + day : day}T10:30:00Z`;

      const scores = Object.values(template.ratings);
      const avg = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));

      this.feedbacks.push({
        id: `fb-${i + 1}`,
        studentId: student.id,
        facultyId: template.facultyId,
        courseId: template.courseId,
        semesterId: 'sem-2026-spring',
        isAnonymous: true,
        anonymousToken: anonToken,
        overallRating: avg,
        ratings: { ...template.ratings },
        comments: template.comments,
        sentiment: {
          sentiment: template.sentiment,
          positiveScore: template.sentiment === 'POSITIVE' ? 0.88 : template.sentiment === 'NEUTRAL' ? 0.25 : 0.10,
          neutralScore: template.sentiment === 'NEUTRAL' ? 0.65 : 0.15,
          negativeScore: template.sentiment === 'NEGATIVE' ? 0.82 : 0.05,
          detectedEmotion: template.emotion,
          extractedKeywords: template.keywords
        },
        submittedAt,
      });
    }

    // Seed one previous submission from our demo student (stu-1) so they have feedback history
    this.feedbacks.push({
      id: 'fb-stu-1-cs301',
      studentId: 'stu-1',
      facultyId: 'fac-1',
      courseId: 'crs-cs301',
      semesterId: 'sem-2026-spring',
      isAnonymous: true,
      anonymousToken: 'ANON-AARAV-CS301',
      overallRating: 4.8,
      ratings: {
        teachingQuality: 5,
        communication: 5,
        subjectKnowledge: 5,
        courseContent: 5,
        practicalKnowledge: 5,
        infrastructure: 4,
        laboratory: 5,
        library: 4,
        placements: 5
      },
      comments: "Exceptional course. Dr. Anil Kumar's practical lab assignments and explanation of attention mechanisms made complex AI topics straightforward.",
      sentiment: {
        sentiment: 'POSITIVE',
        positiveScore: 0.94,
        neutralScore: 0.04,
        negativeScore: 0.02,
        detectedEmotion: 'Appreciation',
        extractedKeywords: ['Teaching', 'Deep Learning', 'Assignments', 'Labs', 'Communication']
      },
      submittedAt: '2026-03-02T14:20:00Z'
    });
  }

  // Calculate high-level aggregated statistics matching 1,248 submissions & 4.2 rating
  getAdminMetrics() {
    const totalFaculty = 52;
    const totalStudents = 540;
    const totalCourses = 42;
    const totalFeedback = 1248 + (this.feedbacks.length - 36);
    const avgRating = 4.2;
    const responseRate = 78; // 78%
    const positivePercent = 62;
    const neutralPercent = 25;
    const negativePercent = 13;

    return {
      totalStudents,
      totalFaculty,
      totalCourses,
      totalFeedback,
      averageRating: avgRating,
      responseRate,
      positiveFeedback: positivePercent,
      neutralFeedback: neutralPercent,
      negativeFeedback: negativePercent,
      trends: {
        totalFeedbackChange: '+12% vs last sem',
        avgRatingChange: '+0.3 vs last sem',
        responseRateChange: '+8% vs last sem',
        coursesChange: '+5 vs last sem'
      }
    };
  }

  // Ratings over time data for charts (Jan - Jun)
  getRatingsOverTime() {
    return [
      { month: 'Jan', rating: 2.6, submissions: 140, positive: 54, neutral: 28, negative: 18 },
      { month: 'Feb', rating: 3.4, submissions: 210, positive: 58, neutral: 26, negative: 16 },
      { month: 'Mar', rating: 4.1, submissions: 320, positive: 64, neutral: 24, negative: 12 },
      { month: 'Apr', rating: 3.4, submissions: 195, positive: 57, neutral: 27, negative: 16 },
      { month: 'May', rating: 4.0, submissions: 280, positive: 65, neutral: 23, negative: 12 },
      { month: 'Jun', rating: 3.9, submissions: 103, positive: 63, neutral: 25, negative: 12 }
    ];
  }

  // Category performance
  getCategoryRatings() {
    return [
      { category: 'Teaching Quality', score: 4.6, benchmark: 4.0 },
      { category: 'Subject Knowledge', score: 4.7, benchmark: 4.0 },
      { category: 'Communication', score: 4.3, benchmark: 4.0 },
      { category: 'Practical Knowledge', score: 4.1, benchmark: 3.8 },
      { category: 'Course Content', score: 4.2, benchmark: 3.9 },
      { category: 'Laboratory', score: 4.0, benchmark: 3.8 },
      { category: 'Infrastructure', score: 3.8, benchmark: 3.7 },
      { category: 'Library', score: 4.2, benchmark: 3.9 },
      { category: 'Placements', score: 4.4, benchmark: 3.9 }
    ];
  }

  // Faculty Rankings list matching the image
  getFacultyRankings() {
    return [
      { rank: 1, id: 'fac-1', name: 'Dr. Anil Kumar', department: 'Computer Science', averageRating: 4.8, totalFeedback: 156, trend: 'up', sparkline: [4.4, 4.5, 4.6, 4.7, 4.8] },
      { rank: 2, id: 'fac-2', name: 'Dr. Priya Sharma', department: 'Electronics', averageRating: 4.6, totalFeedback: 142, trend: 'up', sparkline: [4.2, 4.3, 4.5, 4.5, 4.6] },
      { rank: 3, id: 'fac-3', name: 'Dr. Rohan Verma', department: 'Mechanical', averageRating: 4.5, totalFeedback: 118, trend: 'up', sparkline: [4.1, 4.2, 4.3, 4.4, 4.5] },
      { rank: 4, id: 'fac-4', name: 'Dr. Neha Singh', department: 'Information Tech', averageRating: 4.3, totalFeedback: 110, trend: 'up', sparkline: [4.0, 4.1, 4.1, 4.2, 4.3] },
      { rank: 5, id: 'fac-5', name: 'Dr. Mohit Patel', department: 'Civil Engineering', averageRating: 4.1, totalFeedback: 98, trend: 'up', sparkline: [3.8, 3.9, 4.0, 4.0, 4.1] },
      { rank: 6, id: 'fac-6', name: 'Dr. Sunita Deshmukh', department: 'Electronics', averageRating: 4.0, totalFeedback: 88, trend: 'steady', sparkline: [3.9, 4.0, 4.0, 4.0, 4.0] },
      { rank: 7, id: 'fac-7', name: 'Dr. Rajesh Kulkarni', department: 'Mechanical', averageRating: 3.9, totalFeedback: 84, trend: 'steady', sparkline: [4.0, 3.9, 3.9, 3.9, 3.9] },
      { rank: 8, id: 'fac-8', name: 'Dr. Monica Sen', department: 'Information Tech', averageRating: 3.8, totalFeedback: 76, trend: 'down', sparkline: [4.0, 3.9, 3.8, 3.8, 3.8] },
      { rank: 9, id: 'fac-9', name: 'Dr. Shalini Mehta', department: 'Management', averageRating: 4.4, totalFeedback: 92, trend: 'up', sparkline: [4.1, 4.2, 4.3, 4.4, 4.4] },
      { rank: 10, id: 'fac-10', name: 'Dr. Arvind Rao', department: 'Computer Science', averageRating: 4.7, totalFeedback: 125, trend: 'up', sparkline: [4.5, 4.5, 4.6, 4.7, 4.7] }
    ];
  }

  // Emotion distribution for AI module
  getEmotionDistribution() {
    return [
      { emotion: 'Satisfaction', count: 460, percentage: 37, color: '#0d9488' },
      { emotion: 'Appreciation', count: 320, percentage: 26, color: '#10b981' },
      { emotion: 'Happiness', count: 180, percentage: 14, color: '#06b6d4' },
      { emotion: 'Concern', count: 125, percentage: 10, color: '#f59e0b' },
      { emotion: 'Confusion', count: 95, percentage: 8, color: '#8b5cf6' },
      { emotion: 'Frustration', count: 68, percentage: 5, color: '#ef4444' }
    ];
  }

  // Frequent keywords for cloud
  getKeywordsCloud() {
    return [
      { text: 'Teaching Quality', weight: 95, category: 'Academic' },
      { text: 'Practical Labs', weight: 88, category: 'Laboratory' },
      { text: 'Communication', weight: 82, category: 'Faculty' },
      { text: 'Assignments', weight: 74, category: 'Workload' },
      { text: 'Infrastructure', weight: 68, category: 'Facilities' },
      { text: 'Placements', weight: 64, category: 'Career' },
      { text: 'Exams & Quizzes', weight: 58, category: 'Evaluation' },
      { text: 'Coding Sessions', weight: 55, category: 'Academic' },
      { text: 'Library Digital Access', weight: 48, category: 'Facilities' },
      { text: 'Pacing & Slides', weight: 42, category: 'Pedagogy' }
    ];
  }
}

export const db = new DatabaseStore();
