export interface Enrollment {
  _id: string;
  status: "Assigned" | "Started" | "Completed";
  createdAt: string;
  test: {
    _id: string;
    title: string;
    summury: string;
    duration: number;
    category?: string;
    passingScore: number;
    showResults: boolean;
  };
}

export interface TestAttempt {
  _id: string;
  score: number;
  percentage: number;
  isPassed: boolean;
  status: "Started" | "Submitted" | "Graded" | "Failed";
  startTime: string;
  endTime?: string;
  durationTaken?: number;
}
