export interface Education {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
}

export interface Experience {
  job_title: string;
  company: string;
  start_date: string;
  end_date: string;
  responsibilities?: string[];
}

export interface Skills {
  technical_skills?: string[];
  programming_languages?: string[];
  tools?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date_issued: string;
}

export interface Project {
  name: string;
  description: string;
  technologies?: string[];
}

export interface ResumeData {
  education?: Education[];
  experience?: Experience[];
  skills?: Skills;
  certifications?: Certification[];
  projects?: Project[];
}

export interface Result {
  data?: ResumeData;
}
