import express from 'express';
import {
  uploadSingle,
  uploadMultiple,
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  uploadLogo,
  uploadCover,
  uploadGallery
} from '../controllers/upload.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Single image upload
router.post('/single', uploadSingle, uploadSingleImage);

// Multiple images upload
router.post('/multiple', uploadMultiple, uploadMultipleImages);

// Franchise specific uploads (Owner only)
router.post('/logo', authorize('FRANCHISE_OWNER'), uploadSingle, uploadLogo);
router.post('/cover', authorize('FRANCHISE_OWNER'), uploadSingle, uploadCover);
router.post('/gallery', authorize('FRANCHISE_OWNER'), uploadMultiple, uploadGallery);

// Delete image
router.delete('/:publicId', deleteImage);

export default router;
