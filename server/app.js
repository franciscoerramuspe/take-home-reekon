import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken } from './utils/auth.js';
import authRoutes from './routes/authRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import robotRoutes from './routes/robotRoutes.js';
import { websocketController } from './controllers/websocket/websocketController.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS first
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// Initialize Socket.IO after CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Remove the middleware and let the websocketController handle auth
io.on("connection", (socket) => {
  websocketController.handleConnection(socket);
});

// Debug any connection issues
io.engine.on("connection_error", (err) => {
  console.log('Connection error:', err);
});

// Export for use in other files
export { io };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/robots', robotRoutes);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});