# Architecture & Module Deep-Dive Guide

## Advanced Architecture Concepts

### Data Flow Architecture

#### Request Flow
```
User Action (Click/Submit)
    ↓
Component Event Handler
    ↓
Redux Action/Dispatch OR React Query Hook
    ↓
API Call (apiClient)
    ↓
Middleware (Request Interceptor)
    ↓
Backend API
    ↓
Response
    ↓
Middleware (Response Interceptor)
    ↓
State Update (Redux/React Query)
    ↓
Component Re-render
```

#### Data Flow Example: Login
```
1. User fills login form in LoginComponent
2. User clicks "Sign In"
3. Component handler calls login() API function
4. apiClient sends POST /api/auth/login
5. Backend validates credentials
6. Response: { token, refreshToken, user }
7. Response interceptor handles success
8. Redux setUser() action dispatched
9. AuthProvider stores tokens in cookies
10. User state updates in Redux store
11. Middleware redirects to dashboard
12. Dashboard component re-renders with user data
```

### State Management Strategy

#### Global State (Redux)
**When to use**: Rarely needed in this architecture
- Current authenticated user
- Global app settings
- Critical auth state

**Avoid**: Server data (use React Query instead)

#### Server State (React Query)
**When to use**: Most data in application
- API responses
- Lists and collections
- User profiles
- Job data

**Benefits**:
- Automatic caching
- Background refetching
- Mutation optimization
- Built-in loading states

#### Local State (React useState)
**When to use**: Component-specific
- Form inputs
- Toggle states
- UI state (modal open/close)
- Component-specific loading

---

## Feature Module Deep-Dive

### 1. Authentication Feature

**Location**: `src/features/auth/`

**Key Responsibilities**:
- User login/registration
- Email verification
- Password reset
- Session management
- Token lifecycle

**Key Files**:
```
auth/
├── components/
│   ├── LoginForm.tsx      # Login form component
│   ├── RegisterForm.tsx   # Registration form
│   └── ForgotPassword.tsx # Password reset request
├── hooks.ts              # useAuth(), useLogin(), etc.
├── slice.ts              # Redux slice for auth state
└── types.ts              # Auth-specific types
```

**Redux Actions**:
```typescript
// In features/auth/slice.ts or Redux middleware

// Login flow
const loginFlow = (credentials) => {
  1. Dispatch setAuthLoading(true)
  2. Call login() API
  3. Store tokens in cookies
  4. Dispatch setUser(userData)
  5. Dispatch setAuthLoading(false)
}

// Logout flow
const logoutFlow = () => {
  1. Call logout() API
  2. Clear cookies
  3. Dispatch logout() Redux action
  4. Redirect to login
}
```

**Authentication Hooks**:
```typescript
// useAuth hook - Get current user
const { user, isAuthLoading } = useAuth();

// useLogin hook - Login mutation
const { mutate: login, isPending } = useLogin();

// useLogout hook - Logout
const { mutate: logout } = useLogout();

// useRefreshToken hook - Token refresh
const { mutate: refresh } = useRefreshToken();
```

### 2. Job Management Feature

**Location**: `src/features/job-management/`

**Key Responsibilities**:
- Job CRUD operations
- Job filtering and search
- Job category management
- Application tracking

**API Endpoints Used**:
```
GET    /api/jobs                    # List all jobs
GET    /api/jobs/:id                # Get specific job
POST   /api/jobs                    # Create job
PATCH  /api/jobs/:id                # Update job
DELETE /api/jobs/:id                # Delete job
GET    /api/jobs/search             # Search jobs
GET    /api/jobs/category/:catId    # Jobs by category
POST   /api/jobs/:id/apply          # Apply to job
```

**Data Model**:
```typescript
interface Job {
  id: string;
  title: string;              // e.g., "Senior React Developer"
  description: string;         // Job description
  category: JobCategory;      // e.g., { id, name }
  requirements: string[];     // Required skills
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  company: string;
  applicantCount: number;
  status: 'open' | 'closed' | 'draft';
  createdBy: string;          // Company/Admin ID
  createdAt: Date;
  updatedAt: Date;
}
```

**Component Structure**:
```typescript
// JobList component - Shows all jobs
<JobList
  jobs={jobs}
  onSelectJob={handleJobSelect}
  loading={isLoading}
  filters={activeFilters}
/>

// JobCard component - Individual job preview
<JobCard
  job={job}
  onApply={handleApply}
  isApplied={isApplied}
/>

// JobDetailsPage - Full job info
<JobDetailsPage
  jobId={jobId}
  onApply={handleApply}
  relatedJobs={relatedJobs}
/>

// JobFormModal - Create/Edit job
<JobFormModal
  onSubmit={handleSubmit}
  initialData={jobToEdit}
  isLoading={isSubmitting}
/>
```

**React Query Hooks**:
```typescript
// Fetch jobs
const { data: jobs } = useGetJobs(filters);

// Fetch single job
const { data: job } = useGetJobById(jobId);

// Create job
const { mutate: createJob } = useCreateJob();

// Update job
const { mutate: updateJob } = useUpdateJob();

// Delete job
const { mutate: deleteJob } = useDeleteJob();

// Apply to job
const { mutate: applyJob } = useApplyJob();
```

### 3. AI Test Feature

**Location**: `src/features/AITest/`

**Key Responsibilities**:
- Resume parsing
- AI question generation
- Answer evaluation
- Test monitoring
- Violation detection

**AI Test Flow**:
```
1. Candidate uploads resume
   ↓
2. Resume parsing (extract text)
   ↓
3. AI generates questions based on resume
   ↓
4. Questions presented to candidate
   ↓
5. Candidate answers questions
   ↓
6. Answers sent to AI evaluator
   ↓
7. AI scores answers (0-100)
   ↓
8. Violation detection runs (cheating detection)
   ↓
9. Results saved
   ↓
10. Candidate notified of results
```

**API Endpoints**:
```
POST /api/aitest/resume                     # Parse resume
POST /api/aitest/questions                  # Generate questions
POST /api/aitest/evaluate                   # Evaluate answers
GET  /api/aitest/results/:attemptId         # Get results
POST /api/aitest/violation                  # Report violation
```

**Key Components**:
```typescript
// Resume upload
<ResumeUpload
  onUpload={handleResumeUpload}
  loading={isUploading}
/>

// Question display
<QuestionDisplay
  question={currentQuestion}
  questionNumber={currentIndex}
  totalQuestions={totalQuestions}
  onAnswer={handleAnswer}
/>

// Answer input
<AnswerInput
  questionType="short_answer" | "essay" | "multiple_choice"
  onChange={handleAnswerChange}
  value={answer}
/>

// Test monitoring
<TestMonitor
  timeRemaining={timeLeft}
  questionsCompleted={completedCount}
  totalQuestions={totalQuestions}
  onTimeExpired={handleTimeExpired}
/>

// Results display
<TestResults
  score={score}
  passed={passed}
  evaluationDetails={details}
  violations={violations}
/>
```

**Violation Detection**:
```typescript
interface Violation {
  id: string;
  type: 'tab_switch' | 'suspicious_time' | 'copy_paste' | 'multiple_tabs';
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  description: string;
}

// Violation triggers
- Tab switching away from test
- Suspicious rapid answer changes
- Copy/paste detection
- Multiple open browser tabs
- Screen recording disabled
- Webcam not active
```

### 4. Candidate Profile Feature

**Location**: `src/features/candidate/`

**Key Responsibilities**:
- Profile CRUD
- Experience management
- Skills management
- Profile picture upload
- Resume storage

**Data Model**:
```typescript
interface CandidateProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  profileImage?: string;      // S3 URL
  bio?: string;
  resume?: string;            // S3 URL
  experiences: Experience[];
  skills: Skill[];
  educations: Education[];
  verificationStatus: 'verified' | 'pending' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  isCurrentlyWorking: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}
```

**Components**:
```typescript
// Profile header
<ProfileHeader
  candidate={candidate}
  isEditing={isEditing}
  onEdit={handleEdit}
/>

// About section
<AboutSection
  bio={bio}
  editable={isEditable}
  onUpdate={handleUpdate}
/>

// Experience list
<ExperienceList
  experiences={experiences}
  onAdd={handleAddExperience}
  onEdit={handleEditExperience}
  onDelete={handleDeleteExperience}
/>

// Skills display
<SkillsDisplay
  skills={skills}
  editable={isEditable}
  onAdd={handleAddSkill}
  onRemove={handleRemoveSkill}
/>

// Profile completion indicator
<ProfileCompletion
  percentage={completionPercentage}
  missingSections={missingSections}
/>
```

**React Query Hooks**:
```typescript
// Get profile
const { data: profile } = useGetCandidateProfile(userId);

// Update profile
const { mutate: updateProfile } = useUpdateProfile();

// Upload profile picture
const { mutate: uploadProfileImage } = useUploadProfileImage();

// Get experiences
const { data: experiences } = useGetExperiences(userId);

// Add experience
const { mutate: addExperience } = useAddExperience();

// Update experience
const { mutate: updateExperience } = useUpdateExperience();

// Delete experience
const { mutate: deleteExperience } = useDeleteExperience();

// Get skills
const { data: skills } = useGetSkills(userId);

// Add skill
const { mutate: addSkill } = useAddSkill();

// Remove skill
const { mutate: removeSkill } = useRemoveSkill();
```

### 5. Admin Dashboard Feature

**Location**: `src/features/admin/`

**Key Responsibilities**:
- User management
- Platform statistics
- Content moderation
- Report generation
- System settings

**API Endpoints**:
```
GET    /api/admin/dashboard         # Dashboard stats
GET    /api/admin/users             # List all users
GET    /api/admin/users/:id         # User details
PATCH  /api/admin/users/:id/role    # Change user role
DELETE /api/admin/users/:id         # Delete user
GET    /api/admin/jobs              # Job management
GET    /api/admin/tests             # Test analytics
GET    /api/admin/violations        # Violation reports
PATCH  /api/admin/settings          # Update settings
```

**Dashboard Components**:
```typescript
// Statistics cards
<StatsCard
  title="Total Users"
  value={totalUsers}
  trend={+5.2}
  icon={UserIcon}
/>

// User management table
<UserManagementTable
  users={users}
  onRoleChange={handleRoleChange}
  onDelete={handleDelete}
  loading={isLoading}
/>

// Analytics charts
<AnalyticsChart
  data={chartData}
  type="line" | "bar" | "pie"
  title="Test Completion Rate"
/>

// Recent activity
<RecentActivity
  activities={activities}
  limit={10}
/>

// Violation reports
<ViolationReports
  violations={violations}
  onReview={handleReview}
  onAction={handleAction}
/>
```

### 6. Category Management Feature

**Location**: `src/features/categoriess/`

**Key Responsibilities**:
- Category CRUD
- Category filtering
- Subcategory management
- Category usage statistics

**API Endpoints**:
```
GET    /api/categoriess                # List categories
GET    /api/categoriess/:id            # Get single category
POST   /api/categoriess                # Create category
PATCH  /api/categoriess/:id            # Update category
DELETE /api/categoriess/:id            # Delete category
GET    /api/categoriess/:id/jobs       # Jobs in category
GET    /api/categoriess/:id/tests      # Tests in category
```

**Data Model**:
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  jobCount: number;
  testCount: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Component Composition Patterns

### Pattern 1: Container / Presentational

**Container Component** (Smart):
```typescript
// src/features/jobs/JobListContainer.tsx
export function JobListContainer() {
  const { data: jobs, isLoading, error } = useGetJobs();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <JobListPresentation
      jobs={jobs}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
```

**Presentational Component** (Dumb):
```typescript
// src/features/jobs/JobListPresentation.tsx
interface JobListPresentationProps {
  jobs: Job[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function JobListPresentation({
  jobs,
  filters,
  onFilterChange,
}: JobListPresentationProps) {
  return (
    <div className="job-list">
      <FilterBar
        filters={filters}
        onChange={onFilterChange}
      />
      <div className="jobs-grid">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Compound Components

```typescript
// Form component with compound pattern
export const TestForm = {
  Root: TestFormRoot,
  Section: TestFormSection,
  Field: TestFormField,
  Button: TestFormButton,
};

// Usage
<TestForm.Root onSubmit={handleSubmit}>
  <TestForm.Section title="Basic Info">
    <TestForm.Field label="Title" name="title" />
    <TestForm.Field label="Duration" name="duration" />
  </TestForm.Section>
  <TestForm.Section title="Questions">
    <TestForm.Field label="Total Questions" name="totalQuestions" />
  </TestForm.Section>
  <TestForm.Button type="submit">Create Test</TestForm.Button>
</TestForm.Root>
```

### Pattern 3: Render Props

```typescript
// Data fetching component with render props
export function DataFetcher({ url, children }) {
  const { data, loading, error } = useFetch(url);
  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/jobs">
  {({ data: jobs, loading, error }) => (
    <>
      {loading && <Spinner />}
      {error && <Error error={error} />}
      {jobs && <JobsList jobs={jobs} />}
    </>
  )}
</DataFetcher>
```

### Pattern 4: Custom Hooks

```typescript
// useJobForm hook - Encapsulates job form logic
export function useJobForm(initialValues?: Job) {
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const { mutate: submit, isPending } = useCreateJob();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateJobForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    submit(formData);
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isPending,
  };
}

// Usage
export function JobFormPage() {
  const { formData, errors, handleChange, handleSubmit } = useJobForm();

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && <span>{errors.title}</span>}
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Error Handling Strategy

### 1. API Error Handling

```typescript
// Centralized error handler in axios interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired - attempt refresh or redirect to login
      handleTokenExpired();
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      showForbiddenError();
    } else if (error.response?.status === 404) {
      // Not found
      showNotFoundError();
    } else if (error.response?.status >= 500) {
      // Server error
      showServerError();
    } else if (!error.response) {
      // Network error
      showNetworkError();
    }
    return Promise.reject(error);
  }
);
```

### 2. Component Error Boundaries

```typescript
// ErrorBoundary wrapper
<ErrorBoundary fallback={<ErrorPage />}>
  <JobManagementFeature />
</ErrorBoundary>

// Error boundary implementation
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### 3. React Query Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['jobs'],
  queryFn: fetchJobs,
  retry: 2,  // Retry failed requests 2 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error) => {
    toast.error(`Failed to load jobs: ${error.message}`);
  },
});

if (isError) {
  return (
    <div className="error-container">
      <h2>Error Loading Jobs</h2>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>
        Try Again
      </button>
    </div>
  );
}
```

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Dynamic imports for feature modules
const JobManagement = dynamic(
  () => import('@/features/job-management'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Usage
<Suspense fallback={<Loading />}>
  <JobManagement />
</Suspense>
```

### 2. Memoization

```typescript
// Memoize expensive components
const JobCard = React.memo(({ job, onSelect }) => {
  return (
    <div onClick={() => onSelect(job.id)}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.job.id === nextProps.job.id;
});

// Memoize callbacks
const handleSelectJob = useCallback((jobId) => {
  dispatch(selectJob(jobId));
}, [dispatch]);
```

### 3. React Query Optimization

```typescript
// Cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 10,     // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Pagination optimization
const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
  queryKey: ['jobs'],
  queryFn: ({ pageParam = 1 }) => fetchJobs(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### 4. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={profileImage}
  alt="Profile"
  width={200}
  height={200}
  priority={false}
  placeholder="blur"
  blurDataURL={blurHash}
/>
```

---

## Testing Strategy

### 1. Unit Testing

```typescript
// Test API function
import { getJobs } from '@/api/jobs/method';
import apiClient from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('getJobs', () => {
  it('should fetch jobs successfully', async () => {
    const mockJobs = [{ id: '1', title: 'Job 1' }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: mockJobs,
    });

    const result = await getJobs();
    expect(result).toEqual(mockJobs);
    expect(apiClient.get).toHaveBeenCalledWith('/jobs');
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    (apiClient.get as jest.Mock).mockRejectedValue(error);

    await expect(getJobs()).rejects.toThrow('API Error');
  });
});
```

### 2. Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/JobCard';

describe('JobCard', () => {
  it('should render job information', () => {
    const job = {
      id: '1',
      title: 'React Developer',
      description: 'Build web apps',
    };

    render(<JobCard job={job} />);

    expect(screen.getByText('React Developer')).toBeInTheDocument();
    expect(screen.getByText('Build web apps')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    const job = { id: '1', title: 'Job', description: 'Desc' };

    render(<JobCard job={job} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });
});
```

### 3. Integration Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobListContainer } from '@/features/jobs';

const queryClient = new QueryClient();

describe('JobListContainer', () => {
  it('should load and display jobs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <JobListContainer />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('React Developer')).toBeInTheDocument();
    });
  });
});
```

---

## Security Best Practices

### 1. Authentication Security
- Tokens stored in secure httpOnly cookies
- CSRF protection via middleware
- Token refresh on expiration
- Automatic logout on inactivity

### 2. Data Validation
- Client-side validation before submission
- Server-side validation (backend)
- XSS prevention via React's automatic escaping
- Input sanitization

### 3. Authorization
- Role-based access control (RBAC)
- Route protection via middleware
- API endpoint protection
- Feature-level permissions

### 4. API Security
- CORS configuration
- Request timeout (10s)
- Rate limiting (backend)
- Input validation
- SQL injection prevention (backend)

### 5. Environment Variables
```
# Never commit secrets
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
JWT_SECRET=xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://...
S3_SECRET_KEY=xxxxxxxxxxxxxxxxxxxx
```

---

## Deployment Architecture

### Development Environment
```
Local Machine
    ↓
npm run dev (Next.js dev server on :3000)
    ↓
Localhost API (Backend on :9000)
```

### Production Environment
```
CI/CD Pipeline (GitHub Actions/etc)
    ↓
npm run build
    ↓
npm run start
    ↓
Vercel/AWS/Digital Ocean
    ↓
Production API Gateway
    ↓
Load Balancer
    ↓
Backend Services
```

---

**Document Version**: 1.0  
**Last Updated**: May 2026
