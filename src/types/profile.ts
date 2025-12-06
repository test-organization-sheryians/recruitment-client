import { ExperienceItem } from "./ExperienceItem ";
export interface CandidateProfile {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  skills: string[];
  experiences: ExperienceItem[];
  resumeFile?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  availability: "immediate" | "1_week" | "2_weeks" | "1_month" | "not_looking";
}

export interface AddSkillsPayload {
  skills: string[];
}
