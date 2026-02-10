import { PrismaClient, UserRole, UserStatus, FranchiseStatus, MessageStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse } from '../utils/helpers.js';

const prisma = new PrismaClient();

// ==================== ADMIN DASHBOARD ====================

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalFranchises,
    publishedFranchises,
    pendingFranchises,
    draftFranchises,
    totalMessages,
    todayMessages,
    unreadMessages,
    totalOwners,
    pendingOwners,
    activeOwners
  ] = await Promise.all([
    prisma.franchise.count(),
    prisma.franchise.count({ where: { status: FranchiseStatus.PUBLISHED } }),
    prisma.franchise.count({ where: { status: FranchiseStatus.PENDING } }),
    prisma.franchise.count({ where: { status: FranchiseStatus.DRAFT } }),
    prisma.message.count(),
    prisma.message.count({
      where: { createdAt: { gte: today } }
    }),
    prisma.message.count({ where: { status: MessageStatus.UNREAD } }),
    prisma.user.count({ where: { role: UserRole.FRANCHISE_OWNER } }),
    prisma.user.count({
      where: { role: UserRole.FRANCHISE_OWNER, status: UserStatus.PENDING }
    }),
    prisma.user.count({
      where: { role: UserRole.FRANCHISE_OWNER, status: UserStatus.ACTIVE }
    })
  ]);

  // Get recent messages
  const recentMessages = await prisma.message.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      franchise: {
        select: { name: true, logo: true }
      },
      owner: {
        select: { name: true, email: true }
      }
    }
  });

  // Get pending franchises
  const pendingFranchisesList = await prisma.franchise.findMany({
    where: { status: FranchiseStatus.PENDING },
    take: 5,
    orderBy: { createdAt: 'asc' },
    include: {
      owner: {
        select: { name: true, email: true }
      }
    }
  });

  successResponse(res, {
    franchises: {
      total: totalFranchises,
      published: publishedFranchises,
      pending: pendingFranchises,
      draft: draftFranchises
    },
    messages: {
      total: totalMessages,
      today: todayMessages,
      unread: unreadMessages
    },
    owners: {
      total: totalOwners,
      pending: pendingOwners,
      active: activeOwners
    },
    recentMessages,
    pendingFranchises: pendingFranchisesList
  });
});

// ==================== FRANCHISE MANAGEMENT ====================

/**
 * @desc    Get all franchises (Admin)
 * @route   GET /api/admin/franchises
 * @access  Private (Admin)
 */
export const getAllFranchisesAdmin = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { owner: { email: { contains: search, mode: 'insensitive' } } },
      { owner: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [franchises, total] = await Promise.all([
    prisma.franchise.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true, status: true }
        },
        investment: {
          select: { minInvestment: true, maxInvestment: true }
        },
        _count: {
          select: { messages: true, gallery: true }
        }
      },
      orderBy: { createdAt: 'desc' },
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
 * @desc    Get single franchise (Admin)
 * @route   GET /api/admin/franchises/:id
 * @access  Private (Admin)
 */
export const getFranchiseByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const franchise = await prisma.franchise.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true, phone: true, status: true }
      },
      investment: true,
      stats: { orderBy: { order: 'asc' } },
      characteristics: { orderBy: { order: 'asc' } },
      gallery: { orderBy: { order: 'asc' } },
      messages: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          senderName: true,
          senderEmail: true,
          status: true,
          createdAt: true
        }
      }
    }
  });

  if (!franchise) {
    throw new AppError('Franchise not found', 404, 'FRANCHISE_NOT_FOUND');
  }

  successResponse(res, { franchise });
});

/**
 * @desc    Update franchise status (Admin)
 * @route   PATCH /api/admin/franchises/:id/status
 * @access  Private (Admin)
 */
export const updateFranchiseStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  const validStatuses = ['PUBLISHED', 'REJECTED', 'UNPUBLISHED', 'DRAFT'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400, 'INVALID_STATUS');
  }

  const franchise = await prisma.franchise.findUnique({
    where: { id },
    include: { owner: true }
  });

  if (!franchise) {
    throw new AppError('Franchise not found', 404, 'FRANCHISE_NOT_FOUND');
  }

  const updateData = { status };
  if (status === FranchiseStatus.PUBLISHED) {
    updateData.publishedAt = new Date();
  }

  const updatedFranchise = await prisma.franchise.update({
    where: { id },
    data: updateData
  });

  // Log admin action
  await prisma.adminLog.create({
    data: {
      adminId: req.userId,
      action: `FRANCHISE_${status}`,
      targetType: 'Franchise',
      targetId: id,
      details: { rejectionReason }
    }
  });

  // TODO: Send email notification to franchise owner

  successResponse(res, { franchise: updatedFranchise }, `Franchise ${status.toLowerCase()}`);
});

/**
 * @desc    Delete franchise (Admin)
 * @route   DELETE /api/admin/franchises/:id
 * @access  Private (Admin)
 */
export const deleteFranchiseAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const franchise = await prisma.franchise.findUnique({ where: { id } });

  if (!franchise) {
    throw new AppError('Franchise not found', 404, 'FRANCHISE_NOT_FOUND');
  }

  await prisma.franchise.delete({ where: { id } });

  // Log action
  await prisma.adminLog.create({
    data: {
      adminId: req.userId,
      action: 'FRANCHISE_DELETED',
      targetType: 'Franchise',
      targetId: id
    }
  });

  successResponse(res, null, 'Franchise deleted');
});

// ==================== USER MANAGEMENT ====================

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        franchise: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.user.count({ where })
  ]);

  paginatedResponse(
    res,
    users,
    {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  );
});

/**
 * @desc    Update user status (Admin)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError('Cannot modify admin status', 403, 'FORBIDDEN');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      role: true
    }
  });

  // Log action
  await prisma.adminLog.create({
    data: {
      adminId: req.userId,
      action: `USER_${status}`,
      targetType: 'User',
      targetId: id
    }
  });

  // TODO: Send email notification to user

  successResponse(res, { user: updatedUser }, `User ${status.toLowerCase()}`);
});

/**
 * @desc    Delete user (Admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (user.role === UserRole.ADMIN) {
    throw new AppError('Cannot delete admin users', 403, 'FORBIDDEN');
  }

  await prisma.user.delete({ where: { id } });

  // Log action
  await prisma.adminLog.create({
    data: {
      adminId: req.userId,
      action: 'USER_DELETED',
      targetType: 'User',
      targetId: id
    }
  });

  successResponse(res, null, 'User deleted');
});

// ==================== ADMIN LOGS ====================

/**
 * @desc    Get admin activity logs
 * @route   GET /api/admin/logs
 * @access  Private (Admin)
 */
export const getAdminLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, adminId, action, startDate, endDate } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (adminId) where.adminId = adminId;
  if (action) where.action = action;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      include: {
        admin: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.adminLog.count({ where })
  ]);

  paginatedResponse(
    res,
    logs,
    {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    }
  );
});
