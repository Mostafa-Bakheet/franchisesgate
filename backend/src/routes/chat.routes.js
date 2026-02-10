import express from 'express';
import {
  createConversation,
  getMyConversations,
  getConversation,
  sendMessage,
  closeConversation,
  addNote,
  getChatStats,
  getAllConversations,
  deleteConversation
} from '../controllers/chat.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public - Start conversation (no auth required)
router.post('/conversations', createConversation);

// Protected - Franchise Owner routes
router.use(authenticate);
router.get('/my-conversations', authorize('FRANCHISE_OWNER'), getMyConversations);
router.get('/conversations/:id', getConversation);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/conversations/:id/close', authorize('FRANCHISE_OWNER'), closeConversation);
router.post('/conversations/:id/notes', authorize('FRANCHISE_OWNER', 'ADMIN'), addNote);
router.get('/stats', getChatStats);

// Admin routes
router.use('/admin', authorize('ADMIN'));
router.get('/admin/conversations', getAllConversations);
router.delete('/admin/conversations/:id', deleteConversation);

export default router;
