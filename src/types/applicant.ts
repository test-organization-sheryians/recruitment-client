// src/types/applicant.ts

export type ApplicantStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "forwareded"
  | "interview"
  | "hired";

export interface CandidateDetails {
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
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: ApplicantStatus;
  resume: string;
}