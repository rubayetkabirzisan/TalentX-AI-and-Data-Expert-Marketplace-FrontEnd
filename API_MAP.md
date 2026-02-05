# JobMatch API Contract

This document outlines the complete API contract for the JobMatch platform. All endpoints follow RESTful conventions and use JWT authentication where required.

## Authentication

All authenticated endpoints require the following header:
```
Authorization: Bearer <jwt_token>
```

JWT tokens are obtained after successful login and should be stored securely in the client.

---

## Public Endpoints (No Authentication Required)

### 1. Get All Jobs

**Endpoint:** `GET /jobs?search=`

**Query Parameters:**
- `search` (optional): Search term to filter jobs by title, company, or skills

**Response:**
```json
[
  {
    "id": "job-1",
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "applicationCount": 5,
    "description": "We are looking for a Senior React Developer...",
    "tech_stack": ["React", "TypeScript", "Next.js"],
    "deadline": "2026-03-05"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved jobs
- `400 Bad Request` - Invalid query parameters

---

### 2. Get Job Details

**Endpoint:** `GET /jobs/:id`

**Path Parameters:**
- `id`: The unique identifier of the job

**Response:**
```json
{
  "id": "job-1",
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "description": "We are looking for...",
  "tech_stack": ["React", "TypeScript", "Next.js"],
  "deadline": "2026-03-05",
  "applicationCount": 5
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved job
- `404 Not Found` - Job does not exist

---

## Authentication Endpoints (Authenticated)

### 3. Get Current User

**Endpoint:** `GET /me`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "role": "Employer",
  "name": "John Doe"
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved user
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### 4. Onboard User (Set Role)

**Endpoint:** `POST /me/onboard`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "Employer"
}
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "role": "Employer",
  "name": "John Doe"
}
```

**Valid Roles:**
- `Employer` - User will post jobs and manage applicants
- `Talent` - User will apply to jobs and view invitations

**Status Codes:**
- `200 OK` - Successfully updated role
- `400 Bad Request` - Invalid role
- `401 Unauthorized` - Invalid or missing token

---

## Employer Endpoints (Authenticated - Role: Employer)

### 5. Create Job

**Endpoint:** `POST /employer/jobs`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "We are looking for...",
  "tech_stack": ["React", "TypeScript", "Next.js"],
  "deadline": "2026-03-05"
}
```

**Response:**
```json
{
  "id": "job-new-123",
  "title": "Senior React Developer",
  "company": "Tech Corp",
  "description": "We are looking for...",
  "tech_stack": ["React", "TypeScript", "Next.js"],
  "deadline": "2026-03-05",
  "applicationCount": 0
}
```

**Status Codes:**
- `201 Created` - Job successfully created
- `400 Bad Request` - Invalid job data
- `401 Unauthorized` - Invalid or missing token

---

### 6. Get Job Applicants

**Endpoint:** `GET /employer/jobs/:jobId/applicants`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `jobId`: The unique identifier of the job

**Response:**
```json
[
  {
    "id": "applicant-1",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "appliedAt": "2026-02-01T10:30:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved applicants
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Job not found

---

### 7. Invite Talent

**Endpoint:** `POST /employer/jobs/:jobId/invite`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `jobId`: The unique identifier of the job

**Request Body:**
```json
{
  "talentId": "talent-456"
}
```

**Response:**
```json
{
  "id": "invitation-789",
  "jobId": "job-123",
  "talentId": "talent-456",
  "sentAt": "2026-02-05T14:20:00Z",
  "status": "pending"
}
```

**Status Codes:**
- `200 OK` - Invitation successfully sent
- `400 Bad Request` - Invalid talent ID
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Job or talent not found

---

## Talent Endpoints (Authenticated - Role: Talent)

### 8. Apply to Job

**Endpoint:** `POST /talent/jobs/:jobId/apply`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `jobId`: The unique identifier of the job

**Request Body:**
```json
{
  "source": "search"
}
```

**Response:**
```json
{
  "id": "application-123",
  "jobId": "job-1",
  "userId": "user-456",
  "appliedAt": "2026-02-05T15:00:00Z",
  "status": "pending"
}
```

**Status Codes:**
- `200 OK` - Application successfully submitted
- `400 Bad Request` - Invalid job ID or already applied
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Job not found

---

### 9. Get Talent Invitations

**Endpoint:** `GET /talent/invitations`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "invitation-789",
    "jobTitle": "Senior React Developer",
    "company": "Tech Corp",
    "sentAt": "2026-02-05T14:20:00Z",
    "status": "pending"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved invitations
- `401 Unauthorized` - Invalid or missing token

---

### 10. Respond to Invitation

**Endpoint:** `POST /talent/invitations/:invId/respond`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Path Parameters:**
- `invId`: The unique identifier of the invitation

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid Status Values:**
- `accepted` - Accept the invitation
- `declined` - Decline the invitation

**Response:**
```json
{
  "id": "invitation-789",
  "jobTitle": "Senior React Developer",
  "company": "Tech Corp",
  "sentAt": "2026-02-05T14:20:00Z",
  "status": "accepted"
}
```

**Status Codes:**
- `200 OK` - Successfully updated invitation
- `400 Bad Request` - Invalid status
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Invitation not found

---

### 11. Get Talent Applications

**Endpoint:** `GET /talent/applications`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "application-123",
    "jobTitle": "Senior React Developer",
    "company": "Tech Corp",
    "appliedAt": "2026-02-05T15:00:00Z",
    "status": "pending"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved applications
- `401 Unauthorized` - Invalid or missing token

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message",
  "status": 400
}
```

### Common Status Codes:
- `400 Bad Request` - Invalid request parameters or malformed data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User lacks required permissions for the action
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error occurred

---

## Implementation Notes

1. **Token Management**: JWT tokens should be stored securely and included in all authenticated requests
2. **CORS**: Configure CORS headers to allow requests from your frontend domain
3. **Rate Limiting**: Consider implementing rate limiting for public endpoints
4. **Pagination**: Consider adding pagination parameters to list endpoints for large datasets
5. **Validation**: Validate all input data on both client and server side

---

## Example Usage

### Login and Get Current User
```bash
# Login (handled by auth system)
# Token received and stored

# Get current user
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer <jwt_token>"
```

### Browse and Apply to Job
```bash
# Get all jobs
curl -X GET "http://localhost:3000/api/jobs?search=React"

# Get specific job
curl -X GET http://localhost:3000/api/jobs/job-1

# Apply to job (requires authentication)
curl -X POST http://localhost:3000/api/talent/jobs/job-1/apply \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"source": "search"}'
```

### Create and Manage Jobs
```bash
# Create job (requires employer role)
curl -X POST http://localhost:3000/api/employer/jobs \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "...",
    "tech_stack": ["React", "TypeScript"],
    "deadline": "2026-03-05"
  }'

# Get applicants
curl -X GET http://localhost:3000/api/employer/jobs/job-1/applicants \
  -H "Authorization: Bearer <jwt_token>"
```
