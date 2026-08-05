import { Request, Response, NextFunction } from 'express';
import { logger } from '../../logging/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  logger.error('Unhandled API Error', {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: message,
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    },
  });
}
