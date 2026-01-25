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
  requiredExperience: string;
  category: string;
  education: string;
  description: string;
  expiry: string;
  skills: Skill[];
  location: LocationForm;
};

export type CreateJobRequest = {
  title: string;
  requiredExperience: string;
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
  requiredExperience: string;
  category: string;
  skills: string[];
  expiry: string;
  clientId: string;
  location: LocationForm;
  employmentType?: string;
};

export type APIResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
}; 