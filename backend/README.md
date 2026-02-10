# Franchise Marketplace - Backend Implementation

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Cloudinary account (for image uploads)

### 1. Installation

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📁 Project Structure

```
backend/
├── server.js                 # Entry point
├── package.json
├── .env.example
├── .env
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Seed data
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── auth.controller.js
│   │   ├── franchise.controller.js
│   │   ├── gallery.controller.js
│   │   ├── message.controller.js
│   │   ├── admin.controller.js
│   │   └── upload.controller.js
│   ├── routes/               # API routes
│   │   ├── auth.routes.js
│   │   ├── franchise.routes.js
│   │   ├── gallery.routes.js
│   │   ├── message.routes.js
│   │   ├── admin.routes.js
│   │   └── upload.routes.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   └── utils/                # Helper functions
│       ├── helpers.js
│       └── validation.js
└── API_DOCUMENTATION.md      # Full API docs
```

## 🔑 Key Features

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Franchise owners require admin approval
- Secure password hashing (bcrypt)

### Franchise Management
- Complete CRUD operations
- Dynamic slug generation
- Investment details tracking
- Stats & characteristics management
- Gallery image management

### Gallery/Marketplace
- Public access (no auth required)
- Advanced filtering (category, country, investment)
- Multiple sorting options
- Search functionality
- Pagination

### Message/Lead System
- Visitors can send messages (no login)
- Franchise owners receive in inbox
- Read/unread status
- Admin oversight

### Admin Dashboard
- Complete franchise moderation
- User management
- Activity logs
- Statistics overview

### File Uploads
- Cloudinary integration
- Image optimization
- Multiple file uploads
- Logo, cover, gallery support

## 🔒 Security

- Helmet.js for headers
- CORS configuration
- Rate limiting
- Input validation (Zod)
- SQL injection protection (Prisma)
- XSS protection
- Secure cookie settings

## 📊 Database Schema

### Users
- id, email, password, name, phone
- role (ADMIN, FRANCHISE_OWNER)
- status (PENDING, ACTIVE, REJECTED, SUSPENDED)

### Franchises
- Basic info (name, slug, description)
- Categorization (category, country, city)
- Status (DRAFT, PENDING, PUBLISHED, REJECTED)
- Investment details
- Stats & characteristics
- Gallery images
- Message count (denormalized)

### Messages
- Visitor contact info
- Content & subject
- Franchise reference
- Owner reference
- Read/unread status

## 🌐 API Endpoints

### Public
- `GET /api/gallery` - Browse franchises
- `GET /api/gallery/:id` - View franchise details
- `GET /api/gallery/filters` - Get filter options
- `POST /api/messages` - Send message

### Auth Required
- `POST /api/auth/register` - Register owner
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile
- `GET /api/franchises/my-franchise` - Owner dashboard
- `GET /api/messages/my-messages` - Owner inbox

### Admin Only
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/franchises` - All franchises
- `PATCH /api/admin/franchises/:id/status` - Moderate
- `GET /api/admin/users` - User management

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Environment Variables Required
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Database Migration on Deploy
```bash
npm run db:push
npm run db:seed
```

## 📞 Support

For API details, see `API_DOCUMENTATION.md`

## 📝 License

Private - Franchise Marketplace Platform
