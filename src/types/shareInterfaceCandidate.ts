export interface ShareCandidatePayload {
  candidateId: string;
}
export interface Skill {
  _id?: string;
  name?: string;
}

export interface Experience {
  _id?: string;
  company?: string;
  title?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ShareCandidate {
  _id: string;
  userId: string;
  availability: 'looking' | 'not_looking';
  resumeFile?: string;
  createdAt: string;
  updatedAt: string;

  user: User;
  skills: Skill[];
  experiences: Experience[];
}

export interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
export interface CreateShareCandidateResponse {
  message: string;
  shareLink: string;
}
