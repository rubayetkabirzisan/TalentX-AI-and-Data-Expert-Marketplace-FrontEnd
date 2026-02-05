# JobMatch Demo - Sequential Flow Guide

## How to Use the Demo

This is a **no-authentication** demo of the JobMatch platform. Simply select your role on the landing page to explore the full functionality.

---

## Sequential Flow

### Step 1: Landing Page (/)
- **What you see**: Welcome page with role selection
- **Two options**:
  - **"I'm a Talent"** - Job seeker role
  - **"I'm Hiring"** - Employer role
- **Action**: Click on either role card to enter the respective dashboard

---

### Step 2A: Talent Dashboard (When you select "I'm a Talent")

#### Features Available:
1. **View Invitations Tab**
   - See job invitations from employers
   - Accept or decline opportunities
   - Track invitation status (pending, accepted, declined)

2. **View Applications Tab**
   - See all jobs you've applied to
   - Track application status (pending, reviewed, rejected, accepted)

3. **Browse Jobs Section**
   - Button to explore available job listings
   - Apply to jobs that match your skills

4. **Change Role Button**
   - Switch back to landing page to try employer role
   - Top right corner of dashboard

#### Demo Data Included:
- 1 pending invitation from TechCorp for "Senior React Developer"
- 1 application to StartupXYZ for "Full Stack Developer"

---

### Step 2B: Employer Dashboard (When you select "I'm Hiring")

#### Features Available:
1. **View Job Postings**
   - List of all posted jobs
   - See number of applications per job
   - Deadline for each listing
   - Tech stack requirements

2. **Post New Job**
   - Click "Post New Job" button
   - Fill in job details:
     - Job title
     - Job description
     - Tech stack (comma-separated)
   - Job will be added to your listings immediately

3. **View Applicants**
   - Click "View Applicants" on any job
   - See list of people who applied
   - Option to invite candidates to interview

4. **Change Role Button**
   - Switch back to landing page
   - Top right corner of dashboard

#### Demo Data Included:
- 2 sample job postings (Senior React Developer, Full Stack Developer)
- Each job shows application counts
- Mock applicants available for viewing

---

## User Flows

### Flow 1: Talent User Journey
```
Landing Page
    ↓
Click "I'm a Talent"
    ↓
Talent Dashboard
    ├─ View Invitations (Accept/Decline)
    ├─ View Applications (Track Status)
    └─ Browse Jobs (Find opportunities)
```

### Flow 2: Employer User Journey
```
Landing Page
    ↓
Click "I'm Hiring"
    ↓
Employer Dashboard
    ├─ View Job Postings
    ├─ Create New Job (Post Job form)
    ├─ View Applicants
    └─ Manage Candidates
```

---

## Demo Data Available

### Talent Demo Data
- **Invitations**: 1 pending (Senior React Developer at TechCorp)
- **Applications**: 1 (Full Stack Developer at StartupXYZ)

### Employer Demo Data
- **Posted Jobs**: 2 listings
  - Senior React Developer (5 applications)
  - Full Stack Developer (3 applications)
- **Applicants**: 2 mock candidates per job

---

## Key Features Demonstrated

### For Talent Users
✓ View received job invitations
✓ Accept or decline invitations
✓ Track application status
✓ Browse available jobs
✓ Easy role switching

### For Employer Users
✓ Create job postings
✓ View all postings at a glance
✓ See applicant count per job
✓ View detailed applicant profiles
✓ Invite candidates to interview
✓ Easy role switching

---

## Notes

- **No Login Required**: Simply select your role to start
- **Mock Data**: All data is simulated for demonstration
- **Full Functionality**: All buttons and features work within the demo
- **Real-time Updates**: When you create a job, it appears immediately
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## Next Steps

When ready to integrate with your backend:
1. Remove authentication bypass logic
2. Connect to actual API endpoints
3. Replace mock data with real database queries
4. Add user authentication (JWT tokens)
5. Implement real-time features
