module.exports = {
  apps: [{
    name: 'orientavto-backend',
    script: '/usr/bin/python3',
    args: '-m uvicorn api:app --host 0.0.0.0 --port 8001',
    cwd: '/var/www/orientavto.com/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: '/var/www/orientavto.com/logs/pm2-error.log',
    out_file: '/var/www/orientavto.com/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
