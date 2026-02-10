import express from 'express';
import {
  createFranchise,
  getMyFranchise,
  updateMyFranchise,
  submitForApproval,
  updateInvestment,
  updateStats,
  updateCharacteristics,
  addGalleryImages,
  reorderGallery,
  deleteGalleryImage
} from '../controllers/franchise.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('FRANCHISE_OWNER'));

// Franchise profile
router.post('/', createFranchise);
router.get('/my-franchise', getMyFranchise);
router.patch('/my-franchise', updateMyFranchise);
router.post('/submit', submitForApproval);

// Details
router.put('/my-franchise/investment', updateInvestment);
router.put('/my-franchise/stats', updateStats);
router.put('/my-franchise/characteristics', updateCharacteristics);

// Gallery management
router.post('/my-franchise/gallery', addGalleryImages);
router.patch('/my-franchise/gallery/reorder', reorderGallery);
router.delete('/my-franchise/gallery/:imageId', deleteGalleryImage);

export default router;
