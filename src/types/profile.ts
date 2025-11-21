export interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  skills: string[];
  experience: Experience[];
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
