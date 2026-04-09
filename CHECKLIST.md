# Pre-Submission Checklist

Use this checklist to ensure everything is ready before submitting your hackathon project.

## ✅ Code Completion

- [ ] All Version 1 features implemented
  - [ ] User registration and login working
  - [ ] Course creation working
  - [ ] Resource upload working
  - [ ] Resource browsing and viewing working
  - [ ] Resource download working
  
- [ ] All Version 2 features implemented
  - [ ] Search and filtering working
  - [ ] Resource previews working (PDF, images, links)
  - [ ] Comments system working
  - [ ] Tags system working

- [ ] No console errors in browser
- [ ] No server errors in backend logs
- [ ] All critical bugs fixed

## ✅ Git Repository

- [ ] Repository is named `se-toolkit-hackathon`
- [ ] Repository is public (not private)
- [ ] All code is committed
  ```bash
  git add .
  git commit -m "feat: complete StudyHub implementation"
  git push origin main
  ```
- [ ] Git history is clean (no WIP commits, no debug code)
- [ ] `.gitignore` is properly configured
- [ ] `node_modules/` is NOT in the repository
- [ ] `.env` files are NOT in the repository (only `.env.example`)

## ✅ License

- [ ] `LICENSE` file exists in repository root
- [ ] License is MIT License
- [ ] Copyright year is correct (2026)

## ✅ README.md

- [ ] Product name is at the top (as title)
- [ ] One-line description included
- [ ] Demo section with screenshots
  - [ ] At least 2-3 relevant screenshots
  - [ ] Screenshots are in `screenshots/` directory
  - [ ] Image paths in README are correct
- [ ] Product context section
  - [ ] End users described
  - [ ] Problem explained
  - [ ] Solution described
- [ ] Features section
  - [ ] Implemented features listed (with ✅)
  - [ ] Not implemented features listed (with ⬜)
- [ ] Usage section with instructions
- [ ] Deployment section with:
  - [ ] OS specified (Ubuntu 24.04)
  - [ ] Prerequisites listed
  - [ ] Step-by-step instructions provided
  - [ ] Docker commands included

## ✅ Docker Configuration

- [ ] `docker-compose.yml` exists and works
- [ ] All services defined:
  - [ ] PostgreSQL database
  - [ ] Backend API
  - [ ] Frontend web app
- [ ] Dockerfiles exist:
  - [ ] `docker/backend.Dockerfile`
  - [ ] `docker/frontend.Dockerfile`
- [ ] Docker setup tested locally
- [ ] `docker-compose up -d` works without errors

## ✅ Deployment

- [ ] Application deployed to university VM
- [ ] Application is accessible from external network
- [ ] All services running (`docker-compose ps`)
- [ ] Frontend accessible at `http://your-vm-ip`
- [ ] Backend API accessible
- [ ] Database persistent (survives restart)
- [ ] File uploads working on deployed version

## ✅ Testing

- [ ] Complete user flow tested end-to-end:
  - [ ] Register new account
  - [ ] Login with credentials
  - [ ] Create a course
  - [ ] Upload a resource (file)
  - [ ] Upload a resource (link)
  - [ ] Browse resources
  - [ ] Search resources
  - [ ] Filter resources
  - [ ] View resource details
  - [ ] Preview PDF (if uploaded)
  - [ ] Preview image (if uploaded)
  - [ ] Add comment to resource
  - [ ] Delete own comment
  - [ ] Download resource
  - [ ] Delete own resource
  - [ ] Join another course
  - [ ] Logout

- [ ] Edge cases tested:
  - [ ] Invalid login credentials
  - [ ] Duplicate email registration
  - [ ] Weak password (< 6 characters)
  - [ ] Upload invalid file type
  - [ ] Upload oversized file
  - [ ] Search with no results
  - [ ] Empty course/resource states

## ✅ Presentation (5 Slides)

- [ ] **Slide 1: Title**
  - [ ] Product title: "StudyHub"
  - [ ] Your name
  - [ ] University email
  - [ ] Your group

- [ ] **Slide 2: Context**
  - [ ] End-user described
  - [ ] Problem explained
  - [ ] One-sentence product idea

- [ ] **Slide 3: Implementation**
  - [ ] Tech stack mentioned
  - [ ] Version 1 features explained
  - [ ] Version 2 features explained
  - [ ] TA feedback points addressed

- [ ] **Slide 4: Demo Video** ⚠️ MOST IMPORTANT
  - [ ] Video recorded (max 2 minutes)
  - [ ] Voice-over included
  - [ ] Shows complete user flow
  - [ ] Shows Version 2 features
  - [ ] No sensitive data visible
  - [ ] Video quality is good
  - [ ] Audio quality is clear

- [ ] **Slide 5: Links**
  - [ ] GitHub repo link included
  - [ ] QR code for GitHub repo
  - [ ] Deployed product link included
  - [ ] QR code for deployed product

## ✅ Moodle Submission

- [ ] Presentation PDF exported
- [ ] All files ready:
  - [ ] 5-slide presentation (PDF)
  - [ ] Demo video file (if required)
- [ ] Moodle submission completed
- [ ] Submission confirmed

## ✅ Final Checks

- [ ] No passwords or secrets in code
- [ ] No hardcoded credentials
- [ ] Environment variables used for secrets
- [ ] Code follows consistent style
- [ ] No console.log() statements left in production code
- [ ] No commented-out code blocks
- [ ] TODO comments removed or justified

## 📝 Demo Video Script (Suggested)

**Time: 2 minutes maximum**

1. **0:00-0:15** - Show login page, register new user
2. **0:15-0:30** - Dashboard, create a course
3. **0:30-0:50** - Upload a PDF resource with tags
4. **0:50-1:10** - Browse resources, use search/filter
5. **1:10-1:30** - View resource, show PDF preview
6. **1:30-1:50** - Add comment to resource
7. **1:50-2:00** - Quick wrap-up

**Tips:**
- Speak clearly and explain what you're doing
- Show that it's a working product, not a prototype
- Mention it's built with React, Express, PostgreSQL, Docker
- Keep it under 2 minutes!

## 🎯 TA Feedback Implementation

After TA reviews Version 1:

- [ ] All TA feedback noted
- [ ] Critical feedback addressed in Version 2
- [ ] Feedback implementation documented
- [ ] Mentioned in presentation slide 3

## 🚀 Deployment Verification

On deployed version, verify:

- [ ] Registration works
- [ ] Login works
- [ ] Can create course
- [ ] Can upload file
- [ ] Can view resources
- [ ] Files download correctly
- [ ] Search works
- [ ] Comments work
- [ ] No errors in browser console
- [ ] Mobile responsive

## 📊 Repository Statistics (Optional but Good)

- [ ] Meaningful commit messages
- [ ] Regular commits (shows steady progress)
- [ ] Feature branches used (optional)
- [ ] At least 15-20 commits total

## ✅ Before You Submit

Run through this one final time:

1. Open your GitHub repo in browser
2. Check README renders correctly
3. Check all files are present
4. Check license is there
5. Click deployed product link
6. Test the deployed application
7. Check demo video plays correctly
8. Review presentation slides
9. Submit on Moodle
10. Confirm submission

---

## 🎓 Good Luck!

You've built a complete full-stack application. Be proud of your work!

**Remember:** The demo video is the most important part. Make it count!
