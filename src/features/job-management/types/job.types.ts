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