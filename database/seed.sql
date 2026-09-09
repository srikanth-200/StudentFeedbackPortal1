-- ==========================================================
-- Student Feedback Portal - MySQL Database Seed Data
-- ==========================================================

USE student_feedback;

-- Insert Feedback Categories
INSERT INTO feedback_categories (id, name, description, weightage) VALUES
('cat-1', 'Teaching Quality', 'Clarity of explanation, pedagogy and lecture preparation', 1.20),
('cat-2', 'Communication', 'Language, responsiveness, accessibility and interaction', 1.00),
('cat-3', 'Subject Knowledge', 'Depth, expertise and practical application in domain', 1.10),
('cat-4', 'Course Content', 'Syllabus coverage, pace, materials and lecture relevance', 1.00),
('cat-5', 'Practical Knowledge', 'Hands-on lab experiments, projects, and case studies', 1.10),
('cat-6', 'Infrastructure', 'Classroom quality, projectors, acoustics, and air conditioning', 0.80),
('cat-7', 'Laboratory', 'Lab equipment, software tools, safety standards and computing resources', 0.90),
('cat-8', 'Library', 'Book availability, digital IEEE/ACM subscriptions, study environment', 0.70),
('cat-9', 'Placements', 'Career counseling, mock interviews, industry internships and skill bootcamps', 0.90);

-- Insert Departments
INSERT INTO departments (id, code, name, head_of_dept, description) VALUES
('dept-cs', 'CSE', 'Computer Science & Engineering', 'Dr. Arvind Rao', 'Algorithms, AI, Systems and Software Engineering'),
('dept-ece', 'ECE', 'Electronics & Communication', 'Dr. Sunita Deshmukh', 'Embedded Systems, VLSI, Signal Processing and Telecom'),
('dept-me', 'MECH', 'Mechanical Engineering', 'Dr. Rajesh Kulkarni', 'Thermal, Robotics, CAD/CAM and Materials Science'),
('dept-it', 'IT', 'Information Technology', 'Dr. Monica Sen', 'Cloud Computing, Cybersecurity, Full-Stack and Big Data'),
('dept-ce', 'CIVIL', 'Civil Engineering', 'Dr. H. N. Murthy', 'Structural, Environmental, Geotechnical and Transportation'),
('dept-mgmt', 'MBA', 'Department of Management', 'Dr. Shalini Mehta', 'Business Analytics, Operations, Finance and Strategy');

-- Insert Semesters
INSERT INTO semesters (id, name, code, academic_year, start_date, end_date, is_active) VALUES
('sem-2026-spring', 'Spring 2026', 'SEM-SP26', '2025-2026', '2026-01-10', '2026-05-30', TRUE),
('sem-2025-fall', 'Fall 2025', 'SEM-FA25', '2025-2026', '2025-08-01', '2025-12-20', FALSE),
('sem-2025-spring', 'Spring 2025', 'SEM-SP25', '2024-2025', '2025-01-10', '2025-05-28', FALSE);

-- Insert Demo Admin, Faculty & Student Users (Bcrypt hashed password 'demo1234')
INSERT INTO users (id, name, email, password_hash, role, avatar_url, status) VALUES
('usr-admin', 'Dr. Meenakshi Sundaram', 'admin@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'ADMIN', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-faculty-1', 'Dr. Anil Kumar', 'anil.kumar@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'FACULTY', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-faculty-2', 'Dr. Priya Sharma', 'priya.sharma@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'FACULTY', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-faculty-3', 'Dr. Rohan Verma', 'rohan.verma@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'FACULTY', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-faculty-4', 'Dr. Neha Singh', 'neha.singh@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'FACULTY', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-faculty-5', 'Dr. Mohit Patel', 'mohit.patel@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'FACULTY', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'ACTIVE'),
('usr-student-1', 'Aarav Gupta', 'student@feedback.edu', '$2a$10$wE1M3E2sQd7e1Gk6L6fWb.3fK8n2B9O5qW8lZ7d0M1c6Y4z2g9iTu', 'STUDENT', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 'ACTIVE');

-- Insert Faculty records
INSERT INTO faculty (id, user_id, employee_code, department_id, designation, specialization, average_rating, total_feedback_count) VALUES
('fac-1', 'usr-faculty-1', 'FAC-CS-01', 'dept-cs', 'Professor & Head', 'Machine Learning & Neural Networks', 4.80, 156),
('fac-2', 'usr-faculty-2', 'FAC-EC-02', 'dept-ece', 'Associate Professor', 'Embedded IoT & Signal Processing', 4.60, 142),
('fac-3', 'usr-faculty-3', 'FAC-ME-03', 'dept-me', 'Associate Professor', 'Robotics & Mechatronics Systems', 4.50, 118),
('fac-4', 'usr-faculty-4', 'FAC-IT-04', 'dept-it', 'Assistant Professor', 'Cloud Computing & Distributed Systems', 4.30, 110),
('fac-5', 'usr-faculty-5', 'FAC-CE-05', 'dept-ce', 'Assistant Professor', 'Structural Mechanics & Smart Materials', 4.10, 98);

-- Insert Student record
INSERT INTO students (id, user_id, roll_number, department_id, batch_year, current_semester, academic_year) VALUES
('stu-1', 'usr-student-1', '2023-CS-042', 'dept-cs', '2023-2027', 6, '2025-2026');

-- Insert Key Courses
INSERT INTO courses (id, code, name, department_id, credits, semester_number, description) VALUES
('crs-cs301', 'CS-301', 'Advanced Deep Learning & AI', 'dept-cs', 4, 6, 'Neural network architectures, transformers, and model optimization.'),
('crs-cs302', 'CS-302', 'Cloud Computing & DevOps', 'dept-cs', 4, 6, 'Microservices, Docker, Kubernetes, and continuous delivery systems.'),
('crs-ec301', 'EC-301', 'Embedded Systems & IoT', 'dept-ece', 3, 6, 'ARM architecture, RTOS, sensor interfacing and IoT protocols.'),
('crs-me301', 'ME-301', 'Robotics and Automated Manufacturing', 'dept-me', 4, 6, 'Kinematics, dynamics, vision sensors, and PLC programming.'),
('crs-it301', 'IT-301', 'Modern Full-Stack Engineering', 'dept-it', 4, 6, 'Next-gen web frameworks, API design, database scalability, and security.'),
('crs-ce301', 'CE-301', 'Smart Infrastructure & Structural Dynamics', 'dept-ce', 3, 6, 'Seismic analysis, smart sensing, and sustainable structural frameworks.');

-- Insert Subjects (Course Offerings)
INSERT INTO subjects (id, course_id, faculty_id, semester_id, academic_year) VALUES
('sbj-1', 'crs-cs301', 'fac-1', 'sem-2026-spring', '2025-2026'),
('sbj-2', 'crs-cs302', 'fac-4', 'sem-2026-spring', '2025-2026'),
('sbj-3', 'crs-ec301', 'fac-2', 'sem-2026-spring', '2025-2026'),
('sbj-4', 'crs-me301', 'fac-3', 'sem-2026-spring', '2025-2026'),
('sbj-5', 'crs-it301', 'fac-4', 'sem-2026-spring', '2025-2026');

-- Insert Notifications
INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read) VALUES
('notif-1', NULL, 'STUDENT', 'Mid-Term Anonymous Feedback Window Open', 'The student feedback portal is active for Spring 2026. Rate your courses before the deadline.', 'CYCLE', FALSE),
('notif-2', NULL, 'STUDENT', 'Feedback Deadline Alert: 10 Days Remaining', 'Please ensure evaluations for all enrolled courses and campus facilities are submitted by end of month.', 'DEADLINE', FALSE),
('notif-3', NULL, 'FACULTY', 'Spring 2026 Mid-Semester AI Analytics Ready', 'Updated anonymized student feedback summaries and keyword trends are now available on your dashboard.', 'REPORT', FALSE),
('notif-4', NULL, 'ADMIN', '1,248 Submissions Milestone Reached', 'Student participation has surpassed 78% across 42 active courses. System health optimal.', 'ALERT', FALSE);
