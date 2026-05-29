# API Endpoints Reference Guide

## Base URL Configuration

```typescript
// src/lib/api-client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
// Results in: http://localhost:9000/api

// Example: GET /api/jobs becomes http://localhost:9000/api/jobs
```

---

## API Client Setup

### Request/Response Cycle

```typescript
// All requests go through apiClient with:
// - withCredentials: true (includes cookies)
// - timeout: 10000 (10 seconds)
// - Automatic error handling
// - Token refresh on 401

import apiClient from "@/lib/api-client";

// GET request
const response = await apiClient.get("/endpoint");

// POST request
const response = await apiClient.post("/endpoint", { data });

// PATCH request
const response = await apiClient.patch("/endpoint", { data });

// DELETE request
const response = await apiClient.delete("/endpoint");
```

---

## Authentication Endpoints

### 1. Login

**Endpoint**: `POST /api/auth/login`

**Location**: `src/api/auth/login.ts`

**Purpose**: Authenticate user and receive tokens

**Request**:
```typescript
// Using FormData for potential file uploads
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('password', 'password123');

await apiClient.post('/api/auth/login', formData);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin|client|user",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Token Storage**:
- `token` → Cookie (httpOnly)
- `refreshToken` → Cookie (httpOnly)
- `role` → Cookie
- User data → Redux store

**Frontend Usage**:
```typescript
import { useLogin } from '@/features/auth/hooks';

const { mutate: login } = useLogin();

login(
  { email: 'user@example.com', password: 'password' },
  {
    onSuccess: (data) => {
      // Redirect to dashboard
      navigate('/dashboard');
    },
  }
);
```

---

### 2. Register

**Endpoint**: `POST /api/auth/register`

**Location**: `src/api/auth/register.ts`

**Purpose**: Create new user account

**Request**:
```typescript
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'client' | 'user';
  phoneNumber?: string;
  companyName?: string;  // Required for client role
}

const payload: RegisterPayload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'user',
  phoneNumber: '+1234567890',
};

await apiClient.post('/api/auth/register', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "user-124",
      "email": "john@example.com",
      "role": "user",
      "isVerified": false
    },
    "verificationToken": "verification-token-123"
  }
}
```

**Response Errors**:
```json
// 409 Conflict - Email already exists
{
  "success": false,
  "message": "Email already registered"
}

// 400 Bad Request - Validation failed
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

---

### 3. Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Location**: `src/api/auth/refreshToken.ts`

**Purpose**: Get new access token using refresh token

**Request**:
```typescript
// Automatic - refresh token in cookie triggers this
// Called by AuthProvider when token expires
await apiClient.post('/api/auth/refresh');
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "token": "new-access-token",
    "expiresIn": 3600
  }
}
```

**Auto-Triggered On**:
- Manual refresh call in middleware
- 401 response from protected endpoint
- Page refresh with valid refreshToken

---

### 4. Logout

**Endpoint**: `POST /api/auth/logout`

**Location**: `src/api/auth/logout.ts`

**Purpose**: End user session and invalidate tokens

**Request**:
```typescript
await apiClient.post('/api/auth/logout');
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Client-Side Actions**:
1. Clear cookies (token, refreshToken)
2. Clear Redux auth state
3. Clear React Query cache
4. Redirect to login page

---

### 5. Verify Email

**Endpoint**: `POST /api/auth/verify`

**Location**: `src/api/auth/verify.ts`

**Purpose**: Verify email address with verification token

**Request**:
```typescript
interface VerifyPayload {
  email: string;
  verificationToken: string;
}

const payload: VerifyPayload = {
  email: 'john@example.com',
  verificationToken: 'verification-token-123',
};

await apiClient.post('/api/auth/verify', payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Response Error**:
```json
// 400 Bad Request - Invalid token
{
  "success": false,
  "message": "Invalid or expired verification token"
}

// 409 Conflict - Already verified
{
  "success": false,
  "message": "Email already verified"
}
```

---

## User Endpoints

### 1. Get Current User

**Endpoint**: `GET /api/users/me`

**Purpose**: Fetch currently authenticated user

**Request**:
```typescript
// No payload needed - uses authentication cookie
await apiClient.get('/api/users/me');
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin|client|user",
    "isVerified": true,
    "profile": {
      "phoneNumber": "+1234567890",
      "location": "New York, USA"
    }
  }
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Job Management Endpoints

### 1. Get All Jobs

**Endpoint**: `GET /api/jobs`

**Purpose**: Fetch list of all jobs with pagination and filtering

**Query Parameters**:
```typescript
interface JobsQueryParams {
  page?: number;           // Default: 1
  limit?: number;          // Default: 10
  category?: string;       // Filter by category ID
  search?: string;         // Search in title/description
  status?: 'open' | 'closed' | 'draft';
  sortBy?: 'createdAt' | 'title' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

// Example
await apiClient.get('/api/jobs', {
  params: {
    page: 1,
    limit: 20,
    category: 'cat-123',
    search: 'React',
    sortBy: 'createdAt',
  }
});
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-123",
        "title": "Senior React Developer",
        "description": "Looking for experienced React developer...",
        "category": {
          "id": "cat-123",
          "name": "Web Development"
        },
        "company": "Tech Corp",
        "location": "Remote",
        "salaryRange": {
          "min": 80000,
          "max": 120000,
          "currency": "USD"
        },
        "requirements": ["React", "TypeScript", "Node.js"],
        "status": "open",
        "applicantCount": 25,
        "createdAt": "2026-05-20T10:00:00Z",
        "updatedAt": "2026-05-25T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

**Frontend Usage**:
```typescript
import { useGetJobs } from '@/features/job-management/queries';

const { data: jobsData, isLoading } = useGetJobs({
  page: 1,
  limit: 20,
  search: 'React',
});

const { jobs, pagination } = jobsData || {};
```

---

### 2. Get Single Job

**Endpoint**: `GET /api/jobs/:jobId`

**Purpose**: Fetch detailed information about a specific job

**URL Parameters**:
```typescript
const jobId = 'job-123';
await apiClient.get(`/api/jobs/${jobId}`);
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "job-123",
    "title": "Senior React Developer",
    "description": "Detailed job description...",
    "category": { "id": "cat-123", "name": "Web Development" },
    "company": "Tech Corp",
    "location": "Remote",
    "salaryRange": { "min": 80000, "max": 120000, "currency": "USD" },
    "requirements": ["React", "TypeScript", "Node.js"],
    "responsibilities": ["Build features", "Code review", "Mentoring"],
    "status": "open",
    "applicantCount": 25,
    "applicants": [
      {
        "id": "applicant-1",
        "candidateName": "Jane Smith",
        "appliedAt": "2026-05-25T10:00:00Z",
        "status": "under_review"
      }
    ],
    "createdBy": "admin-123",
    "createdAt": "2026-05-20T10:00:00Z"
  }
}
```

**Response Error (404)**:
```json
{
  "success": false,
  "message": "Job not found"
}
```

---

### 3. Create Job

**Endpoint**: `POST /api/jobs`

**Purpose**: Create new job posting (Admin/Client only)

**Request**:
```typescript
interface CreateJobPayload {
  title: string;
  description: string;
  categoryId: string;
  company: string;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  responsibilities?: string[];
  jobType?: 'full-time' | 'part-time' | 'contract';
  experience?: 'entry' | 'mid' | 'senior';
}

const payload: CreateJobPayload = {
  title: 'Senior React Developer',
  description: 'We are looking for...',
  categoryId: 'cat-123',
  company: 'Tech Corp',
  location: 'New York, USA',
  salaryRange: { min: 80000, max: 120000, currency: 'USD' },
  requirements: ['React', 'TypeScript', 'Node.js'],
  jobType: 'full-time',
  experience: 'senior',
};

await apiClient.post('/api/jobs', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": "job-124",
    "title": "Senior React Developer",
    "status": "draft",
    "createdAt": "2026-05-26T10:00:00Z"
  }
}
```

**Response Errors**:
```json
// 400 Bad Request - Validation failed
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "categoryId": "Invalid category"
  }
}

// 403 Forbidden - Insufficient permissions
{
  "success": false,
  "message": "You do not have permission to create jobs"
}
```

---

### 4. Update Job

**Endpoint**: `PATCH /api/jobs/:jobId`

**Purpose**: Update existing job posting

**Request**:
```typescript
interface UpdateJobPayload {
  title?: string;
  description?: string;
  categoryId?: string;
  salaryRange?: { min: number; max: number };
  status?: 'open' | 'closed' | 'draft';
  // ... other optional fields
}

const payload: UpdateJobPayload = {
  title: 'Updated Job Title',
  status: 'open',
};

await apiClient.patch(`/api/jobs/${jobId}`, payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": "job-123",
    "title": "Updated Job Title",
    "updatedAt": "2026-05-26T11:00:00Z"
  }
}
```

---

### 5. Delete Job

**Endpoint**: `DELETE /api/jobs/:jobId`

**Purpose**: Delete job posting

**Request**:
```typescript
await apiClient.delete(`/api/jobs/${jobId}`);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## Category Endpoints

### 1. Get All Categories

**Endpoint**: `GET /api/categoriess`

**Purpose**: Fetch all job categories

**Query Parameters**:
```typescript
interface CategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

await apiClient.get('/api/categoriess', {
  params: { page: 1, limit: 50 }
});
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-123",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Web development jobs",
        "icon": "💻",
        "color": "#0066CC",
        "jobCount": 45,
        "testCount": 12,
        "order": 1,
        "isActive": true,
        "createdAt": "2026-01-01T00:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 15 }
  }
}
```

---

### 2. Create Category

**Endpoint**: `POST /api/categoriess`

**Purpose**: Create new category (Admin only)

**Request**:
```typescript
interface CreateCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}

const payload: CreateCategoryPayload = {
  name: 'Data Science',
  description: 'Data science and analytics roles',
  icon: '📊',
  color: '#FF6B6B',
};

await apiClient.post('/api/categoriess', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "cat-124",
    "name": "Data Science",
    "slug": "data-science",
    "createdAt": "2026-05-26T10:00:00Z"
  }
}
```

---

## Test Management Endpoints

### 1. Get All Tests

**Endpoint**: `GET /api/tests`

**Purpose**: Fetch list of available tests

**Query Parameters**:
```typescript
interface TestsQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  status?: 'active' | 'inactive';
}

await apiClient.get('/api/tests', {
  params: { page: 1, limit: 20, categoryId: 'cat-123' }
});
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "tests": [
      {
        "id": "test-123",
        "title": "React Fundamentals",
        "description": "Test your React knowledge...",
        "category": { "id": "cat-123", "name": "Web Development" },
        "duration": 60,
        "totalQuestions": 25,
        "passingScore": 70,
        "difficulty": "intermediate",
        "enrollmentCount": 150,
        "completionRate": 0.65,
        "createdAt": "2026-05-01T00:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 45 }
  }
}
```

---

### 2. Create Test

**Endpoint**: `POST /api/tests`

**Purpose**: Create new test (Admin only)

**Request**:
```typescript
interface CreateTestPayload {
  title: string;
  description: string;
  categoryId: string;
  duration: number;          // minutes
  totalQuestions: number;
  passingScore: number;      // percentage
  difficulty?: 'easy' | 'intermediate' | 'hard';
  questions?: Question[];
}

const payload: CreateTestPayload = {
  title: 'React Advanced',
  description: 'Advanced React concepts test',
  categoryId: 'cat-123',
  duration: 90,
  totalQuestions: 30,
  passingScore: 75,
  difficulty: 'hard',
};

await apiClient.post('/api/tests', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "id": "test-124",
    "title": "React Advanced",
    "status": "draft",
    "createdAt": "2026-05-26T10:00:00Z"
  }
}
```

---

### 3. Enroll in Test

**Endpoint**: `POST /api/tests/:testId/enroll`

**Purpose**: Enroll candidate in test

**Request**:
```typescript
interface EnrollPayload {
  userIds?: string[];      // For admin enrolling multiple users
}

// Candidate enrolling themselves
await apiClient.post(`/api/tests/${testId}/enroll`);

// Admin enrolling multiple users
await apiClient.post(`/api/tests/${testId}/enroll`, {
  userIds: ['user-1', 'user-2', 'user-3'],
});
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Enrolled successfully",
  "data": {
    "enrollmentId": "enroll-123",
    "testId": "test-123",
    "status": "enrolled",
    "enrolledAt": "2026-05-26T10:00:00Z"
  }
}
```

---

## AI Test Endpoints

### 1. Parse Resume

**Endpoint**: `POST /api/aitest/parse`

**Purpose**: Extract information from uploaded resume

**Request**:
```typescript
interface ParseResumePayload {
  resumeFile: File;
  // or
  resumeUrl: string;
}

// Using FormData
const formData = new FormData();
formData.append('resume', resumeFile);

await apiClient.post('/api/aitest/parse', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "extractedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "location": "New York, USA",
      "summary": "Experienced software engineer...",
      "experiences": [
        {
          "jobTitle": "Senior Developer",
          "company": "Tech Corp",
          "duration": "2 years",
          "description": "Led development of..."
        }
      ],
      "education": [
        {
          "degree": "Bachelor's in Computer Science",
          "school": "University Name",
          "year": 2020
        }
      ],
      "skills": ["JavaScript", "React", "Node.js", "Python"],
      "certifications": ["AWS Developer Associate"]
    }
  }
}
```

---

### 2. Generate Questions

**Endpoint**: `POST /api/aitest/questions`

**Purpose**: Generate AI questions based on resume/job requirements

**Request**:
```typescript
interface GenerateQuestionsPayload {
  resumeData?: ParsedResumeData;
  jobRequirements?: string[];
  numberOfQuestions?: number;    // Default: 10
  difficulty?: 'easy' | 'medium' | 'hard';
  questionTypes?: ('short_answer' | 'essay' | 'multiple_choice')[];
}

const payload: GenerateQuestionsPayload = {
  resumeData: parsedResume,
  jobRequirements: ['React', 'TypeScript', 'Node.js'],
  numberOfQuestions: 15,
  difficulty: 'intermediate',
  questionTypes: ['multiple_choice', 'short_answer'],
};

await apiClient.post('/api/aitest/questions', payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "q-1",
        "text": "What is the difference between useState and useReducer?",
        "type": "short_answer",
        "category": "React",
        "difficulty": "intermediate",
        "expectedAnswer": "useState is for simple state...",
        "hints": ["Consider complexity", "Think about reducer pattern"],
        "timeLimit": 300
      },
      {
        "id": "q-2",
        "text": "Which of the following is a React hook?",
        "type": "multiple_choice",
        "options": ["A) useState", "B) getState", "C) setState"],
        "correctAnswer": "A",
        "category": "React"
      }
    ],
    "totalQuestions": 15,
    "estimatedDuration": 900
  }
}
```

---

### 3. Evaluate Answers

**Endpoint**: `POST /api/aitest/evaluate`

**Purpose**: Evaluate candidate answers and generate score

**Request**:
```typescript
interface EvaluateAnswersPayload {
  enrollmentId: string;
  testAttemptId: string;
  answers: {
    questionId: string;
    answer: string;
    timeSpent: number;      // seconds
  }[];
}

const payload: EvaluateAnswersPayload = {
  enrollmentId: 'enroll-123',
  testAttemptId: 'attempt-456',
  answers: [
    {
      questionId: 'q-1',
      answer: 'useState is for simple state, useReducer for complex logic...',
      timeSpent: 120,
    },
    {
      questionId: 'q-2',
      answer: 'A',
      timeSpent: 45,
    },
  ],
};

await apiClient.post('/api/aitest/evaluate', payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "score": 82,
    "passed": true,
    "passingScore": 70,
    "totalQuestions": 15,
    "correctAnswers": 12,
    "evaluationDetails": [
      {
        "questionId": "q-1",
        "status": "correct",
        "score": 10,
        "feedback": "Excellent explanation of the difference..."
      },
      {
        "questionId": "q-2",
        "status": "correct",
        "score": 10,
        "feedback": "Correct answer!"
      }
    ],
    "completedAt": "2026-05-26T11:30:00Z",
    "resultId": "result-789"
  }
}
```

---

### 4. Report Violation

**Endpoint**: `POST /api/aitest/violation`

**Purpose**: Report suspected test violation

**Request**:
```typescript
interface ReportViolationPayload {
  testAttemptId: string;
  violationType: 'tab_switch' | 'suspicious_time' | 'copy_paste' | 'multiple_tabs' | 'webcam_disabled' | 'screen_recording_disabled';
  description: string;
  timestamp: Date;
  metadata?: {
    timeRemaining?: number;
    questionsSolved?: number;
    suspiciousPattern?: string;
  };
}

const payload: ReportViolationPayload = {
  testAttemptId: 'attempt-456',
  violationType: 'tab_switch',
  description: 'Candidate switched tabs 3 times in 2 minutes',
  timestamp: new Date(),
  metadata: {
    timeRemaining: 1200,
    questionsSolved: 8,
  },
};

await apiClient.post('/api/aitest/violation', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Violation reported successfully",
  "data": {
    "violationId": "violation-123",
    "testAttemptId": "attempt-456",
    "severity": "medium",
    "status": "pending_review",
    "reportedAt": "2026-05-26T11:35:00Z"
  }
}
```

---

## Profile Endpoints

### 1. Get Candidate Profile

**Endpoint**: `GET /api/profile`

**Purpose**: Get current user's profile

**Request**:
```typescript
await apiClient.get('/api/profile');
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": "profile-123",
    "userId": "user-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "location": "New York, USA",
    "profileImage": "https://s3.amazonaws.com/...",
    "bio": "Senior software engineer with 5 years of experience",
    "resume": "https://s3.amazonaws.com/resume.pdf",
    "experiences": [
      {
        "id": "exp-1",
        "jobTitle": "Senior Developer",
        "company": "Tech Corp",
        "startDate": "2021-01-01",
        "endDate": null,
        "isCurrentlyWorking": true,
        "description": "Led development team..."
      }
    ],
    "skills": [
      {
        "id": "skill-1",
        "name": "JavaScript",
        "proficiency": "expert",
        "endorsements": 15
      }
    ],
    "completionPercentage": 85,
    "verificationStatus": "verified",
    "createdAt": "2026-01-15T00:00:00Z"
  }
}
```

---

### 2. Update Profile

**Endpoint**: `PATCH /api/profile`

**Purpose**: Update user profile information

**Request**:
```typescript
interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
}

const payload: UpdateProfilePayload = {
  location: 'San Francisco, USA',
  bio: 'Updated bio...',
};

await apiClient.patch('/api/profile', payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "profile-123",
    "location": "San Francisco, USA",
    "updatedAt": "2026-05-26T10:00:00Z"
  }
}
```

---

## Experience Endpoints

### 1. Get Candidate Experiences

**Endpoint**: `GET /api/experience`

**Purpose**: Fetch all experiences for current user

**Request**:
```typescript
await apiClient.get('/api/experience');
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "exp-1",
      "jobTitle": "Senior Developer",
      "company": "Tech Corp",
      "startDate": "2021-01-01T00:00:00Z",
      "endDate": null,
      "isCurrentlyWorking": true,
      "description": "Led development of microservices..."
    },
    {
      "id": "exp-2",
      "jobTitle": "Junior Developer",
      "company": "StartUp Inc",
      "startDate": "2019-06-01T00:00:00Z",
      "endDate": "2020-12-31T00:00:00Z",
      "isCurrentlyWorking": false,
      "description": "Developed frontend features..."
    }
  ]
}
```

---

### 2. Create Experience

**Endpoint**: `POST /api/experience`

**Purpose**: Add new work experience

**Request**:
```typescript
interface CreateExperiencePayload {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  description?: string;
}

const payload: CreateExperiencePayload = {
  jobTitle: 'Product Manager',
  company: 'New Company',
  startDate: new Date('2023-01-01'),
  isCurrentlyWorking: true,
  description: 'Managing product roadmap...',
};

await apiClient.post('/api/experience', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Experience added successfully",
  "data": {
    "id": "exp-3",
    "jobTitle": "Product Manager",
    "company": "New Company",
    "createdAt": "2026-05-26T10:00:00Z"
  }
}
```

---

### 3. Update Experience

**Endpoint**: `PATCH /api/experience/:experienceId`

**Purpose**: Update existing experience

**Request**:
```typescript
const payload = {
  description: 'Updated description...',
  endDate: new Date('2023-12-31'),
};

await apiClient.patch(`/api/experience/${experienceId}`, payload);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Experience updated successfully",
  "data": {
    "id": "exp-3",
    "jobTitle": "Product Manager",
    "updatedAt": "2026-05-26T11:00:00Z"
  }
}
```

---

### 4. Delete Experience

**Endpoint**: `DELETE /api/experience/:experienceId`

**Purpose**: Remove work experience

**Request**:
```typescript
await apiClient.delete(`/api/experience/${experienceId}`);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Experience deleted successfully"
}
```

---

## Skills Endpoints

### 1. Get Skills

**Endpoint**: `GET /api/skills`

**Purpose**: Fetch current user's skills

**Request**:
```typescript
await apiClient.get('/api/skills');
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "skill-1",
      "name": "JavaScript",
      "proficiency": "expert",
      "endorsements": 25
    },
    {
      "id": "skill-2",
      "name": "React",
      "proficiency": "advanced",
      "endorsements": 20
    }
  ]
}
```

---

### 2. Add Skill

**Endpoint**: `POST /api/skills`

**Purpose**: Add new skill to profile

**Request**:
```typescript
interface AddSkillPayload {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const payload: AddSkillPayload = {
  name: 'TypeScript',
  proficiency: 'advanced',
};

await apiClient.post('/api/skills', payload);
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Skill added successfully",
  "data": {
    "id": "skill-3",
    "name": "TypeScript",
    "proficiency": "advanced",
    "createdAt": "2026-05-26T10:00:00Z"
  }
}
```

---

### 3. Delete Skill

**Endpoint**: `DELETE /api/skills/:skillId`

**Purpose**: Remove skill from profile

**Request**:
```typescript
await apiClient.delete(`/api/skills/${skillId}`);
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

---

## Error Response Format

All API errors follow this standard format:

```json
{
  "success": false,
  "message": "Error message description",
  "errors": {
    "fieldName": "Field-specific error message"
  },
  "statusCode": 400
}
```

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation failed - check errors array |
| 401 | Unauthorized | Token missing/expired - trigger login |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Backend error - show error message |

---

## Common Error Scenarios

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized - Please login again",
  "statusCode": 401
}
```
**Client Action**: Redirect to login, clear auth state

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  },
  "statusCode": 400
}
```
**Client Action**: Display validation errors to user

### Forbidden (403)
```json
{
  "success": false,
  "message": "You don't have permission to perform this action",
  "statusCode": 403
}
```
**Client Action**: Show permission denied message

---

**Document Version**: 1.0  
**Last Updated**: May 2026
