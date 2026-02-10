import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  successResponse
} from '../utils/helpers.js';
import { loginSchema, registerSchema } from '../utils/validation.js';

const prisma = new PrismaClient();

/**
 * @desc    Register franchise owner (requires admin approval)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  // Validate input
  const validatedData = registerSchema.parse(req.body);

  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });

  if (existingUser) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Hash password
  const hashedPassword = await hashPassword(validatedData.password);

  // Create user (status: PENDING - requires admin approval)
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      phone: validatedData.phone,
      role: UserRole.FRANCHISE_OWNER,
      status: UserStatus.PENDING
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  // TODO: Send email notification to admin about new registration

  successResponse(
    res,
    { user },
    'Registration successful. Your account is pending admin approval.',
    201
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  // Validate input
  const validatedData = loginSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check status
  if (user.status === UserStatus.PENDING) {
    throw new AppError(
      'Your account is pending admin approval. Please wait for approval.',
      403,
      'ACCOUNT_PENDING'
    );
  }

  if (user.status === UserStatus.REJECTED) {
    throw new AppError(
      'Your account registration was rejected. Please contact support.',
      403,
      'ACCOUNT_REJECTED'
    );
  }

  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(
      'Your account has been suspended. Please contact support.',
      403,
      'ACCOUNT_SUSPENDED'
    );
  }

  // Check password
  const isPasswordValid = await comparePassword(validatedData.password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Generate token
  const token = generateToken(user.id, user.role);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  successResponse(res, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    },
    token
  }, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  successResponse(res, null, 'Logout successful');
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
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
          status: true,
          messageCount: true,
          views: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  successResponse(res, { user });
});

/**
 * @desc    Update profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, phone },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true
    }
  });

  successResponse(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PATCH /api/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.userId }
  });

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) {
    throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: req.userId },
    data: { password: hashedPassword }
  });

  successResponse(res, null, 'Password changed successfully');
});
