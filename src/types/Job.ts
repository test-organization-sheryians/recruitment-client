// ================= SHARED MODELS =================

export interface Skill {
  _id?: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface LocationForm {
  city: string;
  state: string;
  country: string;
  pincode: string;
}

// ================= JOB MODEL =================

export interface Job {
  _id: string;
  title: string;
  requiredExperience: number; // Consistently number for your MERN logic
  education?: string;
  description?: string;
  expiry?: string;
  category?: Category | string;
  skills?: (Skill | string)[];
  location?: LocationForm;
  department?: string;
  status?: "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED";
  applicantsCount?: number;
  salary: number; // Changed to number for consistency
  isRemote: boolean;
  isFeatured: boolean;
  jobType?: "Remote" | "Hybrid" | "Full-Time" | "Part-Time";
  client?: {
    company?: string;
    _id?: string;
    [key: string]: unknown;
  };
  applied?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ================= FORM MODELS =================

export interface CreateJobFormValues {
  title: string;
  requiredExperience: number;
  category: string;
  education: string;
  description: string;
  expiry: string;
  skills: Skill[];
  location: LocationForm;
}

export interface CreateJobRequest extends Omit<CreateJobFormValues, 'skills'> {
  skills: string[]; // Backend expects IDs
  clientId: string;
}

export interface JobFormValues {
  title: string;
  description: string;
  location: LocationForm;
  salary: number;
  category: string;
  skills: string[];
  isRemote: boolean;
  isFeatured: boolean;
}

export interface SavedJob {
  _id: string;
  jobId: Job;
}

// ================= SEARCH MODELS =================

export type SearchQuery = {
  q: string;
  location: string;
};

export interface SearchParams {
  q?: string;
  location?: string;
  jobType?: string[];
  experience?: string[];
  minSalary?: number;
  maxSalary?: number;
  category?: string;
}