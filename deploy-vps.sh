#!/bin/bash
# Deployment Script for Franchise Gate VPS
# Server: server1.franchisegate.sa (104.207.70.175)

set -e

echo "🚀 Starting deployment to franchisegate.sa VPS..."

# Configuration
SERVER_IP="104.207.70.175"
SERVER_USER="root"
DOMAIN="franchisegate.sa"
DEPLOY_DIR="/opt/franchisegate"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd d:/franchisesgate/frontend || exit 1
npm ci 2>/dev/null || npm install
npm run build

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
cd d:/franchisesgate || exit 1

# Create tar excluding node_modules and dev files
tar -czf deploy-vps.tar.gz \
  backend/ \
  frontend/dist/ \
  nginx/ \
  docker-compose.yml \
  .env.production \
  prisma/ \
  uploads/ 2>/dev/null || true

# Copy to server
echo -e "${YELLOW}🚀 Uploading to server...${NC}"
scp deploy-vps.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

# Execute remote deployment
echo -e "${YELLOW}🔧 Setting up server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << EOF
  set -e
  
  echo "Creating deployment directory..."
  mkdir -p ${DEPLOY_DIR}
  cd ${DEPLOY_DIR}
  
  echo "Extracting files..."
  tar -xzf /tmp/deploy-vps.tar.gz
  rm /tmp/deploy-vps.tar.gz
  
  echo "Installing Docker if not present..."
  if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
  fi
  
  if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  fi
  
  echo "Setting up SSL with Let's Encrypt..."
  if ! command -v certbot &> /dev/null; then
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
  fi
  
  # Get SSL certificate
  certbot certonly --standalone -d ${DOMAIN} -d www.${DOMAIN} --agree-tos -n -m admin@${DOMAIN} || true
  
  # Copy certificates to nginx ssl folder
  mkdir -p nginx/ssl
  cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem nginx/ssl/ 2>/dev/null || echo "SSL not ready yet"
  cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem nginx/ssl/ 2>/dev/null || echo "SSL not ready yet"
  
  echo "Starting services..."
  docker-compose down 2>/dev/null || true
  docker-compose pull
  docker-compose build --no-cache
  docker-compose up -d
  
  echo "Running database migrations..."
  sleep 5
  docker-compose exec -T app npx prisma migrate deploy || echo "Migration may need manual intervention"
  
  echo "Setting up auto-renewal for SSL..."
  (crontab -l 2>/dev/null; echo "0 12 * * * certbot renew --quiet && docker-compose -f ${DEPLOY_DIR}/docker-compose.yml restart nginx") | crontab -
  
  echo "✅ Setup complete!"
EOF

# Cleanup
rm -f deploy-vps.tar.gz

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "🌐 Website: https://${DOMAIN}"
echo -e "🔌 API: https://${DOMAIN}/api"
echo ""
echo "📋 Next steps:"
echo "   1. SSH to server: ssh root@${SERVER_IP}"
echo "   2. Edit environment: nano /opt/franchisegate/.env"
echo "   3. View logs: docker-compose -f /opt/franchisegate/docker-compose.yml logs -f"
