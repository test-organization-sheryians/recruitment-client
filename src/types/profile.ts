export interface Profile {
  _id: string;
  id?: string; 
  userId?: string;
    user?: {
    _id?: string;
    id?: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  skills: string[];
  experience: Experience[];
  linkedin?: string;  // added
  github?: string;    // added
}

export interface User {
  id?: string;
  _id: string;
  email: string;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  title: string;
  start: string;
  end?: string;
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
