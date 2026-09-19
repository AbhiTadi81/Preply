import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import interviewRoutes from './server/routes/interviewRoutes';
import reportRoutes from './server/routes/reportRoutes';
import { authMiddleware, errorMiddleware } from './server/middleware/authMiddleware';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // Connect database
  await connectDB();

  // API Routes (Mounted FIRST)
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Preply API', timestamp: new Date().toISOString() });
  });

  app.use(authMiddleware);
  app.use('/api/auth', authRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/reports', reportRoutes);

  // Error handling middleware
  app.use(errorMiddleware);

  // Vite middleware for development vs Static file serving for production
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
    console.log(`[Preply] Full-stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
