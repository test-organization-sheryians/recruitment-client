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