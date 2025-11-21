export interface CandidateProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  skills: string[];

  experience: Experience[];

  resumeUrl?: string;

  linkedin?: string;
  github?: string;

  availability: "full-time" | "part-time" | "freelance";
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

