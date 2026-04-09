# StudyHub

A collaborative platform for university students to organize, share, and manage study resources across courses.

## Demo

![Dashboard Screenshot](screenshots/dashboard.png)
![Resource Upload](screenshots/upload.png)

## Context

### End Users
University students who need to manage and share study materials for their courses.

### Problem
Study resources are scattered across different platforms (email, cloud storage, messaging apps), making it difficult to organize and find materials efficiently.

### Solution
StudyHub provides a centralized, searchable platform where students can upload resources to course-specific groups, tag them for easy discovery, and collaborate through comments.

## Features

### Implemented
- ✅ User registration and authentication
- ✅ Create and join course groups
- ✅ Upload study resources (PDFs, documents, links)
- ✅ Browse and filter resources by course
- ✅ Download resources
- ✅ Search resources by title, description, and tags
- ✅ Resource preview for PDFs and images
- ✅ Comment on resources
- ✅ Responsive design
- ✅ Docker deployment

### Not Yet Implemented
- ⬜ User profiles and activity feed
- ⬜ Resource rating system
- ⬜ Email notifications
- ⬜ Advanced user roles and permissions

## Usage

1. Register a new account or login
2. Create a course or join an existing one
3. Upload study materials (PDFs, documents, or links)
4. Browse and search resources in your courses
5. Preview resources directly in the browser
6. Comment on resources to collaborate with peers

## Deployment

### Requirements
- Ubuntu 24.04 (or similar Linux distribution)
- Docker and Docker Compose installed
- Minimum 2GB RAM, 10GB storage

### Step-by-Step Instructions

1. **Install Docker** (if not already installed):
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   sudo systemctl enable --now docker
   ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/se-toolkit-hackathon.git
   cd se-toolkit-hackathon
   ```

3. **Configure environment variables**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings:
   # JWT_SECRET=your-secret-key
   # DATABASE_URL=postgresql://studyhub:securepassword@db:5432/studyhub
   ```

4. **Start the application**:
   ```bash
   docker-compose up -d
   ```

5. **Access the application**:
   - Frontend: `http://your-server-ip`
   - Backend API: `http://your-server-ip:3000/api`

6. **Check logs** (if needed):
   ```bash
   docker-compose logs -f
   ```

### Stopping the Application
```bash
docker-compose down
```

### Resetting the Database
```bash
docker-compose down -v
docker-compose up -d
```
