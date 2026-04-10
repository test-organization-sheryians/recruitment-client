export type Skill = {
  _id: string;
  name: string;
};

export type Category = {
  _id: string;
  name: string;
};

export type LocationForm = {
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type CreateJobFormValues = {
  title: string;
  requiredExperience: number;
  category: string;
  education: string;
  description: string;
  expiry: string;
  skills: Skill[];
  location: LocationForm;
};

export type CreateJobRequest = {
  title: string;
  requiredExperience: number;
  category: string;
  education: string;
  description: string;
  expiry: string;
  skills: string[];
  clientId: string;
  location: LocationForm;
};

export type JobFormData = {
  _id?: string;
  title: string;
  description: string;
  education: string;
  requiredExperience: number;
  category: string;
  skills: string[];
  expiry: string;
  clientId: string;
  location: LocationForm;
  jobType?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
};

export type APIResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type Job = {
  _id: string
  title: string
  requiredExperience?: string
  category?: Category
  education?: string
  description?: string
  expiry?: string
  skills?: Skill[]
  location?: LocationForm
  status?: "ACTIVE" | "DRAFT" | "INTERVIEWING" | "FILLED"
  applicantsCount?: number
  createdAt?: string
}
