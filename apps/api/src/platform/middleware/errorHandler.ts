import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function globalErrorHandler(error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input payload',
        details: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      data: null,
      error: {
        code: error.code,
        message: error.message,
      },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected system error occurred',
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
