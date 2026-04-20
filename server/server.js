import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './config/database.js';
import { authenticate, errorHandler } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
 
connectDB();
 
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/notifications', notificationRoutes);
 
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

 
const userSockets = {};

io.on('connection', (socket) => {
  console.log(`✓ New client connected: ${socket.id}`);

  socket.on('join', (userId) => {
    userSockets[userId] = socket.id;
    socket.userId = userId;
    socket.join(`user_${userId}`);
    console.log(`✓ User ${userId} joined`);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      delete userSockets[socket.userId];
    }
    console.log(`✗ Client disconnected: ${socket.id}`);
  });
});

 
app.locals.io = io;
app.locals.userSockets = userSockets;

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`

                                                               
   Finance Tracker Server Started Successfully! 🚀             
   Port: ${PORT}                                           
   Environment: ${process.env.NODE_ENV || 'development'}                            
   API: http://localhost:${PORT}/api                      
   WebSocket: Ready                                            
                                                               
  `);
});

export { app, io };
