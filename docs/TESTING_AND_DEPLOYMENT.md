# Testing & Deployment Guide

## Testing Overview

The recruitment platform uses a multi-layered testing approach:

### Testing Pyramid
```
        □ E2E Tests (Cypress/Playwright)
       ◇◇ Integration Tests (React Testing Library)
      ◇◇◇ Unit Tests (Jest)
```

---

## Unit Testing

### Test Structure

**File Naming**: `componentName.test.ts` or `functionName.test.ts`

**Location**: Place tests alongside source files or in `__tests__` directory

### Testing API Functions

```typescript
// src/api/jobs/__tests__/getJobs.test.ts
import { getJobs } from '../getJobs';
import apiClient from '@/lib/api-client';

jest.mock('@/lib/api-client');

describe('getJobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch jobs with default parameters', async () => {
    const mockJobs = [
      { id: '1', title: 'Job 1', description: 'Desc 1' },
      { id: '2', title: 'Job 2', description: 'Desc 2' },
    ];

    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { jobs: mockJobs, pagination: { page: 1, total: 2 } },
    });

    const result = await getJobs();

    expect(result).toEqual({ jobs: mockJobs, pagination: { page: 1, total: 2 } });
    expect(apiClient.get).toHaveBeenCalledWith('/jobs', expect.any(Object));
  });

  it('should fetch jobs with custom filters', async () => {
    const mockJobs = [{ id: '1', title: 'React Job' }];
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { jobs: mockJobs },
    });

    await getJobs({ search: 'React', category: 'cat-1' });

    expect(apiClient.get).toHaveBeenCalledWith('/jobs', {
      params: { search: 'React', category: 'cat-1' },
    });
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('Network error');
    (apiClient.get as jest.Mock).mockRejectedValue(error);

    await expect(getJobs()).rejects.toThrow('Network error');
  });
});
```

### Testing Redux Slices

```typescript
// src/redux/slices/__tests__/authSlice.test.ts
import authReducer, { setUser, logout, setAuthLoading } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthLoading: true,
  };

  it('should handle setUser', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    const state = authReducer(initialState, setUser(user));

    expect(state.user).toEqual(user);
    expect(state.isAuthLoading).toBe(false);
  });

  it('should handle logout', () => {
    const state = authReducer(
      { user: { id: '1', name: 'John' }, isAuthLoading: false },
      logout()
    );

    expect(state.user).toBeNull();
    expect(state.isAuthLoading).toBe(false);
  });

  it('should handle setAuthLoading', () => {
    const state = authReducer(initialState, setAuthLoading(false));
    expect(state.isAuthLoading).toBe(false);
  });
});
```

### Testing Utilities

```typescript
// src/lib/__tests__/utils.test.ts
import { cn, startSessionWatcher } from '../utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('py-1');
    expect(result).toContain('px-4');
    // Tailwind merging - px-4 takes precedence over px-2
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('should handle empty inputs', () => {
    const result = cn('', undefined, null);
    expect(result).toBe('');
  });
});

describe('startSessionWatcher', () => {
  it('should set timeout for logout', () => {
    jest.useFakeTimers();
    const mockLogout = jest.fn();

    startSessionWatcher(3600);  // 1 hour

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3600000);

    jest.runAllTimers();
    jest.useRealTimers();
  });
});
```

---

## Component Testing

### Testing with React Testing Library

```typescript
// src/components/__tests__/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '../JobCard';

describe('JobCard Component', () => {
  const mockJob = {
    id: 'job-1',
    title: 'Senior React Developer',
    description: 'Build amazing web apps',
    company: 'Tech Corp',
    location: 'Remote',
    salaryRange: { min: 80000, max: 120000 },
  };

  it('should render job information', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  it('should display salary range', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText(/\$80,000 - \$120,000/i)).toBeInTheDocument();
  });

  it('should call onApply when apply button is clicked', () => {
    const mockOnApply = jest.fn();
    render(<JobCard job={mockJob} onApply={mockOnApply} />);

    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith('job-1');
  });

  it('should show "Already Applied" for applied jobs', () => {
    render(<JobCard job={mockJob} isApplied={true} />);

    expect(screen.getByText('Already Applied')).toBeInTheDocument();
  });

  it('should render a link to job details', () => {
    render(<JobCard job={mockJob} />);

    const detailsLink = screen.getByRole('link', { name: /view details/i });
    expect(detailsLink).toHaveAttribute('href', `/jobs/${mockJob.id}`);
  });
});
```

### Testing Forms

```typescript
// src/features/jobs/__tests__/JobForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobForm } from '../JobForm';

describe('JobForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create job/i })).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<JobForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<JobForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/job title/i), 'React Developer');
    await user.type(screen.getByLabelText(/description/i), 'Build web apps');
    await user.type(screen.getByLabelText(/company/i), 'Tech Corp');

    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'React Developer',
        description: 'Build web apps',
        company: 'Tech Corp',
      });
    });
  });
});
```

### Testing Hooks

```typescript
// src/features/jobs/__tests__/useJobForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { useJobForm } from '../hooks/useJobForm';

describe('useJobForm Hook', () => {
  it('should initialize with empty values', () => {
    const { result } = renderHook(() => useJobForm());

    expect(result.current.formData).toEqual({
      title: '',
      description: '',
      company: '',
    });
  });

  it('should handle field changes', () => {
    const { result } = renderHook(() => useJobForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'title', value: 'React Job' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.title).toBe('React Job');
  });

  it('should validate form before submission', () => {
    const { result } = renderHook(() => useJobForm());

    act(() => {
      result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as React.FormEvent);
    });

    expect(result.current.errors).toHaveProperty('title');
  });
});
```

---

## Integration Testing

### Testing React Query with Mocked API

```typescript
// src/features/jobs/__tests__/JobList.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobList } from '../JobList';
import * as jobApi from '@/api/jobs';

jest.mock('@/api/jobs');

describe('JobList Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should load and display jobs', async () => {
    const mockJobs = [
      { id: '1', title: 'Job 1', description: 'Desc 1' },
      { id: '2', title: 'Job 2', description: 'Desc 2' },
    ];

    (jobApi.getJobs as jest.Mock).mockResolvedValue({
      jobs: mockJobs,
      pagination: { page: 1, total: 2 },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <JobList />
      </QueryClientProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument();
      expect(screen.getByText('Job 2')).toBeInTheDocument();
    });
  });

  it('should handle loading errors', async () => {
    (jobApi.getJobs as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <JobList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  it('should display loading state during refetch', async () => {
    const mockJobs = [{ id: '1', title: 'Job 1', description: 'Desc' }];

    (jobApi.getJobs as jest.Mock).mockResolvedValue({
      jobs: mockJobs,
      pagination: { page: 1, total: 1 },
    });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <JobList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Job 1')).toBeInTheDocument();
    });

    // Simulate refetch
    const refetchButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refetchButton);

    expect(screen.getByText(/loading|refreshing/i)).toBeInTheDocument();
  });
});
```

---

## Test Configuration

### Jest Setup

**File**: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Jest Setup File

**File**: `jest.setup.js`

```javascript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: '/',
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- JobCard.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Update snapshots
npm test -- -u
```

### Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# Coverage output:
# PASS src/api/jobs/__tests__/getJobs.test.ts
#   File       | % Stmts | % Branch | % Funcs | % Lines |
#   -----------|---------|----------|---------|---------|
#   getJobs.ts |   100   |   100    |   100   |   100   |

# View HTML coverage
open coverage/lcov-report/index.html
```

---

## Deployment

### Build Process

```bash
# Development Build
npm run dev
# Runs Next.js dev server on http://localhost:3000

# Production Build
npm run build
# Creates optimized build in .next directory
# Includes:
# - Code splitting
# - Minification
# - Tree-shaking
# - Image optimization

# Start Production Server
npm run start
# Runs production server
```

### Build Optimization

**File**: `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable Turbopack for faster builds
  experimental: {
    turbopack: true,
  },

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
    ],
  },

  // Compression
  compress: true,

  // Generate ETags for cache control
  generateEtags: true,

  // Production source maps
  productionBrowserSourceMaps: false,

  // Redirects and rewrites
  redirects: async () => [],
  rewrites: async () => [],
};

export default nextConfig;
```

---

## Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run lint` - no ESLint errors
- [ ] Run `npm test` - all tests pass
- [ ] Code coverage ≥ 70%
- [ ] No TypeScript errors
- [ ] No console errors or warnings

### Security
- [ ] No secrets in code
- [ ] Environment variables configured
- [ ] CORS headers correct
- [ ] Authentication middleware in place
- [ ] Authorization checks on protected routes

### Performance
- [ ] Bundle size analyzed and acceptable
- [ ] Images optimized
- [ ] Code splitting working
- [ ] Lighthouse score ≥ 90
- [ ] Core Web Vitals optimized

### Configuration
- [ ] API base URL correct
- [ ] Database migrations applied
- [ ] Environment variables set on server
- [ ] SSL/TLS certificates valid
- [ ] Backup strategy in place

### API Integration
- [ ] All endpoints tested
- [ ] Error handling working
- [ ] Rate limiting configured
- [ ] Logging enabled
- [ ] CORS properly configured

### Monitoring
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Performance monitoring enabled
- [ ] Log aggregation configured
- [ ] Alerts configured
- [ ] Dashboard setup

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

**Setup**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Advantages**:
- Optimized for Next.js
- Zero-config deployments
- Automatic HTTPS
- Built-in CI/CD
- Global CDN

### Option 2: Docker + Kubernetes

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

**Build & Deploy**:
```bash
# Build Docker image
docker build -t recruitment-client:1.0 .

# Run container
docker run -p 3000:3000 recruitment-client:1.0

# Push to registry
docker tag recruitment-client:1.0 registry/recruitment-client:1.0
docker push registry/recruitment-client:1.0

# Deploy to Kubernetes
kubectl apply -f deployment.yaml
```

### Option 3: AWS (EC2 + S3 + CloudFront)

**Architecture**:
```
S3 (Static Assets)
    ↓
CloudFront (CDN)
    ↓
EC2 (App Server)
    ↓
RDS (Database)
    ↓
Route 53 (DNS)
```

### Option 4: DigitalOcean App Platform

**Deployment**:
1. Connect GitHub repository
2. Create new app
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Set environment variables
6. Deploy

---

## Environment Variables

### Development

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
NODE_ENV=development
JWT_SECRET=dev-secret-key
```

### Staging

```bash
# .env.staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com
NODE_ENV=production
JWT_SECRET=staging-secret-key
```

### Production

```bash
# .env.production (Set on hosting platform)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NODE_ENV=production
JWT_SECRET=secure-production-secret
MONITORING_API_KEY=sentry-dsn-key
```

---

## Monitoring & Analytics

### Error Tracking (Sentry)

```typescript
// Initialize in app
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring (Web Vitals)

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

### Analytics (Google Analytics)

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAnalytics() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag.pageview({ page_path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);
}
```

---

## Rollback Strategy

### Rollback from Failed Deployment

```bash
# If using Vercel
vercel rollback

# If using Docker
docker pull registry/recruitment-client:previous-version
docker run -p 3000:3000 registry/recruitment-client:previous-version

# If using git
git revert <commit-hash>
git push origin main
npm run build && npm start
```

---

## Post-Deployment

### Verification
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Core features functional
- [ ] API responses correct
- [ ] No errors in browser console
- [ ] Performance acceptable

### Monitoring
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Monitor API response times
- [ ] Watch server logs
- [ ] Monitor user sessions

### Documentation
- [ ] Update deployment notes
- [ ] Document any issues encountered
- [ ] Update runbook
- [ ] Create incident report if needed

---

**Document Version**: 1.0  
**Last Updated**: May 2026
