import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from './errorHandler.js';

/**
 * JWT Authentication Middleware
 */

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Or from cookie
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError('Access denied. No token provided.', 401, 'NO_TOKEN');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }
});

/**
 * Role-based Access Control
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new AppError('Access denied. Insufficient permissions.', 403, 'FORBIDDEN');
    }
    next();
  };
};

/**
 * Optional authentication - doesn't throw if no token
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
    } catch (error) {
      // Silently fail - user not authenticated
    }
  }

  next();
});

export { authenticate, authorize, optionalAuth };
