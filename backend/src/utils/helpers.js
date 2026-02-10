import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hash password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password
 */
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT Token
 */
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

/**
 * Generate slug from name
 */
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Response formatter
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Paginated response
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    status: 'success',
    message,
    data,
    pagination
  });
};

/**
 * Filter object - remove undefined/null values
 */
export const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== '')
  );
};

/**
 * Parse query parameters for filtering
 */
export const parseQueryParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 12;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || 'createdAt';
  const order = query.order || 'desc';

  return { page, limit, skip, sortBy, order };
};
