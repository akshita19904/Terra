import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../auth/jwt.js';

export interface AuthenticatedSocket extends Socket {
  user?: TokenPayload;
}

export function authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication error: Missing token'));
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'waypoint_super_secret_flowos_jwt_key_2026';

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid or expired token'));
  }
}
