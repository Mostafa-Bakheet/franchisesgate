import { PrismaClient, FranchiseStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse } from '../utils/helpers.js';

const prisma = new PrismaClient();

/**
 * @desc    Get gallery franchises with filtering
 * @route   GET /api/gallery
 * @access  Public
 */
export const getGallery = asyncHandler(async (req, res) => {
  const {
    category,
    country,
    city,
    minInvestment,
    maxInvestment,
    sortBy = 'newest',
    page = 1,
    limit = 12
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const where = {
    status: FranchiseStatus.PUBLISHED
  };

  if (category) where.category = category;
  if (country) where.country = country;
  if (city) where.city = city;

  // Investment range filtering
  if (minInvestment || maxInvestment) {
    where.investment = {};
    if (minInvestment) {
      where.investment.minInvestment = {
        gte: parseInt(minInvestment)
      };
    }
    if (maxInvestment) {
      where.investment.maxInvestment = {
        lte: parseInt(maxInvestment)
      };
    }
  }

  // Sorting
  const orderBy = {};
  switch (sortBy) {
    case 'lowestInvestment':
      orderBy.investment = { minInvestment: 'asc' };
      break;
    case 'mostPopular':
      orderBy.messageCount = 'desc';
      break;
    case 'alphabetical':
      orderBy.name = 'asc';
      break;
    case 'newest':
    default:
      orderBy.publishedAt = 'desc';
      break;
  }

  // Query with pagination
  const [franchises, total] = await Promise.all([
    prisma.franchise.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        country: true,
        city: true,
        logo: true,
        coverImage: true,
        messageCount: true,
        views: true,
        publishedAt: true,
        investment: {
          select: {
            minInvestment: true,
            maxInvestment: true,
            franchiseFee: true,
            franchiseFeeLocal: true
          }
        },
        stats: {
          take: 4,
          orderBy: { order: 'asc' },
          select: {
            label: true,
            value: true,
            suffix: true
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.franchise.count({ where })
  ]);

  paginatedResponse(
    res,
    franchises,
    {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  );
});

/**
 * @desc    Get franchise by ID or Slug
 * @route   GET /api/gallery/:identifier
 * @access  Public
 */
export const getFranchiseById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Check if identifier is UUID or slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  const where = isUUID
    ? { id: identifier, status: FranchiseStatus.PUBLISHED }
    : { slug: identifier, status: FranchiseStatus.PUBLISHED };

  const franchise = await prisma.franchise.findFirst({
    where,
    include: {
      investment: true,
      stats: {
        orderBy: { order: 'asc' }
      },
      characteristics: {
        orderBy: { order: 'asc' }
      },
      gallery: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          url: true,
          alt: true,
          order: true
        }
      },
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!franchise) {
    throw new AppError('Franchise not found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Increment view count
  await prisma.franchise.update({
    where: { id: franchise.id },
    data: { views: { increment: 1 } }
  });

  successResponse(res, { franchise });
});

/**
 * @desc    Get related franchises
 * @route   GET /api/gallery/:id/related
 * @access  Public
 */
export const getRelatedFranchises = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 4;

  const franchise = await prisma.franchise.findUnique({
    where: { id },
    select: { category: true, country: true }
  });

  if (!franchise) {
    throw new AppError('Franchise not found', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Find franchises in same category, excluding current
  const related = await prisma.franchise.findMany({
    where: {
      id: { not: id },
      status: FranchiseStatus.PUBLISHED,
      OR: [
        { category: franchise.category },
        { country: franchise.country }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      country: true,
      city: true,
      logo: true,
      investment: {
        select: {
          minInvestment: true,
          maxInvestment: true
        }
      }
    },
    take: limit
  });

  successResponse(res, { franchises: related });
});

/**
 * @desc    Get filter options (categories, countries, cities)
 * @route   GET /api/gallery/filters
 * @access  Public
 */
export const getFilterOptions = asyncHandler(async (req, res) => {
  const [categories, countries, cities] = await Promise.all([
    // Get categories with count
    prisma.franchise.groupBy({
      by: ['category'],
      where: { status: FranchiseStatus.PUBLISHED },
      _count: { category: true }
    }),
    // Get countries
    prisma.franchise.groupBy({
      by: ['country'],
      where: { status: FranchiseStatus.PUBLISHED },
      _count: { country: true }
    }),
    // Get cities
    prisma.franchise.groupBy({
      by: ['city'],
      where: { status: FranchiseStatus.PUBLISHED },
      _count: { city: true }
    })
  ]);

  // Get investment ranges
  const investmentRange = await prisma.investmentDetails.aggregate({
    where: {
      franchise: { status: FranchiseStatus.PUBLISHED }
    },
    _min: { minInvestment: true },
    _max: { maxInvestment: true }
  });

  successResponse(res, {
    categories: categories.map(c => ({
      value: c.category,
      count: c._count.category
    })),
    countries: countries.map(c => ({
      value: c.country,
      count: c._count.country
    })),
    cities: cities.map(c => ({
      value: c.city,
      count: c._count.city
    })),
    investmentRange: {
      min: investmentRange._min.minInvestment || 0,
      max: investmentRange._max.maxInvestment || 1000000
    }
  });
});

/**
 * @desc    Search franchises
 * @route   GET /api/gallery/search
 * @access  Public
 */
export const searchFranchises = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 12 } = req.query;

  if (!q || q.trim().length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400, 'INVALID_QUERY');
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const searchTerm = q.trim().toLowerCase();

  const where = {
    status: FranchiseStatus.PUBLISHED,
    OR: [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { tagline: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { city: { contains: searchTerm, mode: 'insensitive' } }
    ]
  };

  const [franchises, total] = await Promise.all([
    prisma.franchise.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        country: true,
        city: true,
        logo: true,
        investment: {
          select: {
            minInvestment: true,
            maxInvestment: true
          }
        }
      },
      orderBy: { messageCount: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.franchise.count({ where })
  ]);

  paginatedResponse(
    res,
    franchises,
    {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  );
});
