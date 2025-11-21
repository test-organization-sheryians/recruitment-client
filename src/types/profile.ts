export interface CandidateProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  skills: string[];

  experience: Experience[];

  resumeUrl?: string;

  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  availability: "immediate" | "1_week" | "2_weeks" | "1_month" | "not_looking";
}

export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface AddSkillsPayload {
  skills: string[];
}

