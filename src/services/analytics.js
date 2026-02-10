// Frontend Analytics Tracking Service
const API_BASE_URL = 'http://localhost:5000/api';

// Generate unique session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Track page view
export const trackPageView = async (page = window.location.pathname) => {
  try {
    await fetch(`${API_BASE_URL}/admin/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        sessionId: getSessionId()
      })
    });
  } catch (err) {
    // Silently fail - don't break user experience
    console.log('Analytics tracking failed:', err);
  }
};

// Track user activity
export const trackActivity = async (type, details = null, franchiseId = null) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    await fetch(`${API_BASE_URL}/admin/analytics/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        details,
        franchiseId,
        userId: user?.id || null,
        sessionId: getSessionId()
      })
    });
  } catch (err) {
    console.log('Activity tracking failed:', err);
  }
};

// Track franchise view
export const trackFranchiseView = (franchiseId, franchiseName) => {
  return trackActivity('view', franchiseName, franchiseId);
};

// Track inquiry submission
export const trackInquiry = (franchiseId) => {
  return trackActivity('inquiry', null, franchiseId);
};

// Track comparison
export const trackCompare = (franchiseIds) => {
  return trackActivity('compare', franchiseIds.join(','));
};

// Track simulator usage
export const trackSimulator = () => {
  return trackActivity('simulator');
};

// Track consultation booking
export const trackBooking = () => {
  return trackActivity('booking');
};

// Track share
export const trackShare = (platform) => {
  return trackActivity('share', platform);
};

// Track newsletter signup
export const trackNewsletter = () => {
  return trackActivity('newsletter');
};

// Initialize tracking on page load
export const initAnalytics = () => {
  // Track initial page view
  trackPageView();
  
  // Track route changes
  let lastPath = window.location.pathname;
  
  const checkRouteChange = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView(currentPath);
    }
  };
  
  // Check for route changes every 500ms (for SPA navigation)
  setInterval(checkRouteChange, 500);
  
  // Track before unload
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('analytics_session_id');
  });
};

export default {
  trackPageView,
  trackActivity,
  trackFranchiseView,
  trackInquiry,
  trackCompare,
  trackSimulator,
  trackBooking,
  trackShare,
  trackNewsletter,
  initAnalytics
};
