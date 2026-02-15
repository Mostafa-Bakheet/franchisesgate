// API Configuration - Centralized for easy deployment changes
const getBaseUrl = () => {
  // For production (franchisegate.sa)
  if (window.location.hostname === 'franchisegate.sa' || window.location.hostname === 'www.franchisegate.sa') {
    return 'https://franchisegate.sa';
  }
  
  // For local development
  return 'http://localhost:5000';
};

const getSocketUrl = () => {
  // For production (franchisegate.sa)
  if (window.location.hostname === 'franchisegate.sa' || window.location.hostname === 'www.franchisegate.sa') {
    return 'https://franchisegate.sa';
  }
  
  // For local development
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
export const API_URL = `${getBaseUrl()}/api`;
export const SOCKET_URL = getSocketUrl();

// Helper function to get full image URL
// Handles both relative paths (/uploads/...) and old absolute URLs (http://localhost:5000/...)
export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL (Cloudinary or other), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Fix old localhost URLs by replacing with production URL
    if (path.includes('localhost:5000')) {
      return path.replace('http://localhost:5000', getBaseUrl());
    }
    return path;
  }
  
  // If it's a relative path, prepend the base URL
  if (path.startsWith('/')) {
    return `${getBaseUrl()}${path}`;
  }
  
  // If it's just a filename, assume it's in uploads/franchises
  return `${getBaseUrl()}/uploads/franchises/${path}`;
};

export default { API_BASE_URL, API_URL, SOCKET_URL, getImageUrl };
