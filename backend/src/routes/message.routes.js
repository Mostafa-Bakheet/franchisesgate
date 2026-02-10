import express from 'express';
import {
  sendMessage,
  getMyMessages,
  getMessageById,
  updateMessageStatus,
  archiveMessage,
  getMessageStats,
  getAllMessagesAdmin,
  deleteMessageAdmin
} from '../controllers/message.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public - Send message (no auth required)
router.post('/', sendMessage);

// Protected - Franchise Owner routes
router.use('/my-messages', authenticate, authorize('FRANCHISE_OWNER'));
router.get('/my-messages', getMyMessages);
router.get('/my-messages/stats', getMessageStats);
router.get('/my-messages/:id', getMessageById);
router.patch('/my-messages/:id/status', updateMessageStatus);
router.delete('/my-messages/:id', archiveMessage);

// Admin routes
router.use('/admin', authenticate, authorize('ADMIN'));
router.get('/admin/all', getAllMessagesAdmin);
router.delete('/admin/:id', deleteMessageAdmin);

export default router;
