import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateSocket, AuthenticatedSocket } from './socketAuth.js';
import { registerSocketEventHandlers } from './eventHandlers.js';

let io: SocketIOServer | null = null;

export function initializeRealtimeGateway(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Attach JWT Authentication Middleware
  io.use(authenticateSocket);

  // Connection Handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    registerSocketEventHandlers(io!, socket);
  });

  console.log('⚡ Socket.IO Realtime Gateway Initialized');
  return io;
}

export function getRealtimeGateway(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO Gateway has not been initialized');
  }
  return io;
}
