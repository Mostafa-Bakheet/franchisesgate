import { PrismaClient, UserRole, UserStatus, FranchiseStatus, MessageStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { successResponse, paginatedResponse } from '../utils/helpers.js';

const prisma = new PrismaClient();

// ==================== REALTIME ANALYTICS ====================

/**
 * @desc    Track page view
 * @route   POST /api/admin/analytics/track
 * @access  Public (for tracking frontend activity)
 */
export const trackPageView = asyncHandler(async (req, res) => {
  const { page, referrer, userAgent, sessionId } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  
  const view = await prisma.pageView.create({
    data: {
      page,
      referrer: referrer || null,
      userAgent: userAgent || req.headers['user-agent'],
      ip: ip.replace(/\.\d+$/, '.xxx'), // Mask last octet for privacy
      sessionId: sessionId || null,
      timestamp: new Date()
    }
  });

  successResponse(res, { message: 'Tracked' }, 201);
});

/**
 * @desc    Track user activity
 * @route   POST /api/admin/analytics/activity
 * @access  Public
 */
export const trackActivity = asyncHandler(async (req, res) => {
  const { type, details, franchiseId, userId } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  
  const activity = await prisma.userActivity.create({
    data: {
      type,
      details: details || null,
      franchiseId: franchiseId || null,
      userId: userId || null,
      ip: ip.replace(/\.\d+$/, '.xxx'),
      userAgent: req.headers['user-agent'],
      timestamp: new Date()
    }
  });

  successResponse(res, { message: 'Activity tracked' }, 201);
});

/**
 * @desc    Get analytics stats
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
export const getAnalyticsStats = asyncHandler(async (req, res) => {
  const { range = 'today' } = req.query;
  
  const now = new Date();
  let startDate = new Date();
  
  switch (range) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setDate(startDate.getDate() - 30);
      break;
    default:
      startDate.setHours(0, 0, 0, 0);
  }
  
  // Get previous period for comparison
  const periodLength = now - startDate;
  const previousStartDate = new Date(startDate - periodLength);
  
  // Page views
  const [currentViews, previousViews] = await Promise.all([
    prisma.pageView.count({ where: { timestamp: { gte: startDate, lte: now } } }),
    prisma.pageView.count({ where: { timestamp: { gte: previousStartDate, lt: startDate } } })
  ]);
  
  // Unique sessions (approximated by sessionId)
  const [currentSessions, previousSessions] = await Promise.all([
    prisma.pageView.groupBy({
      by: ['sessionId'],
      where: { timestamp: { gte: startDate, lte: now } },
      _count: { sessionId: true }
    }),
    prisma.pageView.groupBy({
      by: ['sessionId'],
      where: { timestamp: { gte: previousStartDate, lt: startDate } },
      _count: { sessionId: true }
    })
  ]);
  
  // Messages/Inquiries
  const [currentInquiries, previousInquiries] = await Promise.all([
    prisma.message.count({ where: { createdAt: { gte: startDate, lte: now } } }),
    prisma.message.count({ where: { createdAt: { gte: previousStartDate, lt: startDate } } })
  ]);
  
  // Consultations (using messages with 'consultation' type)
  const [currentConsultations, previousConsultations] = await Promise.all([
    prisma.message.count({ 
      where: { 
        createdAt: { gte: startDate, lte: now },
        subject: { contains: 'استشارة' }
      } 
    }),
    prisma.message.count({ 
      where: { 
        createdAt: { gte: previousStartDate, lt: startDate },
        subject: { contains: 'استشارة' }
      } 
    })
  ]);
  
  // Calculate changes
  const calcChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };
  
  const stats = {
    visitors: {
      current: currentSessions.length || Math.floor(currentViews * 0.7), // Estimate unique visitors
      total: currentViews,
      change: Math.abs(calcChange(currentSessions.length, previousSessions.length)),
      trend: currentSessions.length >= previousSessions.length ? 'up' : 'down'
    },
    pageViews: {
      current: currentViews,
      total: currentViews,
      change: Math.abs(calcChange(currentViews, previousViews)),
      trend: currentViews >= previousViews ? 'up' : 'down'
    },
    inquiries: {
      current: currentInquiries,
      total: currentInquiries,
      change: Math.abs(calcChange(currentInquiries, previousInquiries)),
      trend: currentInquiries >= previousInquiries ? 'up' : 'down'
    },
    consultations: {
      current: currentConsultations,
      total: currentConsultations,
      change: Math.abs(calcChange(currentConsultations, previousConsultations)),
      trend: currentConsultations >= previousConsultations ? 'up' : 'down'
    }
  };
  
  successResponse(res, { data: stats });
});

/**
 * @desc    Get live activities
 * @route   GET /api/admin/analytics/activities
 * @access  Private (Admin)
 */
export const getLiveActivities = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const activities = await prisma.userActivity.findMany({
    take: parseInt(limit),
    orderBy: { timestamp: 'desc' },
    include: {
      franchise: { select: { name: true } },
      user: { select: { name: true, email: true } }
    }
  });
  
  const formattedActivities = activities.map(activity => ({
    id: activity.id,
    user: activity.user?.name || 'زائر',
    action: formatActivityAction(activity.type, activity.franchise?.name),
    time: formatTimeAgo(activity.timestamp),
    type: activity.type,
    icon: getActivityIcon(activity.type)
  }));
  
  successResponse(res, { data: formattedActivities });
});

/**
 * @desc    Get hourly traffic data
 * @route   GET /api/admin/analytics/hourly-traffic
 * @access  Private (Admin)
 */
export const getHourlyTraffic = asyncHandler(async (req, res) => {
  const { range = 'today' } = req.query;
  
  const now = new Date();
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  if (range === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (range === 'month') {
    startDate.setDate(startDate.getDate() - 30);
  }
  
  // Get hourly page views
  const hourlyData = await prisma.$queryRaw`
    SELECT 
      TO_CHAR(timestamp, 'HH24:00') as hour,
      COUNT(*)::int as visitors
    FROM "PageView"
    WHERE timestamp >= ${startDate}
    GROUP BY TO_CHAR(timestamp, 'HH24:00')
    ORDER BY hour
  `;
  
  // Fill missing hours with 0
  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );
  
  const data = hours.map(hour => ({
    hour,
    visitors: hourlyData.find(h => h.hour === hour)?.visitors || 0
  }));
  
  successResponse(res, { data });
});

/**
 * @desc    Get traffic sources
 * @route   GET /api/admin/analytics/traffic-sources
 * @access  Private (Admin)
 */
export const getTrafficSources = asyncHandler(async (req, res) => {
  const { range = 'today' } = req.query;
  
  const startDate = new Date();
  if (range === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (range === 'month') {
    startDate.setDate(startDate.getDate() - 30);
  } else {
    startDate.setHours(0, 0, 0, 0);
  }
  
  const sources = await prisma.$queryRaw`
    SELECT 
      referrer,
      COUNT(*)::int as count
    FROM "PageView"
    WHERE timestamp >= ${startDate} AND referrer IS NOT NULL
    GROUP BY referrer
  `;
  
  // Categorize referrers
  let google = 0, social = 0, direct = 0, other = 0;
  const total = sources.reduce((sum, s) => sum + (s.count || 0), 0) || 1;
  
  sources.forEach(source => {
    const ref = source.referrer || '';
    const count = source.count || 0;
    if (ref.includes('google')) google += count;
    else if (ref.includes('facebook') || ref.includes('instagram') || ref.includes('twitter') || ref.includes('linkedin')) social += count;
    else if (ref === 'direct' || ref === '') direct += count;
    else other += count;
  });
  
  const data = [
    { source: 'بحث Google', percentage: Math.round((google / total) * 100), color: 'bg-blue-500' },
    { source: 'سوشيال ميديا', percentage: Math.round((social / total) * 100), color: 'bg-pink-500' },
    { source: 'Direct', percentage: Math.round((direct / total) * 100), color: 'bg-green-500' },
    { source: 'أخرى', percentage: Math.round((other / total) * 100), color: 'bg-gray-500' }
  ].filter(s => s.percentage > 0);
  
  successResponse(res, { data });
});

/**
 * @desc    Get top franchises
 * @route   GET /api/admin/analytics/top-franchises
 * @access  Private (Admin)
 */
export const getTopFranchises = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const franchises = await prisma.franchise.findMany({
    take: parseInt(limit),
    where: { status: FranchiseStatus.PUBLISHED },
    orderBy: { views: 'desc' },
    select: {
      name: true,
      views: true,
      _count: { select: { messages: true } }
    }
  });
  
  const data = franchises.map(f => ({
    name: f.name,
    views: f.views,
    inquiries: f._count.messages,
    conversion: f.views > 0 ? ((f._count.messages / f.views) * 100).toFixed(1) : 0
  }));
  
  successResponse(res, { data });
});

// Helper functions
function formatActivityAction(type, franchiseName) {
  const actions = {
    'view': `استعرض ${franchiseName || 'فرنشايز'}`,
    'inquiry': 'أرسل استفسار',
    'compare': 'قارن بين فرنشايز',
    'simulator': 'استخدم محاكي الاستثمار',
    'booking': 'حجز موعد استشارة',
    'share': 'شارك فرنشايز',
    'newsletter': 'سجل في النشرة البريدية'
  };
  return actions[type] || type;
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة`;
  return new Date(timestamp).toLocaleDateString('ar-SA');
}

function getActivityIcon(type) {
  const icons = {
    'view': 'Eye',
    'inquiry': 'MessageSquare',
    'compare': 'Target',
    'simulator': 'Zap',
    'booking': 'Calendar',
    'share': 'Share2',
    'newsletter': 'Mail'
  };
  return icons[type] || 'Activity';
}

// ==================== ADMIN DASHBOARD (existing) ====================
