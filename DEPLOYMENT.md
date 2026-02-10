# Franchise Marketplace - Hostinger Deployment Guide

## 🚀 Backend Deployment (Node.js on Hostinger VPS)

### 1. Prepare Backend for Production

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
```

### 2. Environment Variables (.env)

Create `.env` file in backend folder:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/franchise_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Frontend URL (your domain)
FRONTEND_URL="https://your-domain.com"

# Server
NODE_ENV="production"
PORT=5000

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Email notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Build & Deploy Backend

Upload these files/folders to your Hostinger VPS:
- `backend/server.js`
- `backend/package.json`
- `backend/src/` (all controllers, routes, middleware)
- `backend/prisma/schema.prisma`
- `backend/.env` (create this on server)

### 4. Start with PM2 (Production Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name "franchise-backend"

# Save PM2 config
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs franchise-backend
```

### 5. Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support for Socket.io
        proxy_read_timeout 86400;
    }
}
```

Enable SSL with Let's Encrypt:
```bash
certbot --nginx -d your-domain.com
```

---

## 🎨 Frontend Deployment (React on Hostinger)

### 1. Build Frontend for Production

```bash
cd frontend
npm install
npm run build
```

### 2. Create .env.production

```env
VITE_BACKEND_URL="https://your-backend-domain.com"
```

### 3. Upload to Hostinger

Upload the `dist/` folder contents to your Hostinger public_html folder.

### 4. Or Deploy via Git

1. Push code to GitHub
2. Connect GitHub repo in Hostinger hPanel
3. Set build command: `npm install && npm run build`
4. Set output directory: `dist`

---

## 📋 Checklist Before Going Live

### Backend:
- [ ] Database migrated and seeded
- [ ] Environment variables set
- [ ] CORS configured for production domain
- [ ] SSL certificate installed
- [ ] PM2 running and configured
- [ ] Firewall ports open (80, 443, 5000)

### Frontend:
- [ ] Built successfully (no errors)
- [ ] API URLs pointing to production backend
- [ ] All images loading correctly
- [ ] Routes working (SPA redirect configured)

### Testing:
- [ ] User registration works
- [ ] Login works
- [ ] Chat real-time messaging works
- [ ] File uploads work (if using)
- [ ] Admin dashboard accessible

---

## 🔧 Useful Commands

```bash
# Check Node.js version (should be 18+)
node -v

# Check if port is in use
sudo lsof -i :5000

# Kill process on port
sudo kill -9 $(sudo lsof -t -i:5000)

# Restart PM2
pm2 restart all

# View logs
pm2 logs

# Database backup
pg_dump -U username franchise_db > backup.sql
```

---

## 🆘 Troubleshooting

### Issue: Frontend can't connect to Backend
**Solution:** Check CORS settings in `server.js` - add your frontend domain to allowedOrigins.

### Issue: Socket.io not connecting
**Solution:** Ensure Nginx WebSocket proxy is configured (see config above).

### Issue: Database connection fails
**Solution:** Check DATABASE_URL format and ensure PostgreSQL is running on server.

### Issue: 502 Bad Gateway
**Solution:** Check if backend is running (`pm2 status`) and port is correct.

---

## 📞 Support

For Hostinger-specific issues:
- Check Hostinger Knowledge Base
- Contact Hostinger Support via hPanel
- Node.js VPS documentation: https://www.hostinger.com/tutorials/vps
