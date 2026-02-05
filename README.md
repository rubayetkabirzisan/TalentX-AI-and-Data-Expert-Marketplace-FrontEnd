# JobMatch - Job Matching Platform

A modern job matching platform built with Next.js that connects employers with top talent. This application provides a comprehensive solution for job posting, applications, and talent management.

## 🎯 Features

### For All Users
- **Public Job Listing**: Browse available jobs with search functionality
- **Job Detail View**: View complete job information, requirements, and deadlines
- **Authentication**: Secure JWT-based authentication system

### For Employers
- **Job Management**: Create, edit, and manage job postings
- **Applicant Tracking**: View all applicants for each job
- **Talent Invitations**: Send direct invitations to specific talent
- **Job Dashboard**: Central hub for managing all postings

### For Talent
- **Job Applications**: Apply to jobs that match your skills
- **Invitation Management**: Accept or decline job invitations
- **Application History**: Track all your applications and their status
- **Talent Dashboard**: Central hub for managing applications and invitations

## 🏗️ Architecture

### API Contract (API_MAP)

The platform uses the following API endpoints:

**Public Endpoints:**
- `GET /jobs?search=` - Get all jobs with optional search
- `GET /jobs/:id` - Get specific job details

**Auth Endpoints:**
- `GET /me` - Get current user information
- `POST /me/onboard` - Complete user onboarding with role selection

**Employer Endpoints:**
- `POST /employer/jobs` - Create a new job posting
- `GET /employer/jobs/:jobId/applicants` - Get applicants for a job
- `POST /employer/jobs/:jobId/invite` - Send invitation to talent

**Talent Endpoints:**
- `POST /talent/jobs/:jobId/apply` - Apply to a job
- `GET /talent/invitations` - Get all invitations
- `POST /talent/invitations/:invId/respond` - Accept/decline invitation
- `GET /talent/applications` - Get application history

**Auth Header:**
All authenticated endpoints require:
```
Authorization: Bearer <jwt_token>
```

## 🚀 Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
# Create a .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Public jobs list (Screen 1)
│   ├── jobs/
│   │   └── [id]/page.tsx        # Job detail page (Screen 2)
│   ├── login/page.tsx           # Login page (Screen 3)
│   ├── signup/page.tsx          # Sign up page
│   ├── onboard/page.tsx         # Role onboarding (Screen 3)
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard (Screen 4 & 5)
│   │   ├── create/page.tsx      # Create job page
│   │   └── invitations/page.tsx # Invitations redirect
│   └── layout.tsx               # Root layout
├── components/
│   ├── employer-dashboard.tsx   # Employer dashboard (Screen 4)
│   ├── talent-dashboard.tsx     # Talent dashboard (Screen 5)
│   └── ui/                      # Shadcn UI components
├── lib/
│   ├── api-client.ts            # API client utilities
│   ├── auth-context.tsx         # Authentication context
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
└── styles/                      # Global styles
```

## 🔐 Authentication Flow

1. **Sign Up**: New users create an account with email and password
2. **Login**: Users sign in with credentials
3. **Onboarding**: After login, users select their role (Employer or Talent)
4. **JWT Token**: On successful login, users receive a JWT token stored in localStorage
5. **Token Usage**: JWT token is automatically included in all API requests

## 🎨 Design

The application uses a clean, modern design with:
- **shadcn/ui** - Component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Consistent Typography** - Clear hierarchy and readability

## 🔄 User Flows

### Employer Flow
1. Sign up/Login
2. Select "Employer" role during onboarding
3. View employer dashboard
4. Create job postings via "Post Job" button
5. View applicants for each job
6. Send invitations to selected candidates

### Talent Flow
1. Sign up/Login
2. Select "Talent" role during onboarding
3. View public jobs and search
4. Apply to jobs
5. View applications in dashboard
6. View and respond to invitations from employers

### Public Flow
1. Browse all job listings
2. Search for specific jobs
3. View job details
4. Click "Apply" to go to login (if not authenticated)

## 🛠️ Development

### Adding Backend Integration

To connect to your backend API:

1. Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. Modify API endpoints in `lib/api-client.ts` to match your backend
3. Implement proper authentication in `lib/auth-context.tsx`

### Mock Data

Currently, the application uses mock data for demonstration. Replace with real API calls:

```typescript
// In components/employer-dashboard.tsx
// Replace mock data with API calls from lib/api-client.ts
```

## 📝 Future Enhancements

- AI-powered job description generation (POST /ai/generate-jd)
- Advanced filtering and sorting
- User profiles and portfolio uploads
- Email notifications
- Interview scheduling
- Skills assessment and matching
- Analytics and reporting dashboard

## 🤝 Contributing

This is a demo application. Feel free to fork, modify, and use as a foundation for your own job matching platform.

## 📄 License

This project is open source and available under the MIT License.

## 📧 Support

For issues or questions, please open an issue in the repository or contact the development team.
