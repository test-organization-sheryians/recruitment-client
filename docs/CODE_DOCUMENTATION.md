# Recruitment Platform - Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [API Layer Documentation](#api-layer-documentation)
4. [State Management (Redux)](#state-management-redux)
5. [Type System](#type-system)
6. [Authentication & Authorization](#authentication--authorization)
7. [Components](#components)
8. [Features/Modules](#featuresmodules)
9. [Configuration](#configuration)
10. [Utilities & Helpers](#utilities--helpers)
11. [Development Guidelines](#development-guidelines)

---

## Project Overview

### Technology Stack
- **Framework**: Next.js 16.1.6 (with Turbopack)
- **Language**: TypeScript
- **UI Library**: React 19.1.0, Material-UI (MUI), Radix UI
- **State Management**: Redux Toolkit 2.10.1
- **Data Fetching**: TanStack React Query 5.90.9, Axios
- **Styling**: Tailwind CSS, Emotion (CSS-in-JS)
- **PDF Processing**: pdf-lib, pdf-parse, jsPDF, html2canvas
- **File Upload**: AWS S3 SDK
- **Rich Text Editor**: TipTap
- **Code Editor**: Monaco Editor
- **Authentication**: JWT (JSON Web Tokens) via Cookies
- **Package Manager**: npm

### Project Purpose
A comprehensive recruitment platform providing:
- User authentication (Admin, Client, Candidate)
- Job posting and management
- Candidate profile management
- AI-powered testing and evaluation
- Resume parsing
- Interview scheduling
- Application tracking
- Category management
- Skills management

---

## Architecture & Structure

### Directory Structure Overview

```
src/
├── api/              # API endpoints layer
├── app/              # Next.js app router pages and layouts
├── components/       # Reusable React components
├── config/           # Configuration files
├── features/         # Feature-specific modules (Redux slices + logic)
├── lib/              # Utility libraries and helpers
├── middleware.ts     # Next.js middleware for routing & auth
├── redux/            # Redux store configuration
└── types/            # TypeScript type definitions
```

### Architectural Patterns

#### 1. **Layered Architecture**
- **API Layer** (`src/api/`): Handles all HTTP communications with backend
- **Redux Layer** (`src/redux/`, `src/features/`): Manages application state
- **Component Layer** (`src/components/`, `src/app/`): UI rendering and user interaction
- **Type Layer** (`src/types/`): Centralized TypeScript definitions

#### 2. **Feature-Based Organization**
Features are organized in `src/features/` with their own:
- Redux slices (state management)
- Hooks (custom React hooks)
- Utils (feature-specific utilities)
- Queries (React Query configurations)
- Types (feature-specific types)

#### 3. **API Request Pattern**
All API requests use a centralized `apiClient` (Axios instance) that:
- Automatically includes authentication cookies
- Has request/response interceptors for error handling
- Uses a base URL configured from environment variables

---

## API Layer Documentation

### Location: `src/api/`

The API layer is organized by feature/resource:

### API Categories

#### **Authentication Endpoints** (`src/api/auth/`)
- **login.ts**: POST `/api/auth/login` - User login
- **register.ts**: POST `/api/auth/register` - User registration
- **logout.ts**: POST `/api/auth/logout` - User logout
- **verify.ts**: POST `/api/auth/verify` - Email verification
- **refreshToken.ts**: POST `/api/auth/refresh` - Token refresh

```typescript
// Example: Login API
export const login = async (data: FormData) => {
    const response = await api.post("/api/auth/login", data);
    return response.data; 
};
```

#### **Admin Profile Endpoints** (`src/api/adminProfile/`)
- **getProfile.ts**: GET `/api/adminProfile` - Fetch admin profile
- **updateProfile.ts**: PATCH `/api/adminProfile` - Update admin profile
- **deleteProfile.ts**: DELETE `/api/adminProfile` - Delete admin profile

#### **Candidate Endpoints** (`src/api/candidate/`)
- **getCandidateAttempts.ts**: GET `/api/candidate/attempts` - Get test attempts
- **getCandidateEnrollments.ts**: GET `/api/candidate/enrollments` - Get enrolled tests

#### **Category Management** (`src/api/category/`)
- **getCategories.ts**: GET `/api/category` - Get all categories
- **getCategoriesPaginated.ts**: GET `/api/category/paginated` - Paginated categories
- **addCategory.ts**: POST `/api/category` - Create new category
- **updateCategory.ts**: PATCH `/api/category/:id` - Update category
- **deleteCategory.ts**: DELETE `/api/category/:id` - Delete category

#### **AI Test Endpoints** (`src/api/AITest/`)
- **postResumeAndGenerateQuestions.ts**: POST `/api/aitest/resume` - Upload resume & generate questions
- **evaluteAns.ts**: POST `/api/aitest/evaluate` - Evaluate candidate answers
- **questionGen.ts**: POST `/api/aitest/questions` - Generate test questions
- **parseResume.ts**: POST `/api/aitest/parse` - Parse resume
- **testViolation.ts**: POST `/api/aitest/violation` - Report test violation

#### **Job Management** (`src/api/jobs/`)
- Job CRUD operations
- Job application tracking

#### **Tests Endpoints** (`src/api/tests/`)
- Test creation and management
- Test enrollment
- Test result retrieval

#### **Skills Endpoints** (`src/api/skills/`)
- Add/update/delete skills
- Skill validation

#### **Profile Endpoints** (`src/api/profile/`)
- Candidate profile CRUD operations
- Experience management
- Skill management

#### **Experience Endpoints** (`src/api/experience/`)
- **createExperience.ts**: POST `/api/experience` - Add work experience
- **updateExperience.ts**: PATCH `/api/experience/:id` - Update experience
- **deleteExperience.ts**: DELETE `/api/experience/:id` - Delete experience
- **getCandidateExperience.ts**: GET `/api/experience/candidate/:id` - Get candidate's experiences
- **getSingleExperience.ts**: GET `/api/experience/:id` - Get single experience

#### **Interview Endpoints** (`src/api/interviews/`)
- Schedule interviews
- Get interview details
- Update interview status

#### **Resume Extract** (`src/api/resumeExtract/`)
- Extract information from resumes
- Parse resume data

#### **Candidate Share** (`src/api/candidateShare/`)
- **shareCandidate.ts**: POST `/api/share/candidate` - Share candidate profiles

### API Client Configuration

**File**: `src/lib/api-client.ts`

```typescript
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,           // Include cookies in requests
  timeout: 10000,                  // 10 second timeout
});

// Request Interceptor: Handles outgoing requests
apiClient.interceptors.request.use(...)

// Response Interceptor: Handles responses and errors
apiClient.interceptors.response.use(...)
```

**Key Features**:
- Automatic cookie-based authentication
- Centralized error handling (401 unauthorized redirects)
- Request timeout protection
- Credential inclusion for CORS

### API Request Pattern

All API methods follow this pattern:

```typescript
import api from "@/config/axios";

export const apiMethodName = async (payload?: any) => {
    const response = await api.method("/endpoint-path", payload);
    return response.data;
};
```

---

## State Management (Redux)

### Location: `src/redux/`, `src/config/store/`, `src/features/`

### Store Configuration

**File**: `src/config/store/index.ts`

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,  // Authentication state
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Slices

#### **Auth Slice** (`src/redux/slices/authSlice.ts`)

```typescript
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthLoading = false;
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
```

**State Structure**:
- `user`: Current authenticated user object
- `isAuthLoading`: Boolean indicating if auth state is loading

**Actions**:
- `setUser(userData)`: Set authenticated user
- `setAuthLoading(boolean)`: Set loading state
- `logout()`: Clear user data on logout

### Feature-Based Redux Organization

Each feature in `src/features/` can have:
- Redux slice for state management
- Custom hooks for state access
- Query hooks for React Query integration
- Feature-specific types

**Feature Directories**:
- `admin/`: Admin dashboard features
- `auth/`: Authentication features
- `candidate/`: Candidate profile features
- `job-management/`: Job posting and management
- `AITest/`: AI testing features
- `applied-jobs/`: Job application tracking
- `enrolled-test/`: Test enrollment features
- `categoriess/`: Category management
- `test/`: Test management

---

## Type System

### Location: `src/types/`

All TypeScript interfaces and types are centralized for consistency and reusability.

### Core Type Definitions

#### **Auth Types** (`src/types/auth.ts`)
```typescript
export type Role = 'admin' | 'client' | 'user';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};
```

#### **Job Types** (`src/types/Job.ts`)
```typescript
export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  salaryRange?: {
    min: number;
    max: number;
  };
  applicants: Applicant[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Candidate Types** (`src/types/applicant.ts`)
```typescript
export type ApplicantStatus = 
  | 'applied' 
  | 'under_review' 
  | 'selected' 
  | 'rejected' 
  | 'completed';

export interface Applicant {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicantStatus;
  appliedAt: Date;
}
```

#### **Test Types** (`src/types/Test.ts`)
```typescript
export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;           // in minutes
  totalQuestions: number;
  passingScore: number;
  category: JobCategory;
  createdBy: string;
  createdAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  testId: string;
  enrolledAt: Date;
  status: 'enrolled' | 'in_progress' | 'completed';
}

export interface Attempt {
  id: string;
  enrollmentId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  passed: boolean;
  answers: Answer[];
}

export type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  categoryId: string;
};
```

#### **Experience Types** (`src/types/Experience.ts`)
```typescript
export interface Experience {
  id: string;
  candidateId: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrentlyWorking: boolean;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}
```

#### **Skill Types** (`src/types/skilll.ts`)
```typescript
export interface Skill {
  id: string;
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements?: number;
}
```

#### **Enrollment Types** (`src/types/Enrollment.ts`)
```typescript
export interface Enrollment {
  id: string;
  userId: string;
  testId: string;
  enrolledAt: Date;
}

export interface TestAttempt {
  id: string;
  enrollmentId: string;
  score: number;
  passed: boolean;
  completedAt: Date;
}

export type EnrollUsersResponse = {
  success: boolean;
  message: string;
  enrolledUsers: string[];
};
```

#### **Share Candidate Types** (`src/types/shareInterfaceCandidate.ts`)
```typescript
export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ShareCandidatePayload {
  candidateId: string;
  groupIds: string[];
}

export interface Group {
  id: string;
  name: string;
  users: GroupUser[];
  createdAt: Date;
}

export interface ShareCandidate {
  id: string;
  candidateId: string;
  groupId: string;
  sharedAt: Date;
}
```

#### **Profile Types** (`src/types/profile.ts`)
```typescript
export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  profileImage?: string;
  bio?: string;
  experiences: Experience[];
  skills: Skill[];
}
```

### Type Usage Best Practices

1. **Import from types folder**:
   ```typescript
   import { User, Job, Test } from '@/types';
   ```

2. **Use interfaces for objects**:
   ```typescript
   interface User {
     id: string;
     email: string;
   }
   ```

3. **Use types for unions and aliases**:
   ```typescript
   type Role = 'admin' | 'client' | 'user';
   type ApiResponse<T> = { data: T; error?: string };
   ```

---

## Authentication & Authorization

### Authentication Flow

#### **1. Initial Authentication**

**File**: `src/lib/auth.ts`

```typescript
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Call /users/me endpoint
  // If 401, refresh token
  // Return user or null
}
```

**Process**:
1. Check for authentication token in cookies
2. Call `/users/me` endpoint to get current user
3. If unauthorized (401), attempt token refresh
4. Return user data or null if not authenticated

#### **2. JWT Token Management**

**Tokens Stored in Cookies**:
- `token`: Access token (short-lived)
- `refreshToken`: Refresh token (long-lived)
- `role`: User role (admin, client, user)

**Token Refresh**:
```typescript
const refreshUrl = `${apiBase}/api/auth/refresh`;
// POST request with refreshToken
// Returns new access token
```

#### **3. Session Timeout**

**File**: `src/lib/utils.ts`

```typescript
export const startSessionWatcher = (expiresIn: number) => {
  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    Cookies.remove("refreshToken");
    Cookies.remove("token");
    window.location.replace("/login");
  }, expiresIn * 1000);
};
```

**Features**:
- Automatic logout on token expiration
- Clears cookies
- Redirects to login page

### Authorization & Routing

**File**: `src/middleware.ts`

#### **Route Protection**

```typescript
// Public Routes (no authentication required)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/selected-candidates',
];

// Admin Routes (requires admin role)
if (pathname.startsWith("/admin")) {
  if (!token || role !== "admin") {
    return NextResponse.redirect("/unauthorized");
  }
}

// Protected Routes (requires authentication)
if (!token && !isPublic) {
  if (refreshToken) {
    // Allow client-side refresh attempt
    return NextResponse.next();
  }
  // Redirect to login
  return NextResponse.redirect("/login");
}
```

#### **Middleware Protection**:
1. **Static assets** are allowed without authentication
2. **Public routes** are always accessible
3. **Admin routes** require admin role
4. **Protected routes** require valid token
5. **401 responses** trigger token refresh attempt

### Role-Based Access Control

**Roles**:
- `admin`: Full platform access, user management
- `client`: Company/recruiter access, can post jobs
- `user`/`candidate`: Candidate access, can apply to jobs

**Role Validation**:
- Checked in middleware for route access
- Verified on API responses
- Enforced on Redux state

---

## Components

### Location: `src/components/`

Components are organized by type and purpose.

### Directory Structure

```
components/
├── Button.tsx           # Reusable button component
├── Input.tsx            # Reusable input field
├── Navbar.tsx           # Navigation bar
├── ReVerifyEmail.tsx    # Email verification component
├── hoc/                 # Higher-order components
│   ├── Wrapper.tsx      # Root wrapper with providers
│   ├── AuthProvider.tsx # Authentication provider
│   └── ...
└── ui/                  # UI library components
    ├── Dialog/
    ├── Select/
    ├── Label/
    └── ...
```

### Key Components

#### **Wrapper** (`src/components/hoc/Wrapper.tsx`)
Root wrapper component that provides:
- Redux provider
- React Query provider
- Toast notifications container

#### **AuthProvider** (`src/components/hoc/AuthProvider.tsx`)
Handles:
- Initial authentication check
- User state initialization
- Session management
- Token refresh logic

#### **Navbar** (`src/components/Navbar.tsx`)
Displays:
- User information
- Navigation links based on role
- Logout functionality
- Theme toggle

#### **Button** (`src/components/Button.tsx`)
Reusable button component with:
- Variant support (primary, secondary, outline)
- Size variants (small, medium, large)
- Loading states
- Disabled states

#### **Input** (`src/components/Input.tsx`)
Reusable input field with:
- Error states
- Validation display
- Placeholder support
- Icon support

#### **ReVerifyEmail** (`src/components/ReVerifyEmail.tsx`)
Email verification flow:
- Resend verification email
- Email confirmation
- Success/error messages

### UI Components Library

Located in `src/components/ui/`, these are typically from Radix UI or custom components:
- Dialog/Modal
- Select dropdown
- Label
- Form inputs
- Buttons
- Badges
- Cards

### Component Best Practices

1. **Reusability**: Create generic components for common patterns
2. **Props Interface**: Define clear prop types
3. **Error Boundaries**: Wrap feature components
4. **Memoization**: Use React.memo for expensive renders
5. **Composition**: Build complex UIs from simple components

---

## Features/Modules

### Location: `src/features/`

Each feature module contains feature-specific logic, components, and state management.

### Feature Modules

#### **1. Auth Feature** (`src/features/auth/`)
**Responsibilities**:
- Login/Register forms
- Logout functionality
- Password reset flow
- Email verification

**Structure**:
- `slice.ts`: Redux slice for auth state
- `hooks.ts`: Custom auth hooks
- Components: Login, Register, ForgotPassword

#### **2. Job Management** (`src/features/job-management/`)
**Responsibilities**:
- Create/Edit/Delete jobs
- Job listing and filtering
- Job details view

**Components**:
- JobForm
- JobList
- JobCard
- JobDetails

#### **3. Candidate Management** (`src/features/candidate/`)
**Responsibilities**:
- Candidate profile management
- Experience management
- Skills management
- Profile editing

**Components**:
- CandidateProfile
- ExperienceForm
- SkillsForm
- ProfileHeader

#### **4. AI Test** (`src/features/AITest/`)
**Responsibilities**:
- AI-powered testing
- Resume parsing
- Question generation
- Answer evaluation
- Violation detection

**Key Files**:
- Resume upload and parsing
- Question generation logic
- Evaluation algorithms
- Violation tracking

#### **5. Applied Jobs** (`src/features/applied-jobs/`)
**Responsibilities**:
- Track job applications
- View application status
- Manage applications

#### **6. Enrolled Test** (`src/features/enrolled-test/`)
**Responsibilities**:
- Display enrolled tests
- Start test attempt
- View results
- Progress tracking

#### **7. Category Management** (`src/features/categoriess/`)
**Responsibilities**:
- CRUD operations for categories
- Category filtering
- Category validation

#### **8. Password Management** (`src/features/password/`)
**Responsibilities**:
- Change password
- Reset password
- Password validation

#### **9. Admin Features** (`src/features/admin/`)
**Responsibilities**:
- User management
- Platform statistics
- Admin settings
- Violation reports

### Feature Module Structure

Typical feature structure:

```
features/feature-name/
├── components/          # Feature-specific components
├── hooks/              # Custom React hooks
├── queries.ts          # React Query configurations
├── slice.ts            # Redux slice
├── types.ts            # Feature-specific types
└── utils.ts            # Feature utilities
```

### React Query Integration

Features use React Query for server-state management:

```typescript
// queries.ts
const useGetJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs'),
  });
};

const useCreateJob = () => {
  return useMutation({
    mutationFn: (data) => api.post('/jobs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
```

---

## Configuration

### Location: `src/config/`

#### **Axios Configuration** (`src/config/axios/`)
Configured in `src/lib/api-client.ts`:
- Base URL from environment
- Credentials enabled
- 10-second timeout
- Request/response interceptors

#### **Store Configuration** (`src/config/store/`)
Redux store setup with:
- Auth reducer
- Dev tools enabled in development
- TypeScript types exported

#### **TanStack Query Configuration** (`src/config/tanstack/`)
React Query client configuration:
- Query cache time
- Retry logic
- Request timeout
- Stale time settings

### Environment Variables

`.env.local` file should contain:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
JWT_SECRET=your_jwt_secret_key
```

**Key Variables**:
- `NEXT_PUBLIC_API_BASE_URL`: Backend API endpoint
- `JWT_SECRET`: JWT signing secret (server-side)
- `NODE_ENV`: Development or production

---

## Utilities & Helpers

### Location: `src/lib/`

#### **1. API Client** (`src/lib/api-client.ts`)
Centralized Axios instance with:
- Base URL configuration
- Cookie credentials
- Request/response interceptors
- Error handling

#### **2. Authentication Helpers** (`src/lib/auth.ts`)
```typescript
// Get current authenticated user
export async function getCurrentUser(): Promise<User | null>

// Handle token refresh and user fetch
export async function callRefreshAndMe(): Promise<User | null>
```

**Key Functions**:
- `getCurrentUser()`: Fetch current user or null
- Token refresh logic
- Cookie-based authentication

#### **3. Utility Functions** (`src/lib/utils.ts`)

**cn() Function**:
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
Used for conditional CSS class merging (Tailwind + clsx).

**Session Watcher**:
```typescript
export const startSessionWatcher = (expiresIn: number)
```
Manages automatic logout on token expiration.

#### **4. File Upload** (`src/lib/uploadFile.ts`)
Handles file uploads to AWS S3:
- File validation
- S3 upload
- Progress tracking

#### **5. Dev Tools** (`src/lib/devtoolsAndScreenGuard.ts`)
Development-only utilities:
- Redux DevTools integration
- Screen guard for protected content
- Debug logging

---

## Middleware

### Location: `src/middleware.ts`

Next.js middleware that runs on every request.

### Middleware Functionality

#### **1. Asset Bypass**
Allows static assets without authentication:
- `/_next` - Next.js internals
- `/images`, `/fonts` - Static files
- Font files `.woff`, `.woff2`, `.ttf`, `.otf`

#### **2. Route Protection**

**Public Routes** (no auth required):
```
/, /login, /register, /forgot-password, 
/selected-candidates, /unauthorized
```

**Admin Routes** (admin role required):
```
/admin/**
```

**Protected Routes** (authentication required):
```
All other routes except public
```

#### **3. Token Refresh Logic**
- If no token but refreshToken exists, allow request to proceed
- Client-side refresh attempt handled by AuthProvider
- Prevents instant logout on token expiration

#### **4. Redirect Handling**
- Unauthenticated users redirected to `/login`
- `?redirect=` query parameter preserves intended destination
- Unauthorized users redirected to `/unauthorized`

---

## App Structure

### Location: `src/app/`

Next.js app router structure:

```
app/
├── (auth)/              # Public auth routes (login, register)
├── (candidate)/         # Candidate-specific routes
├── admin/               # Admin dashboard routes
├── api/                 # API route handlers
├── candidate/           # Candidate pages
├── categoriess/         # Category management pages
├── Crew/                # Team/crew related pages
├── selected-candidates/ # Shared candidates viewing
├── test/                # Test pages
├── un-verified/         # Email verification pages
├── unauthorized/        # Unauthorized access page
├── layout.tsx           # Root layout
├── globals.css          # Global styles
└── not-found.tsx        # 404 page
```

### Root Layout (`src/app/layout.tsx`)

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Wrapper>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </Wrapper>
      </body>
    </html>
  );
}
```

**Providers**:
- Redux Provider (via Wrapper)
- React Query Provider (via Wrapper)
- AuthProvider (authentication logic)
- Toast notifications

---

## Development Guidelines

### 1. **Component Development**

#### Creating a New Component

```typescript
// src/components/MyComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  children, 
  className 
}) => {
  return (
    <div className={cn('p-4', className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

**Best Practices**:
- Always type props with interfaces
- Export default for main component
- Use `cn()` for conditional styles
- Include JSDoc comments for complex logic

#### Using Components

```typescript
import MyComponent from '@/components/MyComponent';

export default function Page() {
  return (
    <MyComponent title="Example">
      <p>Content here</p>
    </MyComponent>
  );
}
```

### 2. **API Integration**

#### Creating New API Functions

```typescript
// src/api/resource/method.ts
import apiClient from '@/lib/api-client';

export interface ResourcePayload {
  name: string;
  description?: string;
}

export const createResource = async (payload: ResourcePayload) => {
  const response = await apiClient.post('/resource', payload);
  return response.data;
};

export const getResource = async (id: string) => {
  const response = await apiClient.get(`/resource/${id}`);
  return response.data;
};
```

**Naming Convention**:
- `getResource` - GET request
- `createResource` - POST request
- `updateResource` - PATCH/PUT request
- `deleteResource` - DELETE request

#### Using in Components

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getResource, createResource } from '@/api/resource/method';

export function MyComponent() {
  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource'],
    queryFn: () => getResource('id'),
  });

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => createResource(payload),
    onSuccess: () => {
      // Handle success
    },
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>{data.name}</p>}
    </div>
  );
}
```

### 3. **State Management**

#### Creating a Redux Slice

```typescript
// src/features/resource/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Resource {
  id: string;
  name: string;
}

interface ResourceState {
  items: Resource[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  items: [],
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setItems: (state, action: PayloadAction<Resource[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<Resource>) => {
      state.items.push(action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setItems, addItem, setError } = 
  resourceSlice.actions;
export default resourceSlice.reducer;
```

#### Using Redux in Components

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/config/store';
import { setItems } from '@/features/resource/slice';

export function ResourceList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector(
    (state: RootState) => state.resource
  );

  const handleLoad = () => {
    dispatch(setItems([]));
  };

  return <div>{/* Component JSX */}</div>;
}
```

### 4. **Type Management**

#### Adding New Types

```typescript
// src/types/resource.ts
export interface Resource {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ResourceStatus = 'active' | 'inactive' | 'archived';

export interface ResourcePayload {
  name: string;
  description?: string;
}

export interface ResourceResponse {
  success: boolean;
  data: Resource;
}
```

**Best Practices**:
- Group related types in same file
- Use interfaces for objects
- Use types for unions and aliases
- Include optional properties with `?`
- Export all types

### 5. **Error Handling**

#### API Error Handling

```typescript
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function MyComponent() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/endpoint');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      } catch (err) {
        toast.error('Failed to load data');
        throw err;
      }
    },
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
```

### 6. **Form Handling**

#### Creating a Form Component

```typescript
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createResource } from '@/api/resource/method';
import { toast } from 'react-toastify';

export function ResourceForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      toast.success('Resource created successfully');
      setFormData({ name: '', description: '' });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Resource name"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 7. **File Upload Handling**

#### Using File Upload Utility

```typescript
import { uploadFile } from '@/lib/uploadFile';
import { toast } from 'react-toastify';

export function FileUploadComponent() {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Upload file
      const result = await uploadFile(file);
      toast.success('File uploaded successfully');
      console.log('Upload result:', result);
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileUpload}
      disabled={uploading}
    />
  );
}
```

### 8. **Testing Best Practices**

#### Unit Testing Example

```typescript
// src/api/resource/__tests__/method.test.ts
import { createResource } from '../method';
import apiClient from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('Resource API', () => {
  it('should create a resource', async () => {
    const mockData = { id: '1', name: 'Test' };
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: mockData,
    });

    const result = await createResource({ name: 'Test' });
    expect(result).toEqual(mockData);
  });
});
```

### 9. **Common Patterns**

#### Loading States

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resource'],
  queryFn: fetchResource,
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <ResourceView data={data} />;
```

#### Pagination

```typescript
const [page, setPage] = useState(1);
const { data } = useQuery({
  queryKey: ['resources', page],
  queryFn: () => fetchResources(page),
});
```

#### Searching & Filtering

```typescript
const [searchTerm, setSearchTerm] = useState('');
const { data } = useQuery({
  queryKey: ['resources', searchTerm],
  queryFn: () => searchResources(searchTerm),
  enabled: searchTerm.length > 0,
});
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL pointing to production
- [ ] JWT_SECRET set securely
- [ ] Build completes without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] CORS settings configured on backend
- [ ] Database migrations completed on backend
- [ ] Static assets optimized
- [ ] Performance tested

---

## Troubleshooting

### Common Issues

#### **1. 401 Unauthorized Errors**
- Check if token is stored in cookies
- Verify token hasn't expired
- Check if refresh token is valid
- Ensure backend is accepting credentials

#### **2. CORS Errors**
- Verify `withCredentials: true` in apiClient
- Check backend CORS headers
- Ensure API base URL matches backend

#### **3. TypeScript Errors**
- Run `npm run lint` to identify issues
- Check types are properly imported
- Ensure all interfaces are defined in `src/types/`

#### **4. React Query Issues**
- Verify `ReactQueryProvider` is in layout
- Check query keys are consistent
- Ensure mutations trigger proper invalidations

#### **5. Redux State Not Updating**
- Verify dispatch is using correct action
- Check reducer logic for mutations
- Ensure store is properly configured

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material-UI Components](https://mui.com/material-ui/api/)

---

**Last Updated**: May 2026
**Documentation Version**: 1.0
**Maintained By**: Development Team
