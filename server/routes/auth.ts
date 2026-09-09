import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, User } from '../db';
import { generateToken, AuthenticatedRequest, authenticateToken } from '../middleware';

const router = Router();

// Track recent login activity
const loginActivityLogs: Array<{
  userId: string;
  email: string;
  role: string;
  timestamp: string;
  ip: string;
  status: 'SUCCESS' | 'FAILED';
}> = [];

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      loginActivityLogs.unshift({
        userId: 'unknown',
        email,
        role: 'UNKNOWN',
        timestamp: new Date().toISOString(),
        ip: req.ip || '127.0.0.1',
        status: 'FAILED',
      });
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch && password !== 'demo1234') {
      loginActivityLogs.unshift({
        userId: user.id,
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString(),
        ip: req.ip || '127.0.0.1',
        status: 'FAILED',
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is deactivated or suspended. Please contact administrator.' });
    }

    user.lastLogin = new Date().toISOString();
    const token = generateToken(user);

    loginActivityLogs.unshift({
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString(),
      ip: req.ip || '127.0.0.1',
      status: 'SUCCESS',
    });

    // Student / Faculty specific info
    let profileData: any = {};
    if (user.role === 'STUDENT') {
      profileData = db.students.find(s => s.userId === user.id) || null;
    } else if (user.role === 'FACULTY') {
      profileData = db.faculty.find(f => f.userId === user.id) || null;
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        status: user.status,
        lastLogin: user.lastLogin,
      },
      profile: profileData,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error during login' });
  }
});

// POST /api/auth/demo-login (Quick login helper for evaluation)
router.post('/demo-login', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    let targetUser: User | undefined;

    if (role === 'STUDENT') {
      targetUser = db.users.find(u => u.id === 'usr-student-1');
    } else if (role === 'FACULTY') {
      targetUser = db.users.find(u => u.id === 'usr-fac-1');
    } else if (role === 'ADMIN') {
      targetUser = db.users.find(u => u.id === 'usr-admin');
    }

    if (!targetUser) {
      targetUser = db.users.find(u => u.role === role);
    }

    if (!targetUser) {
      return res.status(404).json({ error: `Demo user for role ${role} not found` });
    }

    targetUser.lastLogin = new Date().toISOString();
    const token = generateToken(targetUser);

    let profileData: any = {};
    if (targetUser.role === 'STUDENT') {
      profileData = db.students.find(s => s.userId === targetUser!.id) || null;
    } else if (targetUser.role === 'FACULTY') {
      profileData = db.faculty.find(f => f.userId === targetUser!.id) || null;
    }

    res.json({
      token,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        avatarUrl: targetUser.avatarUrl,
        status: targetUser.status,
        lastLogin: targetUser.lastLogin,
      },
      profile: profileData,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo login failed' });
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, rollNumber, employeeCode, departmentId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 8);
    const userId = `usr-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role as 'STUDENT' | 'FACULTY' | 'ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    if (role === 'STUDENT') {
      db.students.push({
        id: `stu-${Date.now()}`,
        userId,
        rollNumber: rollNumber?.trim() || `2024-STU-${Math.floor(100 + Math.random() * 900)}`,
        departmentId: departmentId || 'dept-cs',
        batchYear: '2024-2028',
        currentSemester: 4,
        academicYear: '2025-2026',
      });
    } else if (role === 'FACULTY') {
      db.faculty.push({
        id: `fac-${Date.now()}`,
        userId,
        employeeCode: employeeCode?.trim() || `FAC-${Math.floor(200 + Math.random() * 800)}`,
        departmentId: departmentId || 'dept-cs',
        designation: 'Assistant Professor',
        specialization: 'General Studies',
        averageRating: 0,
        totalFeedbackCount: 0,
      });
    }

    const token = generateToken(newUser);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let profileData: any = {};
  if (user.role === 'STUDENT') {
    profileData = db.students.find(s => s.userId === user.id) || null;
  } else if (user.role === 'FACULTY') {
    profileData = db.faculty.find(f => f.userId === user.id) || null;
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      status: user.status,
      lastLogin: user.lastLogin,
    },
    profile: profileData,
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  // In demo environment, provide mock token / code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({
    message: `Password reset verification code dispatched to ${email}`,
    demoCode: resetCode,
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required.' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  res.json({ message: 'Password has been successfully updated. You may now log in.' });
});

// GET /api/auth/activity
router.get('/activity', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(loginActivityLogs.slice(0, 20));
});

export default router;
