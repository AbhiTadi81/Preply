import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    (req as unknown as { user: { id: string } }).user = { id: 'usr_default' };
  }
  next();
}

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Middleware]', err);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
}
