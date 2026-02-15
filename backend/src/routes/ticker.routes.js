import express from 'express';
import {
  getActiveTickers,
  getAllTickers,
  createTicker,
  updateTicker,
  deleteTicker
} from '../controllers/ticker.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveTickers);

// Admin routes
router.get('/', authenticate, requireAdmin, getAllTickers);
router.post('/', authenticate, requireAdmin, createTicker);
router.put('/:id', authenticate, requireAdmin, updateTicker);
router.delete('/:id', authenticate, requireAdmin, deleteTicker);

export default router;
