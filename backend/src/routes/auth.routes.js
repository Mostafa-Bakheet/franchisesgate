import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticate);

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/profile', updateProfile);
router.patch('/password', changePassword);

export default router;
