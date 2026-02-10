import express from 'express';
import {
  getDashboardStats,
  getAllFranchisesAdmin,
  getFranchiseByIdAdmin,
  updateFranchiseStatus,
  deleteFranchiseAdmin,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAdminLogs
} from '../controllers/admin.controller.js';
import {
  getAnalyticsStats,
  getLiveActivities,
  getHourlyTraffic,
  getTrafficSources,
  getTopFranchises,
  trackPageView,
  trackActivity
} from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Analytics - Stats
router.get('/analytics', getAnalyticsStats);
router.get('/analytics/activities', getLiveActivities);
router.get('/analytics/hourly-traffic', getHourlyTraffic);
router.get('/analytics/traffic-sources', getTrafficSources);
router.get('/analytics/top-franchises', getTopFranchises);

// Analytics - Tracking (public endpoints for frontend)
router.post('/analytics/track', trackPageView);
router.post('/analytics/activity', trackActivity);

// Franchise management
router.get('/franchises', getAllFranchisesAdmin);
router.get('/franchises/:id', getFranchiseByIdAdmin);
router.patch('/franchises/:id/status', updateFranchiseStatus);
router.delete('/franchises/:id', deleteFranchiseAdmin);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Logs
router.get('/logs', getAdminLogs);

export default router;
