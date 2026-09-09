import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth';
import studentRoutes from './server/routes/student';
import facultyRoutes from './server/routes/faculty';
import adminRoutes from './server/routes/admin';
import { db } from './server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      appName: 'Student Feedback Portal',
    });
  });

  // Public stats for landing/previews
  app.get('/api/public/stats', (req, res) => {
    res.json({
      totalFeedback: 1248,
      averageRating: 4.2,
      responseRate: 78,
      courses: 42,
      sentiment: {
        positive: 62,
        neutral: 25,
        negative: 13,
      },
      ratingsOverTime: db.getRatingsOverTime(),
      facultyRankings: db.getFacultyRankings().slice(0, 5),
    });
  });

  // Mount modular route groups
  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/faculty', facultyRoutes);
  app.use('/api/admin', adminRoutes);

  // Common notifications endpoint
  app.get('/api/notifications', (req, res) => {
    res.json(db.notifications.slice(0, 10));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Feedback Portal server running on port ${PORT}`);
  });
}

startServer();
