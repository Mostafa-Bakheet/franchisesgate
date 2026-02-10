#!/bin/bash

# Hostinger Deployment Script for Franchise Marketplace
# Run this script on your Hostinger VPS

set -e

echo "🚀 Starting Franchise Marketplace Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/franchise-marketplace"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

echo -e "${YELLOW}Step 2: Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node -v
npm -v

echo -e "${YELLOW}Step 3: Installing PM2...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}Step 4: Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}Step 5: Cloning repository...${NC}"
# Replace with your actual repo URL
cd $APP_DIR
git clone https://github.com/yourusername/franchise-marketplace.git .

echo -e "${YELLOW}Step 6: Setting up Backend...${NC}"
cd $BACKEND_DIR

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Optional: Seed database
# npx prisma db seed

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOL
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
DATABASE_URL="postgresql://username:password@localhost:5432/franchise_db"
JWT_SECRET="$(openssl rand -base64 32)"
EOL
    echo -e "${RED}⚠️  Please update the .env file with your actual values!${NC}"
fi

echo -e "${YELLOW}Step 7: Starting Backend with PM2...${NC}"
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo -e "${YELLOW}Step 8: Setting up Nginx...${NC}"
sudo apt-get install -y nginx

# Copy Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/franchise-backend
sudo ln -sf /etc/nginx/sites-available/franchise-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

echo -e "${YELLOW}Step 9: Installing SSL Certificate (Let's Encrypt)...${NC}"
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate (uncomment after setting correct domain)
# sudo certbot --nginx -d your-domain.com -d www.your-domain.com --non-interactive --agree-tos --email your-email@example.com

echo -e "${YELLOW}Step 10: Setting up Firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000/tcp
sudo ufw --force enable

echo -e "${GREEN}✅ Backend deployment completed!${NC}"

echo -e "${YELLOW}Step 11: Building Frontend...${NC}"
cd $FRONTEND_DIR

# Create .env.production
cat > .env.production << EOL
VITE_BACKEND_URL=https://api.your-domain.com
EOL

# Install dependencies
npm install

# Build
npm run build

echo -e "${GREEN}✅ Frontend build completed!${NC}"
echo -e "${YELLOW}Upload the 'dist' folder to your Hostinger public_html${NC}"

echo ""
echo -e "${GREEN}🎉 Deployment Summary:${NC}"
echo "================================"
echo "Backend API: https://your-domain.com"
echo "Frontend: https://your-frontend-domain.com"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update .env with your actual values"
echo "2. Configure your domain DNS"
echo "3. Run SSL certificate command:"
echo "   sudo certbot --nginx -d your-domain.com"
echo "4. Upload frontend dist folder to Hostinger"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "pm2 status              - Check backend status"
echo "pm2 logs               - View logs"
echo "pm2 restart all        - Restart backend"
echo "sudo nginx -t          - Test Nginx config"
echo "sudo systemctl status nginx - Check Nginx status"
