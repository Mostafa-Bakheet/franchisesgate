# 🚀 Franchise Gate - VPS Deployment Guide
## Server: server1.franchisegate.sa (104.207.70.175)

### 📋 Pre-Deployment Checklist

1. ✅ Build Frontend locally
2. ✅ Update API_URL in frontend config
3. ✅ Prepare environment variables
4. ✅ SSH access to server configured

### 🔧 Step 1: Build Frontend

```bash
# On Windows (run as Administrator)
build-frontend.bat

# Or manually:
cd frontend
npm ci
npm run build
```

### 🔧 Step 2: Configure Environment

1. Copy `deploy/env.template` to `.env`
2. Edit `.env` with your production values:
   - Database password (strong password)
   - JWT secret (random 32+ chars)
   - Any other API keys

### 🔧 Step 3: Deploy via SSH

#### Option A: Automated Script (Recommended)

```bash
# Using Git Bash or WSL on Windows
bash deploy-vps.sh
```

This script will:
- Build frontend
- Upload files to server
- Install Docker & Docker Compose
- Setup SSL certificates
- Start all services

#### Option B: Manual Deployment

**1. Connect to server:**
```bash
ssh root@104.207.70.175
```

**2. Install Docker:**
```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

**3. Setup project directory:**
```bash
mkdir -p /opt/franchisegate
cd /opt/franchisegate
```

**4. Upload files:**
```bash
# From your local machine, run:
scp -r backend/ root@104.207.70.175:/opt/franchisegate/
scp -r frontend/dist/ root@104.207.70.175:/opt/franchisegate/frontend/
scp -r nginx/ root@104.207.70.175:/opt/franchisegate/
scp docker-compose.yml root@104.207.70.175:/opt/franchisegate/
scp .env root@104.207.70.175:/opt/franchisegate/
```

**5. Setup SSL (Let's Encrypt):**
```bash
apt-get update
apt-get install -y certbot

# Get certificate
certbot certonly --standalone -d franchisegate.sa -d www.franchisegate.sa

# Copy to nginx folder
mkdir -p /opt/franchisegate/nginx/ssl
cp /etc/letsencrypt/live/franchisegate.sa/fullchain.pem /opt/franchisegate/nginx/ssl/
cp /etc/letsencrypt/live/franchisegate.sa/privkey.pem /opt/franchisegate/nginx/ssl/
```

**6. Start services:**
```bash
cd /opt/franchisegate
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed initial data (optional)
docker-compose exec app npx prisma db seed
```

### 🔧 Step 4: Verify Deployment

```bash
# Check containers are running
docker-compose ps

# View logs
docker-compose logs -f

# Test API
curl https://franchisegate.sa/api/health
```

### 📁 Project Structure on Server

```
/opt/franchisegate/
├── backend/           # Node.js API
├── frontend/dist/     # Built frontend
├── nginx/
│   ├── nginx.conf     # Nginx config
│   └── ssl/           # SSL certificates
├── uploads/           # File uploads
├── docker-compose.yml
└── .env               # Environment variables
```

### 🔄 SSL Auto-Renewal

The deployment script sets up auto-renewal. To verify:

```bash
crontab -l
# Should show: 0 12 * * * certbot renew --quiet && docker-compose restart nginx
```

### 🛠️ Common Commands

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db

# Restart services
docker-compose restart

# Update deployment (after code changes)
docker-compose down
docker-compose pull
docker-compose up -d

# Database backup
docker-compose exec db pg_dump -U franchisegate franchisegate_db > backup.sql

# Access database
docker-compose exec db psql -U franchisegate -d franchisegate_db
```

### 🚨 Troubleshooting

**Issue: SSL certificate errors**
```bash
# Renew manually
certbot renew --force-renewal
docker-compose restart nginx
```

**Issue: Database connection failed**
```bash
# Check database is running
docker-compose ps

# View database logs
docker-compose logs db

# Reset database (WARNING: deletes all data!)
docker-compose down -v
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
```

**Issue: 502 Bad Gateway**
```bash
# Check backend is running
docker-compose ps app
docker-compose logs app
```

### 📝 Important Files

| File | Purpose |
|------|---------|
| `deploy-vps.sh` | Automated deployment script |
| `build-frontend.bat` | Windows build script |
| `docker-compose.yml` | Docker orchestration |
| `nginx/nginx.conf` | Web server config |
| `backend/Dockerfile` | API container config |
| `deploy/env.template` | Environment variables template |

### 🌐 After Deployment

- **Website**: https://franchisegate.sa
- **API**: https://franchisegate.sa/api
- **Admin Panel**: https://franchisegate.sa/admin/dashboard

### 📞 Support

If issues occur during deployment:
1. Check Docker logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Ensure SSL certificates are valid
4. Check firewall settings (ports 80, 443, 5000)
