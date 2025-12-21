// src/types/Test.ts

// 1. User details for the Admin "Enrolled Users" list
export interface EnrolledUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

// 2. The Core Test Object
export interface Test {
  _id: string;
  title: string;
  summury: string; // ✅ Matches backend spelling
  description?: string;
  showResults: boolean;
  createdBy?: string;
  category: string;
  status: boolean;
  duration: number;
  passingScore: number;
  prompt?: string;
  createdAt: string;
  updatedAt: string;

  // ✅ OPTIONAL FIELDS (Required for Admin Panel to work)
  enrollments?: Enrollment[];     
  enrolledUsers?: EnrolledUser[]; 
  enrolledCount?: number;         
}

// 3. The Enrollment Wrapper (Matches Candidate API Response)
export interface Enrollment {
  _id: string;
  testId: string;
  email: string;
  status: string;
  test: Test; // ✅ The actual Test object is nested here
  createdAt: string;
  updatedAt: string;
}

// 4. The Attempt Object
export interface Attempt {
  _id: string;
  testId: string;
  userId: string;
  score: number;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

// 5. Form Values for Admin Create/Update
export type TestFormValues = {
  id?: string;
  title: string;
  summury: string;
  description: string;
  category: string;
  duration: number;
  passingScore: number;
  prompt: string;
  showResults: boolean;
};