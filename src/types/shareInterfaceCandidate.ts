// ================= SHARE CANDIDATE =================

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
  availability: "looking" | "not_looking";
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

// ================= GROUP =================

export interface GroupUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Single unified Group interface
 * Works for:
 * - get all groups (with memberCount)
 * - get single group (with selectedUsers)
 */
export interface Group {
  _id: string;
  groupName: string;
  memberCount: number;   // 👈 backend se aa raha hai
  createdAt?: string;
  updatedAt?: string;
}


export interface UpdateGroupPayload {
  groupId: string;
  newName: string;
}

export interface RemoveUserPayload {
  groupId: string;
  userId: string;
}
