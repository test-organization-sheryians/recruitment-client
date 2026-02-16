export interface JobReport {
  _id: string;
  userId: string;
  jobId: string;
  reason: "spam" | "fake" | "wrong_info" | "other";
  description?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
  updatedAt: string;
}
