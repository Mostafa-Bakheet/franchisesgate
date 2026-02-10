import { z } from 'zod';

/**
 * User & Authentication Validation
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * Franchise Validation
 */
export const franchiseCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  tagline: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(['RESTAURANTS', 'RETAIL', 'SERVICES', 'HEALTH', 'EDUCATION', 'FASHION', 'CAFE', 'OTHER']),
  country: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required')
});

export const franchiseUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(['RESTAURANTS', 'RETAIL', 'SERVICES', 'HEALTH', 'EDUCATION', 'FASHION', 'CAFE', 'OTHER']).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional()
});

/**
 * Investment Details Validation
 */
export const investmentSchema = z.object({
  minInvestment: z.number().min(0),
  maxInvestment: z.number().min(0),
  franchiseFee: z.number().optional(),
  franchiseFeeLocal: z.string().optional(),
  franchiseFeeIntl: z.number().optional(),
  royaltyFee: z.string().optional(),
  marketingFee: z.string().optional(),
  equipmentCost: z.number().optional(),
  equipmentCurrency: z.string().optional()
});

/**
 * Stats & Characteristics
 */
export const statSchema = z.object({
  label: z.string(),
  value: z.string(),
  suffix: z.string().optional(),
  subtext: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().default(0)
});

export const characteristicSchema = z.object({
  title: z.string(),
  value: z.string().optional(),
  items: z.array(z.string()).default([]),
  icon: z.string().optional(),
  order: z.number().default(0)
});

/**
 * Message Validation
 */
export const messageSchema = z.object({
  senderName: z.string().min(2, 'Name is required'),
  senderEmail: z.string().email('Valid email is required'),
  senderPhone: z.string().optional(),
  subject: z.string().optional(),
  content: z.string().min(10, 'Message must be at least 10 characters'),
  franchiseId: z.string().uuid('Invalid franchise ID')
});

/**
 * Gallery Filters
 */
export const galleryFilterSchema = z.object({
  category: z.enum(['RESTAURANTS', 'RETAIL', 'SERVICES', 'HEALTH', 'EDUCATION', 'FASHION', 'CAFE', 'OTHER']).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  minInvestment: z.string().optional(),
  maxInvestment: z.string().optional(),
  sortBy: z.enum(['newest', 'lowestInvestment', 'mostPopular', 'alphabetical']).default('newest'),
  page: z.string().default('1'),
  limit: z.string().default('12')
});

/**
 * Admin Actions
 */
export const franchiseStatusUpdateSchema = z.object({
  status: z.enum(['PUBLISHED', 'REJECTED', 'UNPUBLISHED']),
  rejectionReason: z.string().optional()
});

export const userStatusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'REJECTED', 'SUSPENDED'])
});
