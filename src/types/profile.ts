export interface User {
  _id?: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Profile {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  skills: string[];
  experience: Experience[];
  linkedin?: string;
  github?: string;
  user?: User;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface AddSkillPayload {
  userId: string;
  skills: string[];
}

export interface UpdateProfilePayload {
  userId: string;
  updateData: Partial<Profile>;
}

