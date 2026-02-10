# Franchise Marketplace Backend - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.franchisegate.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 AUTHENTICATION

### POST /auth/register
Register a new franchise owner (requires admin approval).

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "SecurePass123",
  "name": "Mohammed Al-Rashid",
  "phone": "+966501234567"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Registration successful. Your account is pending admin approval.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@example.com",
      "name": "Mohammed Al-Rashid",
      "role": "FRANCHISE_OWNER",
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### POST /auth/login
Login user.

**Request:**
```json
{
  "email": "owner@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@example.com",
      "name": "Mohammed Al-Rashid",
      "role": "FRANCHISE_OWNER",
      "status": "ACTIVE"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### GET /auth/me
Get current user profile.

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "owner@example.com",
      "name": "Mohammed Al-Rashid",
      "role": "FRANCHISE_OWNER",
      "franchise": {
        "id": "uuid",
        "name": "Al-Nadeg",
        "status": "PUBLISHED",
        "messageCount": 12,
        "views": 345
      }
    }
  }
}
```

---

## 🏪 GALLERY (Public)

### GET /gallery
Get all published franchises with filtering.

**Query Parameters:**
- `category` - RESTAURANTS, RETAIL, SERVICES, etc.
- `country` - Saudi Arabia, UAE, etc.
- `city` - Riyadh, Dubai, etc.
- `minInvestment` - Minimum investment amount
- `maxInvestment` - Maximum investment amount
- `sortBy` - newest, lowestInvestment, mostPopular, alphabetical
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Al-Nadeg",
      "slug": "al-nadeg",
      "category": "RESTAURANTS",
      "country": "Saudi Arabia",
      "city": "Riyadh",
      "logo": "https://cloudinary.com/logo.png",
      "messageCount": 12,
      "views": 345,
      "investment": {
        "minInvestment": 50000,
        "maxInvestment": 150000,
        "franchiseFee": 200000,
        "franchiseFeeLocal": "SAR"
      },
      "stats": [
        { "label": "عدد الفروع", "value": "21", "suffix": "+" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

### GET /gallery/:identifier
Get single franchise by ID or slug.

**Response:**
```json
{
  "status": "success",
  "data": {
    "franchise": {
      "id": "uuid",
      "name": "Al-Nadeg",
      "slug": "al-nadeg",
      "description": "مطاعم الندى - وجبات سريعة سعودية",
      "category": "RESTAURANTS",
      "country": "Saudi Arabia",
      "city": "Riyadh",
      "logo": "https://cloudinary.com/logo.png",
      "coverImage": "https://cloudinary.com/cover.png",
      "views": 346,
      "investment": {
        "minInvestment": 50000,
        "maxInvestment": 150000,
        "franchiseFee": 200000,
        "royaltyFee": "4% - 3%",
        "marketingFee": "1%"
      },
      "stats": [...],
      "characteristics": [...],
      "gallery": [
        { "id": "uuid", "url": "https://cloudinary.com/img1.png", "order": 0 }
      ],
      "owner": {
        "name": "Mohammed Al-Rashid",
        "email": "owner@example.com"
      }
    }
  }
}
```

### GET /gallery/filters
Get available filter options.

**Response:**
```json
{
  "status": "success",
  "data": {
    "categories": [
      { "value": "RESTAURANTS", "count": 15 },
      { "value": "RETAIL", "count": 8 }
    ],
    "countries": [
      { "value": "Saudi Arabia", "count": 20 },
      { "value": "UAE", "count": 10 }
    ],
    "cities": [...],
    "investmentRange": {
      "min": 25000,
      "max": 500000
    }
  }
}
```

---

## 📨 MESSAGES

### POST /messages (Public)
Send message to franchise.

**Request:**
```json
{
  "senderName": "Ahmed Hassan",
  "senderEmail": "ahmed@example.com",
  "senderPhone": "+966501234567",
  "content": "I'm interested in opening a franchise in Jeddah. Please provide more information.",
  "franchiseId": "uuid"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Message sent successfully. The franchise owner will contact you soon.",
  "data": {
    "message": {
      "id": "uuid",
      "senderName": "Ahmed Hassan",
      "status": "UNREAD",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### GET /messages/my-messages (Owner)
Get messages for logged-in franchise owner.

**Query Parameters:**
- `status` - UNREAD, READ, ARCHIVED
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "senderName": "Ahmed Hassan",
      "senderEmail": "ahmed@example.com",
      "subject": "Inquiry about Al-Nadeg",
      "content": "I'm interested...",
      "status": "UNREAD",
      "createdAt": "2024-01-01T00:00:00Z",
      "franchise": {
        "name": "Al-Nadeg",
        "logo": "https://..."
      }
    }
  ],
  "pagination": {...}
}
```

### GET /messages/my-messages/stats (Owner)
Get message statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 25,
    "unread": 3,
    "read": 20,
    "today": 2
  }
}
```

---

## 🏢 FRANCHISE MANAGEMENT (Owner)

### POST /franchises
Create franchise profile.

**Request:**
```json
{
  "name": "Al-Nadeg",
  "tagline": "فخور بتقديم أطعم أكل سعودي",
  "description": "مطاعم الندى - وجبات سريعة سعودية",
  "category": "RESTAURANTS",
  "country": "Saudi Arabia",
  "city": "Riyadh"
}
```

### GET /franchises/my-franchise
Get my franchise details.

### PATCH /franchises/my-franchise
Update franchise basic info.

### POST /franchises/submit
Submit franchise for admin approval.

### PUT /franchises/my-franchise/investment
Update investment details.

**Request:**
```json
{
  "minInvestment": 50000,
  "maxInvestment": 150000,
  "franchiseFee": 200000,
  "franchiseFeeLocal": "SAR",
  "royaltyFee": "4% - 3%",
  "marketingFee": "1%"
}
```

### PUT /franchises/my-franchise/stats
Update franchise stats.

**Request:**
```json
{
  "stats": [
    { "label": "عدد الفروع", "value": "21", "suffix": "+", "order": 0 },
    { "label": "سنة التأسيس", "value": "2002", "order": 1 }
  ]
}
```

### PUT /franchises/my-franchise/characteristics
Update characteristics.

**Request:**
```json
{
  "characteristics": [
    {
      "title": "نسبة حقوق الامتياز",
      "items": [
        "200,000 Saudi Riyals Per Outlet",
        "US$ 50,000 Per Outlet (Regional)"
      ],
      "order": 0
    }
  ]
}
```

---

## 🔧 ADMIN

### GET /admin/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "franchises": {
      "total": 50,
      "published": 35,
      "pending": 10,
      "draft": 5
    },
    "messages": {
      "total": 120,
      "today": 8,
      "unread": 15
    },
    "owners": {
      "total": 45,
      "pending": 5,
      "active": 40
    },
    "recentMessages": [...],
    "pendingFranchises": [...]
  }
}
```

### GET /admin/franchises
Get all franchises (with filters).

### GET /admin/franchises/:id
Get franchise details.

### PATCH /admin/franchises/:id/status
Update franchise status.

**Request:**
```json
{
  "status": "PUBLISHED",
  "rejectionReason": "optional reason if rejected"
}
```

### GET /admin/users
Get all users.

### PATCH /admin/users/:id/status
Update user status.

**Request:**
```json
{
  "status": "ACTIVE"
}
```

---

## 📤 UPLOAD

### POST /upload/single
Upload single image.

**Form Data:**
- `image` - File

**Response:**
```json
{
  "status": "success",
  "data": {
    "url": "https://cloudinary.com/image.png",
    "publicId": "folder/image-name"
  }
}
```

### POST /upload/logo
Upload franchise logo (Owner only).

### POST /upload/cover
Upload franchise cover (Owner only).

### POST /upload/gallery
Upload gallery images (Owner only, max 10).

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Access denied. No token provided.",
  "errorCode": "NO_TOKEN"
}
```

### 403 Forbidden
```json
{
  "status": "fail",
  "message": "Access denied. Insufficient permissions.",
  "errorCode": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Franchise not found",
  "errorCode": "FRANCHISE_NOT_FOUND"
}
```

### 409 Conflict
```json
{
  "status": "fail",
  "message": "Email already registered",
  "errorCode": "EMAIL_EXISTS"
}
```
