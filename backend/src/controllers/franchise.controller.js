import { PrismaClient, FranchiseStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  successResponse,
  paginatedResponse,
  generateSlug,
  parseQueryParams
} from '../utils/helpers.js';
import {
  franchiseCreateSchema,
  franchiseUpdateSchema,
  investmentSchema,
  statSchema,
  characteristicSchema
} from '../utils/validation.js';

const prisma = new PrismaClient();

/**
 * @desc    Create franchise profile (Owner only)
 * @route   POST /api/franchises
 * @access  Private (Franchise Owner)
 */
export const createFranchise = asyncHandler(async (req, res) => {
  const validatedData = franchiseCreateSchema.parse(req.body);

  // Check if user already has a franchise
  const existingFranchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (existingFranchise) {
    throw new AppError('You already have a franchise profile', 409, 'FRANCHISE_EXISTS');
  }

  // Generate unique slug
  let slug = generateSlug(validatedData.name);
  let slugExists = await prisma.franchise.findUnique({ where: { slug } });
  let counter = 1;

  while (slugExists) {
    slug = `${generateSlug(validatedData.name)}-${counter}`;
    slugExists = await prisma.franchise.findUnique({ where: { slug } });
    counter++;
  }

  // Create franchise
  const franchise = await prisma.franchise.create({
    data: {
      ...validatedData,
      slug,
      ownerId: req.userId,
      status: FranchiseStatus.DRAFT
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  successResponse(res, { franchise }, 'Franchise profile created successfully', 201);
});

/**
 * @desc    Get my franchise (Owner only)
 * @route   GET /api/franchises/my-franchise
 * @access  Private (Franchise Owner)
 */
export const getMyFranchise = asyncHandler(async (req, res) => {
  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId },
    include: {
      investment: true,
      stats: { orderBy: { order: 'asc' } },
      characteristics: { orderBy: { order: 'asc' } },
      gallery: { orderBy: { order: 'asc' } },
      _count: {
        select: { messages: true }
      }
    }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  successResponse(res, { franchise });
});

/**
 * @desc    Update franchise profile (Owner only)
 * @route   PATCH /api/franchises/my-franchise
 * @access  Private (Franchise Owner)
 */
export const updateMyFranchise = asyncHandler(async (req, res) => {
  const validatedData = franchiseUpdateSchema.parse(req.body);

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Update slug if name changed
  let updateData = { ...validatedData };
  if (validatedData.name && validatedData.name !== franchise.name) {
    let slug = generateSlug(validatedData.name);
    let slugExists = await prisma.franchise.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists && slugExists.id !== franchise.id) {
      slug = `${generateSlug(validatedData.name)}-${counter}`;
      slugExists = await prisma.franchise.findUnique({ where: { slug } });
      counter++;
    }
    updateData.slug = slug;
  }

  const updatedFranchise = await prisma.franchise.update({
    where: { ownerId: req.userId },
    data: updateData,
    include: {
      investment: true,
      stats: { orderBy: { order: 'asc' } },
      characteristics: { orderBy: { order: 'asc' } },
      gallery: { orderBy: { order: 'asc' } }
    }
  });

  successResponse(res, { franchise: updatedFranchise }, 'Franchise updated successfully');
});

/**
 * @desc    Submit franchise for approval (Owner only)
 * @route   POST /api/franchises/submit
 * @access  Private (Franchise Owner)
 */
export const submitForApproval = asyncHandler(async (req, res) => {
  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  if (franchise.status === FranchiseStatus.PENDING) {
    throw new AppError('Franchise is already pending approval', 400, 'ALREADY_PENDING');
  }

  if (franchise.status === FranchiseStatus.PUBLISHED) {
    throw new AppError('Franchise is already published', 400, 'ALREADY_PUBLISHED');
  }

  // Validate minimum requirements
  const investment = await prisma.investmentDetails.findUnique({
    where: { franchiseId: franchise.id }
  });

  const stats = await prisma.franchiseStat.findMany({
    where: { franchiseId: franchise.id }
  });

  if (!investment || stats.length === 0) {
    throw new AppError(
      'Please complete investment details and stats before submitting',
      400,
      'INCOMPLETE_PROFILE'
    );
  }

  const updatedFranchise = await prisma.franchise.update({
    where: { ownerId: req.userId },
    data: { status: FranchiseStatus.PENDING }
  });

  // TODO: Notify admin of new submission

  successResponse(res, { franchise: updatedFranchise }, 'Franchise submitted for approval');
});

/**
 * @desc    Update investment details
 * @route   PUT /api/franchises/my-franchise/investment
 * @access  Private (Franchise Owner)
 */
export const updateInvestment = asyncHandler(async (req, res) => {
  const validatedData = investmentSchema.parse(req.body);

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  const investment = await prisma.investmentDetails.upsert({
    where: { franchiseId: franchise.id },
    update: validatedData,
    create: {
      ...validatedData,
      franchiseId: franchise.id
    }
  });

  successResponse(res, { investment }, 'Investment details updated');
});

/**
 * @desc    Update stats
 * @route   PUT /api/franchises/my-franchise/stats
 * @access  Private (Franchise Owner)
 */
export const updateStats = asyncHandler(async (req, res) => {
  const { stats } = req.body;

  if (!Array.isArray(stats)) {
    throw new AppError('Stats must be an array', 400, 'INVALID_DATA');
  }

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Delete existing stats and create new ones
  await prisma.franchiseStat.deleteMany({
    where: { franchiseId: franchise.id }
  });

  const createdStats = await prisma.franchiseStat.createMany({
    data: stats.map((stat, index) => ({
      ...stat,
      franchiseId: franchise.id,
      order: index
    }))
  });

  successResponse(res, { count: createdStats.count }, 'Stats updated');
});

/**
 * @desc    Update characteristics
 * @route   PUT /api/franchises/my-franchise/characteristics
 * @access  Private (Franchise Owner)
 */
export const updateCharacteristics = asyncHandler(async (req, res) => {
  const { characteristics } = req.body;

  if (!Array.isArray(characteristics)) {
    throw new AppError('Characteristics must be an array', 400, 'INVALID_DATA');
  }

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  await prisma.franchiseCharacteristic.deleteMany({
    where: { franchiseId: franchise.id }
  });

  const createdCharacteristics = await prisma.franchiseCharacteristic.createMany({
    data: characteristics.map((char, index) => ({
      ...char,
      franchiseId: franchise.id,
      order: index
    }))
  });

  successResponse(res, { count: createdCharacteristics.count }, 'Characteristics updated');
});

/**
 * @desc    Add gallery images
 * @route   POST /api/franchises/my-franchise/gallery
 * @access  Private (Franchise Owner)
 */
export const addGalleryImages = asyncHandler(async (req, res) => {
  const { images } = req.body; // [{ url, caption }]

  if (!Array.isArray(images) || images.length === 0) {
    throw new AppError('Images array is required', 400, 'INVALID_DATA');
  }

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Get current gallery count for ordering
  const currentCount = await prisma.galleryImage.count({
    where: { franchiseId: franchise.id }
  });

  const createdImages = await prisma.galleryImage.createMany({
    data: images.map((img, index) => ({
      url: img.url,
      alt: img.caption || '',
      franchiseId: franchise.id,
      order: currentCount + index
    }))
  });

  successResponse(res, { count: createdImages.count }, 'Images added to gallery');
});

/**
 * @desc    Reorder gallery images
 * @route   PATCH /api/franchises/my-franchise/gallery/reorder
 * @access  Private (Franchise Owner)
 */
export const reorderGallery = asyncHandler(async (req, res) => {
  const { images } = req.body; // [{ id, order }]

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Update each image order
  await Promise.all(
    images.map(({ id, order }) =>
      prisma.galleryImage.update({
        where: { id, franchiseId: franchise.id },
        data: { order }
      })
    )
  );

  successResponse(res, null, 'Gallery order updated');
});

/**
 * @desc    Delete gallery image
 * @route   DELETE /api/franchises/my-franchise/gallery/:imageId
 * @access  Private (Franchise Owner)
 */
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const franchise = await prisma.franchise.findUnique({
    where: { ownerId: req.userId }
  });

  if (!franchise) {
    throw new AppError('No franchise profile found', 404, 'FRANCHISE_NOT_FOUND');
  }

  await prisma.galleryImage.delete({
    where: { id: imageId, franchiseId: franchise.id }
  });

  successResponse(res, null, 'Image deleted');
});
