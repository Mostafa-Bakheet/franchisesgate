/**
 * Centralized Error Handler
 * Converts all errors to consistent API response format
 */

class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Prisma error handling
  if (err.code) {
    // Prisma unique constraint violation
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        status: 'fail',
        message: `${field} already exists`,
        errorCode: 'DUPLICATE_ENTRY'
      });
    }

    // Prisma foreign key constraint
    if (err.code === 'P2003') {
      return res.status(400).json({
        status: 'fail',
        message: 'Referenced record does not exist',
        errorCode: 'FOREIGN_KEY_ERROR'
      });
    }

    // Prisma record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Record not found',
        errorCode: 'NOT_FOUND'
      });
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
      errorCode: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.',
      errorCode: 'TOKEN_EXPIRED'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
      errorCode: 'VALIDATION_ERROR',
      errors: err.errors
    });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      errors: err.errors
    });
  }

  // Development vs Production error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode,
      stack: err.stack,
      error: err
    });
  }

  // Production: don't leak error details
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode
    });
  }

  // Unknown errors - log and send generic message
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    errorCode: 'INTERNAL_ERROR'
  });
};

const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'ROUTE_NOT_FOUND');
  next(error);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFound, asyncHandler, AppError };
export default errorHandler;
