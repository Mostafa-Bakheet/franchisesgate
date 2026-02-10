import { PrismaClient, ConversationStatus, ChatMessageStatus, ChatParticipantType } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, parseQueryParams } from '../utils/helpers.js';

const prisma = new PrismaClient();

/**
 * @desc    Start new conversation (Visitor/Investor)
 * @route   POST /api/chat/conversations
 * @access  Public
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { franchiseId, participantName, participantEmail, participantPhone, subject, source } = req.body;

  // Check if franchise exists and is published
  const franchise = await prisma.franchise.findFirst({
    where: { id: franchiseId, status: 'PUBLISHED' },
    include: { owner: true }
  });

  if (!franchise) {
    throw new AppError('Franchise not found or not available', 404, 'FRANCHISE_NOT_FOUND');
  }

  // Create conversation
  const conversation = await prisma.conversation.create({
    data: {
      franchiseId,
      ownerId: franchise.ownerId,
      participantType: req.userId ? 'INVESTOR' : 'VISITOR',
      participantId: req.userId || null,
      participantName,
      participantEmail,
      participantPhone,
      subject: subject || `استفسار عن ${franchise.name}`,
      source: source || 'chat_widget'
    },
    include: {
      franchise: {
        select: { id: true, name: true, logo: true }
      }
    }
  });

  // Create welcome/system message
  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      senderType: 'OWNER',
      senderId: franchise.ownerId,
      senderName: franchise.owner.name,
      content: `مرحباً ${participantName}! 👋\n\nأنا ${franchise.owner.name}، صاحب ${franchise.name}.\n\nكيف أقدر أساعدك في رحلة الاستثمار؟`,
      status: 'SENT'
    }
  });

  // Update conversation stats
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { messageCount: 1 }
  });

  // Create notification for owner
  await prisma.notification.create({
    data: {
      userId: franchise.ownerId,
      type: 'NEW_MESSAGE',
      title: 'محادثة جديدة',
      content: `محادثة جديدة من ${participantName} عن ${franchise.name}`,
      entityType: 'conversation',
      entityId: conversation.id,
      actionUrl: `/owner/chat/${conversation.id}`
    }
  });

  successResponse(res, { conversation }, 'Conversation started successfully', 201);
});

/**
 * @desc    Get my conversations (Owner)
 * @route   GET /api/chat/my-conversations
 * @access  Private (Owner)
 */
export const getMyConversations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status, search } = req.query;

  const where = { ownerId: req.userId };
  
  if (status && status !== 'all') {
    where.status = status.toUpperCase();
  }

  if (search) {
    where.OR = [
      { participantName: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      include: {
        franchise: {
          select: { id: true, name: true, logo: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderType: true,
            createdAt: true,
            status: true
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.conversation.count({ where })
  ]);

  paginatedResponse(res, conversations, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @desc    Get single conversation with messages
 * @route   GET /api/chat/conversations/:id
 * @access  Private (Owner or Participant)
 */
export const getConversation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      OR: [
        { ownerId: req.userId },
        { participantId: req.userId }
      ]
    },
    include: {
      franchise: {
        select: { id: true, name: true, logo: true }
      },
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      notes: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  // Mark unread messages as read
  await prisma.chatMessage.updateMany({
    where: {
      conversationId: id,
      senderType: { not: req.userRole === 'FRANCHISE_OWNER' ? 'OWNER' : 'INVESTOR' },
      status: { not: 'READ' }
    },
    data: { status: 'READ', readAt: new Date() }
  });

  // Reset unread count
  await prisma.conversation.update({
    where: { id },
    data: { unreadCount: 0 }
  });

  successResponse(res, { conversation });
});

/**
 * @desc    Send message in conversation
 * @route   POST /api/chat/conversations/:id/messages
 * @access  Private (Owner or Participant)
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, contentType, attachmentUrl } = req.body;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      OR: [
        { ownerId: req.userId },
        { participantId: req.userId }
      ]
    },
    include: { owner: true, franchise: true }
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  if (conversation.status === 'CLOSED' || conversation.status === 'ARCHIVED') {
    throw new AppError('Conversation is closed', 400, 'CONVERSATION_CLOSED');
  }

  const senderType = req.userRole === 'FRANCHISE_OWNER' ? 'OWNER' : 
                     req.userRole === 'ADMIN' ? 'ADMIN' : 'INVESTOR';

  const message = await prisma.chatMessage.create({
    data: {
      conversationId: id,
      senderType,
      senderId: req.userId,
      senderName: req.userName || conversation.owner.name,
      content,
      contentType: contentType || 'text',
      attachmentUrl
    }
  });

  // Update conversation stats
  await prisma.conversation.update({
    where: { id },
    data: {
      messageCount: { increment: 1 },
      unreadCount: { increment: senderType === 'OWNER' ? 0 : 1 },
      lastMessageAt: new Date()
    }
  });

  // Create notification for recipient
  const recipientId = senderType === 'OWNER' ? null : conversation.ownerId;
  if (recipientId) {
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: 'رسالة جديدة',
        content: `رسالة جديدة من ${conversation.participantName} في ${conversation.franchise.name}`,
        entityType: 'message',
        entityId: message.id,
        actionUrl: `/owner/chat/${conversation.id}`
      }
    });
  }

  successResponse(res, { message }, 'Message sent', 201);
});

/**
 * @desc    Close conversation
 * @route   PATCH /api/chat/conversations/:id/close
 * @access  Private (Owner or Admin)
 */
export const closeConversation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      ownerId: req.userId
    }
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  await prisma.conversation.update({
    where: { id },
    data: {
      status: 'CLOSED',
      closedAt: new Date()
    }
  });

  successResponse(res, null, 'Conversation closed');
});

/**
 * @desc    Add note to conversation
 * @route   POST /api/chat/conversations/:id/notes
 * @access  Private (Owner or Admin)
 */
export const addNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, noteType, reminderAt } = req.body;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      ownerId: req.userId
    }
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND');
  }

  const note = await prisma.chatNote.create({
    data: {
      conversationId: id,
      authorId: req.userId,
      authorName: req.userName,
      authorRole: req.userRole === 'FRANCHISE_OWNER' ? 'OWNER' : 'ADMIN',
      content,
      noteType: noteType || 'internal',
      reminderAt: reminderAt ? new Date(reminderAt) : null
    }
  });

  successResponse(res, { note }, 'Note added', 201);
});

/**
 * @desc    Get chat statistics
 * @route   GET /api/chat/stats
 * @access  Private (Owner)
 */
export const getChatStats = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const targetOwnerId = req.userRole === 'ADMIN' && ownerId ? ownerId : req.userId;

  const [total, active, unread, today] = await Promise.all([
    prisma.conversation.count({ where: { ownerId: targetOwnerId } }),
    prisma.conversation.count({ where: { ownerId: targetOwnerId, status: 'ACTIVE' } }),
    prisma.conversation.count({ where: { ownerId: targetOwnerId, unreadCount: { gt: 0 } } }),
    prisma.conversation.count({
      where: {
        ownerId: targetOwnerId,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    })
  ]);

  successResponse(res, { total, active, unread, today });
});

// ==================== ADMIN CHAT CONTROLS ====================

/**
 * @desc    Get all conversations (Admin)
 * @route   GET /api/chat/admin/conversations
 * @access  Private (Admin)
 */
export const getAllConversations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status, franchiseId, ownerId } = req.query;

  const where = {};
  if (status) where.status = status.toUpperCase();
  if (franchiseId) where.franchiseId = franchiseId;
  if (ownerId) where.ownerId = ownerId;

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      include: {
        franchise: { select: { id: true, name: true, logo: true } },
        owner: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { lastMessageAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.conversation.count({ where })
  ]);

  paginatedResponse(res, conversations, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @desc    Delete conversation (Admin)
 * @route   DELETE /api/chat/admin/conversations/:id
 * @access  Private (Admin)
 */
export const deleteConversation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.conversation.delete({ where: { id } });

  successResponse(res, null, 'Conversation deleted');
});
