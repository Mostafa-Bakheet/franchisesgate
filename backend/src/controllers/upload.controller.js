import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse } from '../utils/helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your-api-key'
);

// Configure Cloudinary only if credentials are valid
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/franchises');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Cloudinary storage configuration
const cloudinaryStorage = isCloudinaryConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'franchise-marketplace',
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto:good' }]
  }
}) : null;

// Multer configuration - use local storage if Cloudinary not configured
const storage = isCloudinaryConfigured ? cloudinaryStorage : localStorage;

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400, 'INVALID_FILE_TYPE'), false);
    }
  }
});

// Single image upload
export const uploadSingle = upload.single('image');

// Multiple images upload
export const uploadMultiple = upload.array('images', 10);

// Get base URL for local files
const getBaseUrl = () => {
  // For production (Hostinger VPS)
  if (process.env.NODE_ENV === 'production') {
    return process.env.BACKEND_URL || 'https://lightgrey-antelope-357802.hostingersite.com:5000';
  }
  // For local development
  return process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
};

// Get relative path for database storage (more flexible)
const getRelativePath = (filename) => {
  return `/uploads/franchises/${filename}`;
};

/**
 * Convert image to WebP format using sharp
 * @param {string} inputPath - Path to input image
 * @param {Object} options - Conversion options
 * @returns {Promise<{path: string, filename: string}>}
 */
const convertToWebP = async (inputPath, options = {}) => {
  const { quality = 85, width = null, height = null } = options;
  
  try {
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const dir = path.dirname(inputPath);
    const outputFilename = `${baseName}.webp`;
    const outputPath = path.join(dir, outputFilename);
    
    let sharpInstance = sharp(inputPath);
    
    // Resize if dimensions provided
    if (width || height) {
      sharpInstance = sharpInstance.resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP with high quality
    await sharpInstance
      .webp({ 
        quality, 
        effort: 6,
        smartSubsample: true,
        reductionEffort: 6
      })
      .toFile(outputPath);
    
    // Delete original file after successful conversion
    if (fs.existsSync(outputPath) && inputPath !== outputPath) {
      fs.unlinkSync(inputPath);
    }
    
    return { path: outputPath, filename: outputFilename };
  } catch (error) {
    console.error('WebP conversion error:', error);
    // Return original if conversion fails
    return { path: inputPath, filename: path.basename(inputPath) };
  }
};

/**
 * @desc    Upload single image
 * @route   POST /api/upload/single
 * @access  Private
 */
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image provided', 400, 'NO_FILE');
  }

  let fileUrl = req.file.path;
  let filename = req.file.filename;

  // Convert to WebP if not using Cloudinary (Cloudinary handles conversion automatically)
  if (!isCloudinaryConfigured) {
    const converted = await convertToWebP(req.file.path, { quality: 85 });
    fileUrl = getRelativePath(converted.filename);
    filename = converted.filename;
  }

  successResponse(res, {
    url: fileUrl,
    publicId: filename,
    originalName: req.file.originalname,
    format: 'webp'
  }, 'Image uploaded and converted to WebP successfully');
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private
 */
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No images provided', 400, 'NO_FILES');
  }

  const images = await Promise.all(req.files.map(async (file) => {
    let fileUrl = file.path;
    let filename = file.filename;

    // Convert to WebP if not using Cloudinary
    if (!isCloudinaryConfigured) {
      const converted = await convertToWebP(file.path, { quality: 85 });
      fileUrl = getRelativePath(converted.filename);
      filename = converted.filename;
    }

    return {
      url: fileUrl,
      publicId: filename,
      originalName: file.originalname,
      format: 'webp'
    };
  }));

  successResponse(res, { images }, 'Images uploaded and converted to WebP successfully');
});

/**
 * @desc    Delete image
 * @route   DELETE /api/upload/:publicId
 * @access  Private
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  // If Cloudinary is configured, delete from Cloudinary
  if (isCloudinaryConfigured) {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new AppError('Failed to delete image', 400, 'DELETE_FAILED');
    }
  } else {
    // Delete local file
    const filePath = path.join(uploadsDir, publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  successResponse(res, null, 'Image deleted successfully');
});

/**
 * @desc    Upload franchise logo
 * @route   POST /api/upload/logo
 * @access  Private (Franchise Owner)
 */
export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No logo provided', 400, 'NO_FILE');
  }

  let fileUrl = req.file.path;
  let filename = req.file.filename;

  // Convert to WebP if not using Cloudinary
  if (!isCloudinaryConfigured) {
    const converted = await convertToWebP(req.file.path, { quality: 85, width: 500 });
    fileUrl = getRelativePath(converted.filename);
    filename = converted.filename;
  }

  successResponse(res, {
    logo: fileUrl,
    publicId: filename,
    format: 'webp'
  }, 'Logo uploaded and converted to WebP successfully');
});

/**
 * @desc    Upload franchise cover image
 * @route   POST /api/upload/cover
 * @access  Private (Franchise Owner)
 */
export const uploadCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No cover image provided', 400, 'NO_FILE');
  }

  let fileUrl = req.file.path;
  let filename = req.file.filename;

  // Convert to WebP if not using Cloudinary
  if (!isCloudinaryConfigured) {
    const converted = await convertToWebP(req.file.path, { quality: 85, width: 1200 });
    fileUrl = getRelativePath(converted.filename);
    filename = converted.filename;
  }

  successResponse(res, {
    coverImage: fileUrl,
    publicId: filename,
    format: 'webp'
  }, 'Cover image uploaded and converted to WebP successfully');
});

/**
 * @desc    Upload gallery images
 * @route   POST /api/upload/gallery
 * @access  Private (Franchise Owner)
 */
export const uploadGallery = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('No images provided', 400, 'NO_FILES');
  }

  const images = await Promise.all(req.files.map(async (file, index) => {
    let fileUrl = file.path;
    let filename = file.filename;

    // Convert to WebP if not using Cloudinary
    if (!isCloudinaryConfigured) {
      const converted = await convertToWebP(file.path, { quality: 85, width: 800 });
      fileUrl = getRelativePath(converted.filename);
      filename = converted.filename;
    }

    return {
      url: fileUrl,
      publicId: filename,
      order: index,
      format: 'webp'
    };
  }));

  successResponse(res, { images }, 'Gallery images uploaded and converted to WebP successfully');
});

export { upload };
