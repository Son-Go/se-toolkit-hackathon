# Quick Start Guide

Get StudyHub running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed OR Docker installed

## Option 1: Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost
# Backend: http://localhost:3000
```

That's it! The application is now running with:
- PostgreSQL database
- Backend API
- Frontend web app

## Option 2: Run Locally (Development)

### Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
    cp .env.example .env

# Start PostgreSQL (if not using Docker)
# Make sure database is running and accessible

# Start the server
npm run dev
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3001`

## First Steps

1. **Register an account**: Go to `/register`
2. **Create a course**: Click "Create Course" on the dashboard
3. **Upload a resource**: Navigate to your course and click "Upload Resource"
4. **Browse and comment**: View resources and add comments

## Default Configuration

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://studyhub:securepassword@localhost:5432/studyhub
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend
- Automatically proxies to backend at `http://localhost:3000`
- No additional configuration needed

## Testing the API

```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [README.md](README.md) for full documentation
- View the [PROJECT_PLAN.md](../PROJECT_PLAN.md) for development details

## Troubleshooting

**Backend won't start:**
```bash
cd backend
npm install
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env
```

**Frontend won't start:**
```bash
cd frontend
npm install
npm start
```

**Docker issues:**
```bash
docker-compose down -v
docker-compose up -d --build
```

## Need Help?

Check the full documentation in [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting and deployment instructions.
