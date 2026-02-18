// ================= SHARED MODELS =================

export interface Skill {
  _id?: string
  name: string
}

export interface Category {
  _id: string
  name: string
}

export interface LocationForm {
  city: string
  state: string
  country: string
  pincode: string
}

// ================= JOB MODEL =================

export interface Job {
  _id: string
  title: string

  requiredExperience?: number
  education?: string
  description?: string
  expiry?: string

  // populated OR id
  category?: Category | string
  skills?: (Skill | string)[]
  location?: LocationForm

  status?: "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"
  applicantsCount?: number
  createdAt?: string
  updatedAt?: string

  salary?: number
  isRemote?: boolean
  isFeatured?: boolean
  department?: string
  applied?: boolean
  id: string;
  title: string;
  location?: {
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  salary: number | string;
  isRemote: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt: string;
  _id: string;
  requiredExperience?: string;
  category?: Category | string;
  education?: string;
  description?: string;
  skills?: (Skill | string)[];
  department?: string;
  expiry?: string;
  applied?: boolean;
  client?: {
    company?: string;
    [key: string]: unknown;
  };


  jobType?: string;
}
// Category can be an object or string
interface Category {
  _id: string;
  name: string;
}

// ================= FORM MODELS =================

export interface CreateJobFormValues {
  title: string
  requiredExperience: number
  category: string
  education: string
  description: string
  expiry: string
  skills: Skill[]
  location: LocationForm
}

export interface CreateJobRequest {
  title: string
  requiredExperience: number
  category: string
  education: string
  description: string
  expiry: string
  skills: string[]
  clientId: string
  location: LocationForm
}


export interface SavedJob {
  _id: string;
  jobId: Job;
}


export interface SavedJob {
  _id: string;
  jobId: Job;
}

export interface JobFormValues {
  title: string;
  description: string;
  location: {
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  salary: number;
  category: string;
  skills: string[];
  isRemote: boolean;
  isFeatured: boolean;
}


// export interface PaginatedJobsResponse {
//    "success": true,
//   "data": {
//     "data": [Job],
//     "pagination": {
//       "totalRecords": number,
//       "totalPages": number,
//       "currentPage": number,
//       "limit": number
//     }
//   }
// }

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
