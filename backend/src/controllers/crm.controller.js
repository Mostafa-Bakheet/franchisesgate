import { PrismaClient, LeadStatus, TicketStatus, TicketPriority } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse, parseQueryParams } from '../utils/helpers.js';

const prisma = new PrismaClient();

// ==================== LEADS MANAGEMENT ====================

/**
 * @desc    Create new lead
 * @route   POST /api/crm/leads
 * @access  Public or Private
 */
export const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, interestType, franchiseId, source, estimatedInvestment, timeline, notes } = req.body;

  // Auto-assign to franchise owner if franchise is specified
  let assignedToId = null;
  if (franchiseId) {
    const franchise = await prisma.franchise.findUnique({
      where: { id: franchiseId },
      select: { ownerId: true }
    });
    if (franchise) {
      assignedToId = franchise.ownerId;
    }
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      interestType: interestType || 'general',
      franchiseId,
      source: source || 'WEBSITE_CHAT',
      assignedToId,
      estimatedInvestment,
      timeline,
      notes,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer
    },
    include: {
      franchise: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  });

  // Create activity log
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      type: 'status_change',
      description: 'Lead created',
      performedById: req.userId || 'system',
      performedByName: req.userName || 'System',
      performedByRole: req.userRole || 'SYSTEM'
    }
  });

  // Notify assigned owner
  if (assignedToId) {
    await prisma.notification.create({
      data: {
        userId: assignedToId,
        type: 'NEW_LEAD',
        title: 'عميل محتمل جديد',
        content: `عميل جديد: ${name} مهتم بـ ${franchiseId ? lead.franchise.name : 'الفرنشايز'}`,
        entityType: 'lead',
        entityId: lead.id,
        actionUrl: `/owner/crm/leads/${lead.id}`
      }
    });
  }

  successResponse(res, { lead }, 'Lead created successfully', 201);
});

/**
 * @desc    Get leads
 * @route   GET /api/crm/leads
 * @access  Private (Owner or Admin)
 */
export const getLeads = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status, source, assignedToId, search } = req.query;

  const where = {};

  // If owner, only show their leads or unassigned
  if (req.userRole === 'FRANCHISE_OWNER') {
    where.OR = [
      { assignedToId: req.userId },
      { franchise: { ownerId: req.userId } }
    ];
  }

  if (status) where.status = status.toUpperCase();
  if (source) where.source = source.toUpperCase();
  if (assignedToId) where.assignedToId = assignedToId;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } }
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        franchise: { select: { id: true, name: true, logo: true } },
        assignedTo: { select: { id: true, name: true } },
        followUps: {
          where: { status: 'scheduled' },
          orderBy: { scheduledAt: 'asc' },
          take: 1
        },
        tags: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.lead.count({ where })
  ]);

  paginatedResponse(res, leads, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @desc    Get single lead
 * @route   GET /api/crm/leads/:id
 * @access  Private (Owner or Admin)
 */
export const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await prisma.lead.findFirst({
    where: {
      id,
      OR: [
        { assignedToId: req.userId },
        { franchise: { ownerId: req.userId } },
        ...(req.userRole === 'ADMIN' ? [{}] : [])
      ]
    },
    include: {
      franchise: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      activities: {
        orderBy: { createdAt: 'desc' }
      },
      tickets: true,
      followUps: {
        orderBy: { scheduledAt: 'desc' }
      },
      tags: true
    }
  });

  if (!lead) {
    throw new AppError('Lead not found', 404, 'LEAD_NOT_FOUND');
  }

  successResponse(res, { lead });
});

/**
 * @desc    Update lead status
 * @route   PATCH /api/crm/leads/:id/status
 * @access  Private (Owner or Admin)
 */
export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const lead = await prisma.lead.findFirst({
    where: {
      id,
      OR: [
        { assignedToId: req.userId },
        ...(req.userRole === 'ADMIN' ? [{}] : [])
      ]
    }
  });

  if (!lead) {
    throw new AppError('Lead not found', 404, 'LEAD_NOT_FOUND');
  }

  const oldStatus = lead.status;

  const updateData = { status: status.toUpperCase() };
  if (status.toUpperCase() === 'WON') {
    updateData.convertedAt = new Date();
  }

  const updatedLead = await prisma.lead.update({
    where: { id },
    data: updateData,
    include: {
      franchise: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  });

  // Log activity
  await prisma.leadActivity.create({
    data: {
      leadId: id,
      type: 'status_change',
      description: `Status changed from ${oldStatus} to ${status}`,
      oldValue: oldStatus,
      newValue: status.toUpperCase(),
      performedById: req.userId,
      performedByName: req.userName,
      performedByRole: req.userRole
    }
  });

  successResponse(res, { lead: updatedLead }, 'Lead status updated');
});

/**
 * @desc    Assign lead
 * @route   PATCH /api/crm/leads/:id/assign
 * @access  Private (Admin or Owner)
 */
export const assignLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { assignedToId } = req.body;

  const lead = await prisma.lead.update({
    where: { id },
    data: { assignedToId },
    include: {
      franchise: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  });

  // Log activity
  await prisma.leadActivity.create({
    data: {
      leadId: id,
      type: 'status_change',
      description: `Lead assigned to ${lead.assignedTo?.name || 'Unassigned'}`,
      performedById: req.userId,
      performedByName: req.userName,
      performedByRole: req.userRole
    }
  });

  // Notify new assignee
  if (assignedToId) {
    await prisma.notification.create({
      data: {
        userId: assignedToId,
        type: 'NEW_LEAD',
        title: 'عميل محتمل معك',
        content: `تم تخصيص العميل ${lead.name} إليك`,
        entityType: 'lead',
        entityId: lead.id,
        actionUrl: `/owner/crm/leads/${lead.id}`
      }
    });
  }

  successResponse(res, { lead }, 'Lead assigned');
});

// ==================== FOLLOW-UPS ====================

/**
 * @desc    Create follow-up
 * @route   POST /api/crm/follow-ups
 * @access  Private (Owner or Admin)
 */
export const createFollowUp = asyncHandler(async (req, res) => {
  const { leadId, conversationId, type, title, description, scheduledAt, duration, withPerson, withEmail, withPhone } = req.body;

  const followUp = await prisma.followUp.create({
    data: {
      leadId,
      conversationId,
      type: type.toUpperCase(),
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 30,
      createdById: req.userId,
      withPerson,
      withEmail,
      withPhone
    }
  });

  // Log activity if lead exists
  if (leadId) {
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: 'follow_up',
        description: `Follow-up scheduled: ${title}`,
        performedById: req.userId,
        performedByName: req.userName,
        performedByRole: req.userRole
      }
    });
  }

  successResponse(res, { followUp }, 'Follow-up created', 201);
});

/**
 * @desc    Get follow-ups
 * @route   GET /api/crm/follow-ups
 * @access  Private (Owner or Admin)
 */
export const getFollowUps = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status, leadId, upcoming } = req.query;

  const where = {};
  if (status) where.status = status;
  if (leadId) where.leadId = leadId;
  if (upcoming === 'true') {
    where.scheduledAt = { gte: new Date() };
    where.status = 'scheduled';
  }

  // If owner, only show their follow-ups
  if (req.userRole === 'FRANCHISE_OWNER') {
    where.createdById = req.userId;
  }

  const [followUps, total] = await Promise.all([
    prisma.followUp.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true, status: true } }
      },
      orderBy: { scheduledAt: 'asc' },
      skip,
      take: limit
    }),
    prisma.followUp.count({ where })
  ]);

  paginatedResponse(res, followUps, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @desc    Complete follow-up
 * @route   PATCH /api/crm/follow-ups/:id/complete
 * @access  Private (Owner or Admin)
 */
export const completeFollowUp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { outcome } = req.body;

  const followUp = await prisma.followUp.update({
    where: { id },
    data: {
      status: 'completed',
      outcome,
      completedAt: new Date()
    }
  });

  successResponse(res, { followUp }, 'Follow-up completed');
});

// ==================== TICKETS ====================

/**
 * @desc    Create ticket
 * @route   POST /api/crm/tickets
 * @access  Public or Private
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority, leadId, requesterName, requesterEmail, requesterPhone } = req.body;

  // Generate ticket number
  const year = new Date().getFullYear();
  const count = await prisma.ticket.count({ where: { createdAt: { gte: new Date(`${year}-01-01`) } } });
  const ticketNumber = `T-${year}-${String(count + 1).padStart(5, '0')}`;

  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      subject,
      description,
      category,
      priority: priority?.toUpperCase() || 'MEDIUM',
      leadId,
      requesterName: requesterName || req.userName || 'Anonymous',
      requesterEmail: requesterEmail || req.userEmail,
      requesterPhone
    },
    include: {
      lead: { select: { id: true, name: true } }
    }
  });

  // Notify admins
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
  for (const admin of admins) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        type: 'TICKET_CREATED',
        title: 'تذكرة دعم جديدة',
        content: `تذكرة جديدة: ${subject}`,
        entityType: 'ticket',
        entityId: ticket.id,
        actionUrl: `/admin/crm/tickets/${ticket.id}`
      }
    });
  }

  successResponse(res, { ticket }, 'Ticket created', 201);
});

/**
 * @desc    Get tickets
 * @route   GET /api/crm/tickets
 * @access  Private (Admin)
 */
export const getTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parseQueryParams(req.query);
  const { status, priority, assignedToId } = req.query;

  const where = {};
  if (status) where.status = status.toUpperCase();
  if (priority) where.priority = priority.toUpperCase();
  if (assignedToId) where.assignedToId = assignedToId;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: {
        lead: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { responses: true } }
      },
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    }),
    prisma.ticket.count({ where })
  ]);

  paginatedResponse(res, tickets, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @desc    Add ticket response
 * @route   POST /api/crm/tickets/:id/responses
 * @access  Private (Admin)
 */
export const addTicketResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, isInternal } = req.body;

  const response = await prisma.ticketResponse.create({
    data: {
      ticketId: id,
      content,
      isInternal: isInternal || false,
      responderId: req.userId,
      responderName: req.userName,
      responderRole: req.userRole
    }
  });

  // Update ticket status
  await prisma.ticket.update({
    where: { id },
    data: {
      status: isInternal ? undefined : 'WAITING_CUSTOMER',
      updatedAt: new Date()
    }
  });

  successResponse(res, { response }, 'Response added', 201);
});

/**
 * @desc    Update ticket status
 * @route   PATCH /api/crm/tickets/:id/status
 * @access  Private (Admin)
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, assignedToId } = req.body;

  const updateData = {};
  if (status) updateData.status = status.toUpperCase();
  if (assignedToId) updateData.assignedToId = assignedToId;

  if (status?.toUpperCase() === 'RESOLVED') {
    updateData.resolvedAt = new Date();
  }
  if (status?.toUpperCase() === 'CLOSED') {
    updateData.closedAt = new Date();
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: updateData,
    include: {
      lead: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  });

  successResponse(res, { ticket }, 'Ticket updated');
});

// ==================== STATS ====================

/**
 * @desc    Get CRM statistics
 * @route   GET /api/crm/stats
 * @access  Private (Owner or Admin)
 */
export const getCRMStats = asyncHandler(async (req, res) => {
  const { ownerId } = req.query;
  const targetOwnerId = req.userRole === 'ADMIN' && ownerId ? ownerId : req.userId;

  const [leads, tickets, followUps, conversions] = await Promise.all([
    // Leads by status
    prisma.lead.groupBy({
      by: ['status'],
      where: req.userRole === 'FRANCHISE_OWNER' ? { assignedToId: targetOwnerId } : {},
      _count: { id: true }
    }),
    // Tickets by status
    prisma.ticket.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    // Upcoming follow-ups
    prisma.followUp.count({
      where: {
        createdById: targetOwnerId,
        status: 'scheduled',
        scheduledAt: { gte: new Date() }
      }
    }),
    // Conversion rate (WON leads / Total leads)
    prisma.lead.count({
      where: req.userRole === 'FRANCHISE_OWNER' ? { assignedToId: targetOwnerId, status: 'WON' } : { status: 'WON' }
    })
  ]);

  const totalLeads = leads.reduce((acc, l) => acc + l._count.id, 0);

  successResponse(res, {
    leads: {
      byStatus: leads,
      total: totalLeads,
      conversionRate: totalLeads > 0 ? (conversions / totalLeads * 100).toFixed(1) : 0
    },
    tickets: {
      byStatus: tickets,
      total: tickets.reduce((acc, t) => acc + t._count.id, 0)
    },
    followUps: {
      upcoming: followUps
    }
  });
});
