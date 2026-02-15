import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getCustomerOrders
} from '../controllers/orders.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);
router.get('/customer/:email', getCustomerOrders);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllOrders);
router.get('/:id', authenticate, requireAdmin, getOrderById);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);
router.delete('/:id', authenticate, requireAdmin, deleteOrder);

export default router;
