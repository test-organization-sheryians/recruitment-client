export interface Test {
  _id: string;
  title: string;
  summury: string; // Backend typo maintained
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
}

export interface Enrollment {
  _id: string;
  testId: string;
  email: string;
  status: string;
  test: Test; // ✅ IMPORTANT: This holds the nested test data
  createdAt: string;
  updatedAt: string;
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