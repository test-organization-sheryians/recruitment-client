export interface Enrollment {
  _id: string;
  testId: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolledUser {
  _id: string;
  email: string;
  phoneNumber?: string;
  roleId?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Test {
  _id: string;
  title: string;
  summury: string;
  showResults: boolean;
  createdBy: string;
  category: string;
  status: boolean;
  duration: number;
  passingScore: number;
  prompt: string;
  createdAt: string;
  updatedAt: string;

  enrollments: Enrollment[];
  enrolledUsers: EnrolledUser[];
  enrolledCount: number;
}
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

export type TestFormValues = {
  title: string;
  description: string;
  duration: number;
  summury: string;
  category: string;
  passingScore: number;
  prompt: string;
  showResults: boolean; // ✅ ADD THIS
  id?: string;         // ✅ OPTIONAL (needed for update)
};


export interface TestFormPayload {
  id?: string;
  title: string;
  summury: string;
  description: string;
  category: string;
  duration: number;
  passingScore: number;
  prompt: string;
  showResults: boolean;
}

export interface Test {
  _id: string;
  title: string;
  category: string;
  duration: number;
  passingScore: number;
  showResults: boolean;
}

export interface TestFormPayload {
  id?: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  duration: number;
  passingScore: number;
  prompt: string;
  showResults: boolean;
}
