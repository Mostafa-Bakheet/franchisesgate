import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { PrismaClient } from '@prisma/client';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import franchiseRoutes from './src/routes/franchise.routes.js';
import galleryRoutes from './src/routes/gallery.routes.js';
import messageRoutes from './src/routes/message.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import chatRoutes from './src/routes/chat.routes.js';
import crmRoutes from './src/routes/crm.routes.js';
import tickerRoutes from './src/routes/ticker.routes.js';
import servicesRoutes from './src/routes/services.routes.js';
import ordersRoutes from './src/routes/orders.routes.js';

// Middleware
import errorHandler, { notFound } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// Socket.IO Setup
const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5001',
        'http://localhost:5000',
        'https://lightgrey-antelope-357802.hostingersite.com',
        'https://lightgrey-antelope-357802.hostingersite.com/frontend/',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.includes(origin) || 
          allowedOrigins.some(allowed => origin?.startsWith(allowed?.replace(/:\d+$/, '')))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conv_${conversationId}`);
    console.log(`👥 User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conv_${conversationId}`);
    console.log(`👋 User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, content, senderId, senderName, senderType } = data;
      
      // Save message to database
      const message = await prisma.chatMessage.create({
        data: {
          conversationId,
          senderId,
          senderName,
          senderType,
          content,
          status: 'SENT'
        }
      });

      // Update conversation stats
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          messageCount: { increment: 1 },
          lastMessageAt: new Date()
        }
      });

      // Broadcast to all users in the conversation
      io.to(`conv_${conversationId}`).emit('new_message', {
        message,
        conversationId
      });

      // Notify owner if investor sent message
      if (senderType !== 'OWNER') {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { owner: true }
        });
        
        if (conversation) {
          await prisma.notification.create({
            data: {
              userId: conversation.ownerId,
              type: 'NEW_MESSAGE',
              title: 'رسالة جديدة',
              content: `رسالة جديدة من ${senderName}`,
              entityType: 'message',
              entityId: message.id,
              actionUrl: `/owner/chat/${conversationId}`
            }
          });
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Mark messages as read
  socket.on('mark_read', async (data) => {
    try {
      const { conversationId, userId } = data;
      
      await prisma.chatMessage.updateMany({
        where: {
          conversationId,
          senderType: { not: 'OWNER' },
          status: { not: 'READ' }
        },
        data: { status: 'READ', readAt: new Date() }
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCount: 0 }
      });

      io.to(`conv_${conversationId}`).emit('messages_read', { conversationId });
    } catch (error) {
      console.error('Error marking read:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`conv_${data.conversationId}`).emit('user_typing', {
      conversationId: data.conversationId,
      userId: data.userId,
      isTyping: data.isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:5000',
  'https://lightgrey-antelope-357802.hostingersite.com',
  'https://lightgrey-antelope-357802.hostingersite.com/frontend',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const isAllowed = allowedOrigins.some(allowed => 
        origin.startsWith(allowed.replace(/:\d+$/, ''))
      );
      if (!isAllowed) {
        return callback(new Error('CORS policy violation'), false);
      }
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Skip for admin users
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 25 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 400,
  skip: (req) => {
    // Skip rate limiting for admin users
    try {
      let token = null;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies?.token) {
        token = req.cookies.token;
      }
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Skip if user is admin
        return decoded.role === 'ADMIN';
      }
    } catch (error) {
      // If token invalid, don't skip rate limiting
      return false;
    }
    return false;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.'
    });
  }
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Compression
app.use(compression());

// Static Files (for local upload testing)
app.use('/uploads', express.static('uploads'));

// Serve Frontend static files (for subdirectory deployment)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend from /frontend/ subdirectory
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

// Handle React Router (serve index.html for all non-API routes)
app.get('/frontend/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/franchises', franchiseRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/tickers', tickerRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 Socket.IO ready for connections`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server and Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing HTTP server and Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma, io };
