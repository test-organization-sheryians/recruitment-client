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

  requiredExperience?: string
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
}

// ================= FORM MODELS =================

export interface CreateJobFormValues {
  title: string
  requiredExperience: string
  category: string
  education: string
  description: string
  expiry: string
  skills: Skill[]
  location: LocationForm
}

export interface CreateJobRequest {
  title: string
  requiredExperience: string
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