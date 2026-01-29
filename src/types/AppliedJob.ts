// types/AppliedJob.ts
export interface AppliedJob {
  _id: string;
  jobId: string;
  jobTitle: string;
  status: "shortlisted" | "rejected" | "interview" | "forwareded";
  appliedAt: string;
    createdAt: string;
    updatedAt: string;}
