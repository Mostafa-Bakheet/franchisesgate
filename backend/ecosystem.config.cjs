// PM2 Ecosystem Configuration
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'franchise-backend',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '10s',
      
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Auto restart on failure
      autorestart: true,
      
      // Memory limit
      max_memory_restart: '1G'
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/franchise-marketplace.git',
      path: '/var/www/franchise-backend',
      'post-deploy': 'cd backend && npm install && npx prisma generate && npx prisma migrate deploy && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get update && apt-get install -y git nodejs npm postgresql'
    }
  }
};
