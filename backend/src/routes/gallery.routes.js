import express from 'express';
import {
  getGallery,
  getFranchiseById,
  getRelatedFranchises,
  getFilterOptions,
  searchFranchises
} from '../controllers/gallery.controller.js';

const router = express.Router();

// Public routes
router.get('/', getGallery);
router.get('/filters', getFilterOptions);
router.get('/search', searchFranchises);
router.get('/:identifier', getFranchiseById);
router.get('/:id/related', getRelatedFranchises);

export default router;
