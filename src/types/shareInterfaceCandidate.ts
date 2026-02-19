// types/shareInterfaceCandidate.ts

/* =====================================================
   COMMON BACKEND RESPONSE
===================================================== */

export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =====================================================
   SHARE REQUEST ITEM
===================================================== */

export interface ShareCandidatePayload {
  candidateId: string;
}

/* =====================================================
   CREATE GROUP PAYLOAD
===================================================== */

export interface CreateGroupPayload {
  groupName: string;
  users: ShareCandidatePayload[];
}

/* =====================================================
   UNION PAYLOAD
===================================================== */

export type ShareMutationPayload =
  | ShareCandidatePayload[]
  | CreateGroupPayload;

/* =====================================================
   SHARE RESPONSE
===================================================== */

export interface ShareResponse {
  success: boolean;
  message: string;
  shareLink: string;
  groupName?: string;
}

/* =====================================================
   CREATE SHARE RESPONSE (OPTIONAL LEGACY SUPPORT)
===================================================== */

export interface CreateShareCandidateResponse {
  message: string;
  shareLink: string;
}

/* =====================================================
   SKILL
===================================================== */

export interface Skill {
  _id?: string;
  name?: string;
}

/* =====================================================
   EXPERIENCE
===================================================== */

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

/* =====================================================
   SHARE USER
===================================================== */

export interface ShareUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/* =====================================================
   SHARE CANDIDATE
===================================================== */

export interface ShareCandidate {
  _id: string;
  userId: string;

  availability?: string;
  resumeFile?: string;

  createdAt?: string;
  updatedAt?: string;

  user?: ShareUser;
  skills?: Skill[];
  experiences?: Experience[];
}

/* =====================================================
   GROUP USER
===================================================== */

export interface GroupUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/* =====================================================
   GROUP
===================================================== */

export interface Group {
  _id: string;
  groupName: string;

  memberCount?: number;

  createdAt?: string;
  updatedAt?: string;

  selectedUsers?: GroupUser[];
}

/* =====================================================
   GROUP PAYLOADS
===================================================== */

// Update group name
export interface UpdateGroupPayload {
  groupId: string;
  newName: string;
}

// Remove user from group
export interface RemoveUserPayload {
  groupId: string;
  userId: string;
}

// Add user to group
export interface AddUserPayload {
  groupId: string;
  userId: string;
}

/* =====================================================
   SHARE CANDIDATES RESPONSE
===================================================== */

export interface ShareCandidatesResponse {
  success?: boolean;
  message?: string;

  groupName?: string;
  selectedUsers?: ShareCandidate[];

  data?:
    | {
        groupName?: string;
        selectedUsers?: ShareCandidate[];
      }
    | ShareCandidate[]
    | null;
}
