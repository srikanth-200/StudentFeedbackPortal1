-- ==========================================================
-- Student Feedback Portal - MySQL Database Schema
-- Database: student_feedback
-- ==========================================================

CREATE DATABASE IF NOT EXISTS student_feedback CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_feedback;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS faculty_rankings;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS ai_summaries;
DROP TABLE IF EXISTS sentiment_analysis;
DROP TABLE IF EXISTS feedback_ratings;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS feedback_categories;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS semesters;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    avatar_url VARCHAR(255) NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB;

-- 2. Departments Table
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    head_of_dept VARCHAR(120) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Students Table
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    department_id VARCHAR(36) NOT NULL,
    batch_year VARCHAR(20) NOT NULL,
    current_semester INT NOT NULL DEFAULT 1,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Faculty Table
CREATE TABLE faculty (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    department_id VARCHAR(36) NOT NULL,
    designation VARCHAR(80) NOT NULL,
    specialization VARCHAR(160) NULL,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_feedback_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Semesters Table
CREATE TABLE semesters (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g. "Spring 2026", "Fall 2025"
    code VARCHAR(30) NOT NULL UNIQUE,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Courses Table
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    department_id VARCHAR(36) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    semester_number INT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. Subjects Table (Course-Faculty-Semester Offering Mapping)
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    faculty_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    UNIQUE KEY uk_course_faculty_sem (course_id, faculty_id, semester_id)
) ENGINE=InnoDB;

-- 8. Feedback Categories Table
CREATE TABLE feedback_categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    weightage DECIMAL(3, 2) DEFAULT 1.00
) ENGINE=InnoDB;

-- 9. Feedback Master Table
CREATE TABLE feedback (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL, -- Logical reference or hashed submission token
    faculty_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    semester_id VARCHAR(36) NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    anonymous_token VARCHAR(64) NOT NULL UNIQUE, -- For zero-knowledge audit
    overall_rating DECIMAL(3, 2) NOT NULL,
    comments TEXT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    -- Enforce: One feedback submission per student per course per semester
    UNIQUE KEY uk_student_course_semester (student_id, course_id, semester_id)
) ENGINE=InnoDB;

-- 10. Feedback Ratings (Breakdown per criteria)
CREATE TABLE feedback_ratings (
    id VARCHAR(36) PRIMARY KEY,
    feedback_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES feedback_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Sentiment Analysis Table
CREATE TABLE sentiment_analysis (
    id VARCHAR(36) PRIMARY KEY,
    feedback_id VARCHAR(36) NOT NULL UNIQUE,
    sentiment ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE') NOT NULL,
    positive_score DECIMAL(5, 4) NOT NULL,
    neutral_score DECIMAL(5, 4) NOT NULL,
    negative_score DECIMAL(5, 4) NOT NULL,
    detected_emotion VARCHAR(50) NOT NULL, -- Satisfaction, Frustration, Happiness, Confusion, Appreciation, etc.
    extracted_keywords JSON NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. AI Summaries Table
CREATE TABLE ai_summaries (
    id VARCHAR(36) PRIMARY KEY,
    scope ENUM('FACULTY', 'COURSE', 'DEPARTMENT', 'GLOBAL') NOT NULL,
    entity_id VARCHAR(36) NULL, -- ID of faculty, course or dept
    semester_id VARCHAR(36) NOT NULL,
    summary_text TEXT NOT NULL,
    key_strengths JSON NULL,
    areas_for_improvement JSON NULL,
    actionable_recommendations JSON NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Notifications Table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL, -- NULL indicates system-wide broadcast
    role_target ENUM('ALL', 'STUDENT', 'FACULTY', 'ADMIN') DEFAULT 'ALL',
    title VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('CYCLE', 'DEADLINE', 'SUBMISSION', 'REPORT', 'ANNOUNCEMENT', 'ALERT') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 14. Faculty Rankings Table
CREATE TABLE faculty_rankings (
    id VARCHAR(36) PRIMARY KEY,
    semester_id VARCHAR(36) NOT NULL,
    faculty_id VARCHAR(36) NOT NULL,
    rank_number INT NOT NULL,
    department_name VARCHAR(120) NOT NULL,
    avg_rating DECIMAL(3, 2) NOT NULL,
    total_feedback INT NOT NULL,
    trend_type ENUM('IMPROVED', 'STEADY', 'DECLINED') DEFAULT 'STEADY',
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    UNIQUE KEY uk_faculty_sem_rank (semester_id, faculty_id)
) ENGINE=InnoDB;

-- 15. Reports Table
CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    report_type ENUM('PDF', 'EXCEL', 'CSV') NOT NULL,
    generated_by VARCHAR(36) NOT NULL,
    filter_scope VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NULL,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 16. Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
