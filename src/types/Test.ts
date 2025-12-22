// src/types/Test.ts

// 1. User details for the Admin "Enrolled Users" list
export interface EnrolledUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface TestAttempt {
  _id: string;
  testId: string;
  email: string;
  score: number;
  percentage: number;
  isPassed: boolean;
  status: "Started" | "Graded"; 
  createdAt: string;
  updatedAt: string;
  test: Test; // ✅ Added: This contains the Test Details (Title, Summary, etc.)
}

// 2. The Core Test Object
export interface Test {
  _id: string;
  title: string;
  summury: string; 
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

  // ✅ OPTIONAL FIELDS
  enrollments?: Enrollment[];     
  enrolledUsers?: EnrolledUser[]; 
  enrolledCount?: number; 
  
  // ✅ For Candidate Status
  attempt?: TestAttempt;
}

// 3. The Enrollment Wrapper
export interface Enrollment {
  _id: string;
  testId: string;
  email: string;
  status: string;
  test: Test; 
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

// 5. Form Values
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