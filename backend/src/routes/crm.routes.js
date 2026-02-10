import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  assignLead,
  createFollowUp,
  getFollowUps,
  completeFollowUp,
  createTicket,
  getTickets,
  addTicketResponse,
  updateTicketStatus,
  getCRMStats
} from '../controllers/crm.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/leads', createLead);
router.post('/tickets', createTicket);

// Protected routes
router.use(authenticate);

// Leads
router.get('/leads', getLeads);
router.get('/leads/:id', getLeadById);
router.patch('/leads/:id/status', updateLeadStatus);
router.patch('/leads/:id/assign', authorize('ADMIN', 'FRANCHISE_OWNER'), assignLead);

// Follow-ups
router.post('/follow-ups', createFollowUp);
router.get('/follow-ups', getFollowUps);
router.patch('/follow-ups/:id/complete', completeFollowUp);

// Tickets (Admin only for management)
router.get('/tickets', authorize('ADMIN'), getTickets);
router.post('/tickets/:id/responses', authorize('ADMIN'), addTicketResponse);
router.patch('/tickets/:id/status', authorize('ADMIN'), updateTicketStatus);

// Stats
router.get('/stats', getCRMStats);

export default router;
