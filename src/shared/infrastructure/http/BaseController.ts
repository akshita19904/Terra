import { Response } from 'express';
import { logger } from '../logging/logger';

export abstract class BaseController {
  protected ok<T>(res: Response, dto?: T): Response {
    if (dto !== undefined && dto !== null) {
      res.type('application/json');
      return res.status(200).json({ success: true, data: dto });
    }
    return res.sendStatus(200);
  }

  protected created<T>(res: Response, dto?: T): Response {
    if (dto !== undefined && dto !== null) {
      return res.status(201).json({ success: true, data: dto });
    }
    return res.sendStatus(201);
  }

  protected clientError(res: Response, message?: string): Response {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: message || 'Invalid client request',
      },
    });
  }

  protected unauthorized(res: Response, message?: string): Response {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: message || 'Unauthorized access',
      },
    });
  }

  protected forbidden(res: Response, message?: string): Response {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: message || 'Forbidden request',
      },
    });
  }

  protected notFound(res: Response, message?: string): Response {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: message || 'Resource not found',
      },
    });
  }

  protected fail(res: Response, error: Error | string): Response {
    logger.error('Controller execution failure', { error });
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: typeof error === 'string' ? error : error.message || 'An unexpected error occurred',
      },
    });
  }
}
