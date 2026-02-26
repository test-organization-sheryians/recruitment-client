// services/shareCandidate.service.ts

import api from "@/config/axios";
import {
  BackendResponse,
  ShareCandidatePayload,
  ShareResponse,
  ShareCandidate,
  Group,
} from "@/types/shareInterfaceCandidate";

/* =====================================================
   HELPERS
===================================================== */

const extractData = <T>(res: BackendResponse<T>): T => {
  return res?.data ?? (null as T);
};

/* =====================================================
   CREATE SHARE / GROUP
===================================================== */

export const createShareCandidate = async (
  groupName: string | undefined,
  users: ShareCandidatePayload[]
): Promise<ShareResponse> => {
  const payload =
    groupName && groupName.trim().length > 0
      ? {
          groupName,
          users: users.map((u) => u.candidateId),
        }
      : users.map((u) => u.candidateId);

  const res = await api.post<ShareResponse>("/api/share", payload);

  return res.data;
};

/* =====================================================
   GET ALL GROUPS
===================================================== */

export const getAllGroups = async (): Promise<Group[]> => {
  const res = await api.get<BackendResponse<Group[]>>("/api/share");

  return extractData(res.data) ?? [];
};

/* =====================================================
   GET SINGLE SHARE / GROUP DETAILS
===================================================== */



export const getShareCandidate = async (shareId: string): Promise<any> => {
  if (!shareId) return null;

  
  const res = await api.get<BackendResponse<any>>(`/api/share/share/${shareId}`);
  
 
  return res.data; 
};


/*=====================================================
   UPDATE GROUP NAME
===================================================== */

export const updateGroupName = async (
  groupId: string,
  newName: string
): Promise<ShareResponse> => {
  const res = await api.put<ShareResponse>(`/api/share/${groupId}`, {
    groupName: newName,
  });

  return res.data;
};

/* =====================================================
   DELETE GROUP
===================================================== */

export const deleteGroup = async (
  groupId: string
): Promise<ShareResponse> => {
  const res = await api.delete<ShareResponse>(`/api/share/${groupId}`);

  return res.data;
};

/* =====================================================
   ADD USER TO GROUP
===================================================== */

export const addUserToGroup = async (
  groupId: string,
  userId: string
): Promise<ShareResponse> => {
  const res = await api.put<ShareResponse>(
    `/api/share/${groupId}/user/${userId}`
  );

  return res.data;
};

/* =====================================================
   REMOVE USER FROM GROUP
===================================================== */

export const removeUserFromGroup = async (
  groupId: string,
  userId: string
): Promise<ShareResponse> => {
  const res = await api.delete<ShareResponse>(
    `/api/share/${groupId}/user/${userId}`
  );

  return res.data;
};
