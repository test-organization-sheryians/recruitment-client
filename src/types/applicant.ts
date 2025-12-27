// src/types/applicant.ts

export type ApplicantStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "forwareded"
  | "interview"
  | "hired";

export interface CandidateDetails {
  _id: string; // <--- ADDED: TypeScript now knows this exists
  firstName: string;
  lastName: string;
  email: string;
}

export interface JobDetails {
  title: string;
  requiredExperience: number;
}

export interface ApplicantApi {
  _id: string;
  candidateDetails: CandidateDetails;
  candidateId?: string; // <--- ADDED: Optional fallback
  jobDetails: JobDetails;
  appliedAt: string;
  totalExperienceYears: number;
  status: ApplicantStatus;
  resumeUrl: string;
}

export interface ApplicantsApiResponse {
  applicants: ApplicantApi[];
}

export interface ApplicantRow {
  id: string;
  candidateUserId: string; // We use this in the UI
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: ApplicantStatus;
  resume: string;
}

export type InterviewStatus =
  | "Scheduled"
  | "Rescheduled"
  | "Cancelled";

export type CreateInterviewPayload = {
  jobId: string;
  candidateId: string;
  interviewerEmail: string;
  meetingLink: string;
  timing: string;
  status?: InterviewStatus;
};
