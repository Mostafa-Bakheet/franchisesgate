import { PrismaClient, FranchiseStatus, MessageStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, parseQueryParams } from '../utils/helpers.js';
import { messageSchema } from '../utils/validation.js';

const prisma = new PrismaClient();

/**
 * @desc    Send message to franchise (Visitor - No auth required)
 * @route   POST /api/messages
 * @access  Public
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const validatedData = messageSchema.parse(req.body);

  // Check if franchise exists and is published
  const franchise = await prisma.franchise.findFirst({
    where: {
      id: validatedData.franchiseId,
      status: FranchiseStatus.PUBLISHED
    },
    include: {
      owner: true
    }
  });

  if (!franchise) {
    throw new AppError('Franchise not found or not available', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      senderName: validatedData.senderName,
      senderEmail: validatedData.senderEmail,
      senderPhone: validatedData.senderPhone,
      subject: validatedData.subject || `Inquiry about ${franchise.name}`,
      content: validatedData.content,
      franchiseId: validatedData.franchiseId,
      ownerId: franchise.ownerId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });

  // Update message count on franchise
  await prisma.franchise.update({
    where: { id: franchise.id },
    data: { messageCount: { increment: 1 } }
  });

  // TODO: Send email notification to franchise owner

  successResponse(
    res,
    { message },
    'Message sent successfully. The franchise owner will contact you soon.',
    201
  );
});

/**
 * @desc    Get my messages (Franchise Owner)
 * @route   GET /api/messages/my-messages
 * @access  Private (Franchise Owner)
 */
export const getMyMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status } = req.query;

  const where = { ownerId: req.userId };
  if (status) where.status = status;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: {
        franchise: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.message.count({ where })
  ]);

  paginatedResponse(
    res,
    messages,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  );
});

/**
 * @desc    Get single message (Franchise Owner)
 * @route   GET /api/messages/my-messages/:id
 * @access  Private (Franchise Owner)
 */
export const getMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await prisma.message.findFirst({
    where: {
      id,
      ownerId: req.userId
    },
    include: {
      franchise: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  });

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  // Mark as read if unread
  if (message.status === MessageStatus.UNREAD) {
    await prisma.message.update({
      where: { id },
      data: { status: MessageStatus.READ, readAt: new Date() }
    });
  }

  successResponse(res, { message });
});

/**
 * @desc    Mark message as read/unread (Franchise Owner)
 * @route   PATCH /api/messages/my-messages/:id/status
 * @access  Private (Franchise Owner)
 */
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const message = await prisma.message.findFirst({
    where: { id, ownerId: req.userId }
  });

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  const updateData = { status };
  if (status === MessageStatus.READ && !message.readAt) {
    updateData.readAt = new Date();
  }

  const updatedMessage = await prisma.message.update({
    where: { id },
    data: updateData
  });

  successResponse(res, { message: updatedMessage }, 'Status updated');
});

/**
 * @desc    Archive message (Franchise Owner)
 * @route   DELETE /api/messages/my-messages/:id
 * @access  Private (Franchise Owner)
 */
export const archiveMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await prisma.message.findFirst({
    where: { id, ownerId: req.userId }
  });

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  await prisma.message.update({
    where: { id },
    data: { status: MessageStatus.ARCHIVED }
  });

  successResponse(res, null, 'Message archived');
});

/**
 * @desc    Get message statistics (Franchise Owner)
 * @route   GET /api/messages/stats
 * @access  Private (Franchise Owner)
 */
export const getMessageStats = asyncHandler(async (req, res) => {
  const [total, unread, read, today] = await Promise.all([
    prisma.message.count({ where: { ownerId: req.userId } }),
    prisma.message.count({
      where: { ownerId: req.userId, status: MessageStatus.UNREAD }
    }),
    prisma.message.count({
      where: { ownerId: req.userId, status: MessageStatus.READ }
    }),
    prisma.message.count({
      where: {
        ownerId: req.userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ]);

  successResponse(res, {
    total,
    unread,
    read,
    today
  });
});

// ==================== ADMIN MESSAGE CONTROLS ====================

/**
 * @desc    Get all messages (Admin)
 * @route   GET /api/messages/admin/all
 * @access  Private (Admin)
 */
export const getAllMessagesAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { franchiseId, status, startDate, endDate } = req.query;

  const where = {};
  if (franchiseId) where.franchiseId = franchiseId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: {
        franchise: {
          select: { id: true, name: true, logo: true }
        },
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.message.count({ where })
  ]);

  paginatedResponse(
    res,
    messages,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  );
});

/**
 * @desc    Delete message (Admin)
 * @route   DELETE /api/messages/admin/:id
 * @access  Private (Admin)
 */
export const deleteMessageAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await prisma.message.findUnique({
    where: { id }
  });

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  await prisma.message.delete({ where: { id } });

  // Update message count
  await prisma.franchise.update({
    where: { id: message.franchiseId },
    data: { messageCount: { decrement: 1 } }
  });

  successResponse(res, null, 'Message deleted');
});
