import { ExperienceItem } from "./ExperienceItem ";

/**
 * 🔹 User info (comes from User model)
 */
export interface ProfileUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}


export interface CandidateProfile {
  _id: string;

  user?: ProfileUser; 

  skills: string[];
  experiences: ExperienceItem[];

  resumeFile?: string;
  resumeFileNoPI?: string;

  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  availability:
    | "immediate"
    | "1_week"
    | "2_weeks"
    | "1_month"
    | "not_looking";

  completion?: number;
}

export interface AddSkillsPayload {
  skills: string[];
}
