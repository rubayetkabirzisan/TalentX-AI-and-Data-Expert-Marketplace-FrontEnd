/**
 * API_MAP Reference:
 *
 * Public Endpoints:
 * - GET /jobs?search=
 * - GET /jobs/:id
 *
 * Auth Endpoints:
 * - GET /me
 * - POST /me/onboard body: { role }
 *
 * Employer Endpoints:
 * - POST /employer/jobs
 * - GET /employer/jobs/:jobId/applicants
 * - POST /employer/jobs/:jobId/invite body { talentId }
 *
 * Talent Endpoints:
 * - POST /talent/jobs/:jobId/apply body { source }
 * - GET /talent/invitations
 * - POST /talent/invitations/:invId/respond body { status }
 * - GET /talent/applications
 *
 * Auth Header: Authorization: Bearer <token>
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

// Get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Set token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

// Clear token from localStorage
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

interface FetchOptions extends RequestInit {
  includeAuth?: boolean
}

// Mock data for development
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    description:
      'Looking for an experienced React developer to join our growing team. You will work on modern web applications using the latest technologies.',
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript knowledge',
      'Experience with Next.js',
      'Understanding of web performance optimization',
    ],
    tech_stack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    applicationCount: 12,
    deadline: '2026-03-31',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    description:
      'Join our fast-growing startup and build scalable web applications. We are looking for a full stack developer who can work on both frontend and backend.',
    requirements: [
      '3+ years of full stack development',
      'Node.js experience',
      'React or Vue.js proficiency',
      'Database design knowledge',
    ],
    tech_stack: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    applicationCount: 8,
    deadline: '2026-04-15',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudServices Inc',
    description:
      'Help us build and maintain our infrastructure. We are looking for a DevOps engineer with strong cloud experience.',
    requirements: [
      '4+ years of DevOps experience',
      'AWS or GCP expertise',
      'Kubernetes knowledge',
      'CI/CD pipeline experience',
    ],
    tech_stack: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    applicationCount: 5,
    deadline: '2026-03-20',
  },
]

// Generic fetch wrapper with auth
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  // Use mock data in development mode
  if (USE_MOCK_DATA) {
    return getMockData(endpoint, options)
  }

  const { includeAuth = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  headers.set('Content-Type', 'application/json')

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[API] Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Mock data handler
function getMockData(endpoint: string, options: FetchOptions): any {
  // GET /jobs?search=
  if (endpoint.startsWith('/jobs?')) {
    const params = new URLSearchParams(endpoint.split('?')[1])
    const search = params.get('search')?.toLowerCase() || ''

    const filtered = search
      ? MOCK_JOBS.filter(
          (job) =>
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search) ||
            job.tech_stack.some((tech) =>
              tech.toLowerCase().includes(search)
            )
        )
      : MOCK_JOBS

    return Promise.resolve(filtered)
  }

  // GET /jobs/:id
  if (endpoint.match(/^\/jobs\/[^/]+$/)) {
    const id = endpoint.split('/').pop()
    const job = MOCK_JOBS.find((j) => j.id === id)
    if (!job) {
      return Promise.reject(new Error('Job not found'))
    }
    return Promise.resolve(job)
  }

  // POST /talent/jobs/:jobId/apply
  if (endpoint.match(/^\/talent\/jobs\/[^/]+\/apply$/)) {
    return Promise.resolve({ success: true, message: 'Application submitted' })
  }

  // GET /talent/invitations
  if (endpoint === '/talent/invitations') {
    return Promise.resolve([
      {
        id: 'inv1',
        jobId: '1',
        jobTitle: 'Senior React Developer',
        company: 'TechCorp',
        status: 'pending',
        createdAt: '2026-02-01',
      },
    ])
  }

  // POST /talent/invitations/:invId/respond
  if (endpoint.match(/^\/talent\/invitations\/[^/]+\/respond$/)) {
    return Promise.resolve({ success: true, message: 'Response recorded' })
  }

  // GET /talent/applications
  if (endpoint === '/talent/applications') {
    return Promise.resolve([
      {
        id: 'app1',
        jobId: '2',
        jobTitle: 'Full Stack Developer',
        company: 'StartupXYZ',
        status: 'pending',
        appliedAt: '2026-02-03',
      },
    ])
  }

  // POST /employer/jobs
  if (endpoint === '/employer/jobs') {
    return Promise.resolve({
      id: 'newjob',
      ...options,
      message: 'Job created successfully',
    })
  }

  // GET /employer/jobs/:jobId/applicants
  if (endpoint.match(/^\/employer\/jobs\/[^/]+\/applicants$/)) {
    return Promise.resolve([
      {
        id: 'talent1',
        name: 'John Doe',
        email: 'john@example.com',
        appliedAt: '2026-02-01',
      },
      {
        id: 'talent2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        appliedAt: '2026-02-02',
      },
    ])
  }

  // POST /employer/jobs/:jobId/invite
  if (endpoint.match(/^\/employer\/jobs\/[^/]+\/invite$/)) {
    return Promise.resolve({ success: true, message: 'Invitation sent' })
  }

  // GET /me
  if (endpoint === '/me') {
    return Promise.resolve({
      id: 'user1',
      email: 'user@example.com',
      role: 'Talent',
    })
  }

  // POST /me/onboard
  if (endpoint === '/me/onboard') {
    return Promise.resolve({
      success: true,
      message: 'Onboarding completed',
    })
  }

  // Default: return error
  return Promise.reject(new Error(`Mock endpoint not found: ${endpoint}`))
}

// Jobs API
export async function getJobs(search?: string): Promise<any> {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  return apiFetch(`/jobs?${params.toString()}`, { includeAuth: false })
}

export async function getJobById(id: string): Promise<any> {
  return apiFetch(`/jobs/${id}`, { includeAuth: false })
}

// Auth API
export async function getCurrentUser(): Promise<any> {
  return apiFetch('/me')
}

export async function onboardUser(role: 'Employer' | 'Talent'): Promise<any> {
  return apiFetch('/me/onboard', {
    method: 'POST',
    body: JSON.stringify({ role }),
  })
}

// Employer API
export async function createJob(jobData: any): Promise<any> {
  return apiFetch('/employer/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  })
}

export async function getEmployerJobApplicants(jobId: string): Promise<any> {
  return apiFetch(`/employer/jobs/${jobId}/applicants`)
}

export async function inviteTalent(
  jobId: string,
  talentId: string
): Promise<any> {
  return apiFetch(`/employer/jobs/${jobId}/invite`, {
    method: 'POST',
    body: JSON.stringify({ talentId }),
  })
}

// Talent API
export async function applyToJob(jobId: string, source?: string): Promise<any> {
  return apiFetch(`/talent/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify({ source }),
  })
}

export async function getTalentInvitations(): Promise<any> {
  return apiFetch('/talent/invitations')
}

export async function respondToInvitation(
  invId: string,
  status: 'accepted' | 'declined'
): Promise<any> {
  return apiFetch(`/talent/invitations/${invId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  })
}

export async function getTalentApplications(): Promise<any> {
  return apiFetch('/talent/applications')
}
