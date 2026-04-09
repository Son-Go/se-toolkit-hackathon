# Deployment Guide

This guide will help you deploy StudyHub on Ubuntu 24.04 (or similar Linux distributions).

## Prerequisites

- Ubuntu 24.04 LTS (or similar)
- Minimum 2GB RAM
- Minimum 10GB storage
- Internet connection
- Sudo privileges

## Step 1: Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io -y

# Install Docker Compose
sudo apt install docker-compose -y

# Start Docker service
sudo systemctl enable --now docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version
```

## Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/se-toolkit-hackathon.git
cd se-toolkit-hackathon
```

## Step 3: Configure Environment Variables

```bash
# Create backend .env file
cat > backend/.env << EOF
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://studyhub:securepassword@db:5432/studyhub
JWT_SECRET=your-very-secret-key-change-this-in-production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
EOF
```

**Important**: Change the `JWT_SECRET` to a strong random string for production!

## Step 4: Start the Application

```bash
# Build and start all services
docker-compose up -d

# Check if all containers are running
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Step 5: Access the Application

- **Frontend**: Open browser and go to `http://your-server-ip`
- **Backend API**: `http://your-server-ip:3000/api`
- **API Health Check**: `http://your-server-ip:3000/api/health`

## Step 6: Test the Application

1. Open your browser and navigate to `http://your-server-ip`
2. Register a new account
3. Create a course
4. Upload a resource
5. Test all features

## Common Commands

### Stop the Application
```bash
docker-compose down
```

### Restart the Application
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
# Rebuild all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Reset Database
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Restart
docker-compose up -d
```

### Clean Up Everything
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v --rmi all

# Rebuild and start
docker-compose up -d --build
```

## Troubleshooting

### Backend Won't Start
```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# 1. Database not ready - wait a few seconds and restart
# 2. Port already in use - change port in docker-compose.yml
# 3. Environment variables missing - check backend/.env
```

### Frontend Can't Connect to Backend
```bash
# Verify backend is running
docker-compose ps

# Check if backend is accessible
curl http://localhost:3000/api/health

# Restart services
docker-compose restart backend frontend
```

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up -d
```

### Port Already in Use
```bash
# Find what's using the port
sudo lsof -i :3000  # For backend
sudo lsof -i :80    # For frontend
sudo lsof -i :5432  # For database

# Kill the process or change ports in docker-compose.yml
```

## Optional: Set Up Nginx Reverse Proxy

If you want to use a custom domain or HTTPS:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/studyhub

# Add the following configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/studyhub /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Optional: Set Up HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

## Security Best Practices

1. **Change JWT Secret**: Use a strong, random secret in `backend/.env`
2. **Use HTTPS**: Always use SSL/TLS in production
3. **Firewall**: Only expose necessary ports (80, 443)
4. **Regular Updates**: Keep Docker and system packages updated
5. **Backup Database**: Regularly backup PostgreSQL data
6. **Monitor Logs**: Check logs regularly for issues

## Backup and Restore

### Backup Database
```bash
# Create a backup
docker-compose exec db pg_dump -U studyhub studyhub > backup.sql

# Restore from backup
cat backup.sql | docker-compose exec -T db psql -U studyhub studyhub
```

### Backup Uploaded Files
```bash
# Backup uploads directory
docker-compose exec backend tar -czf /tmp/uploads-backup.tar.gz ./uploads

# Copy to host
docker-compose cp backend:/tmp/uploads-backup.tar.gz ./uploads-backup.tar.gz
```

## Monitoring

### Check Container Stats
```bash
docker stats
```

### Check Disk Usage
```bash
docker system df
```

### Clean Up Unused Resources
```bash
docker system prune -a
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Rebuild everything: `docker-compose down -v && docker-compose up -d --build`
