import express from 'express';
import {
  getActiveServices,
  getServiceBySlug,
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../controllers/services.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getActiveServices);
router.get('/:slug', getServiceBySlug);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllServices);
router.post('/', authenticate, requireAdmin, createService);
router.put('/:id', authenticate, requireAdmin, updateService);
router.delete('/:id', authenticate, requireAdmin, deleteService);

export default router;
