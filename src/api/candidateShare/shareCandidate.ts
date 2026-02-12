import api from "@/config/axios";
import { ShareCandidate } from "../../types/shareInterfaceCandidate";

/* ================= CREATE GROUP ================= */
export const createShareCandidate = async (
  groupName: string,
  users: { candidateId: string }[]
) => {
  const response = await api.post("/api/share", {
    groupName,
    users: users.map(u => u.candidateId),
  });
  return response.data;
};

/* ================= GET ALL GROUPS ================= */
export const getAllGroups = async () => {
  const response = await api.get("/api/share");
  return response.data.data;
};

/* ================= GET SINGLE GROUP ================= */
export const getShareCandidate = async (shareId: string): Promise<ShareCandidate[]> => {
  const response = await api.get(`/api/share/${shareId}`);
  return response.data.data;
};

/* ================= UPDATE GROUP NAME (PUT) ================= */
export const updateGroupName = async (groupId: string, newName: string) => {
  const response = await api.put(`/api/share/${groupId}`, {
    groupName: newName,
  });
  return response.data;
};

/* ================= DELETE GROUP ================= */
export const deleteGroup = async (groupId: string) => {
  const response = await api.delete(`/api/share/${groupId}`);
  return response.data;
};

/* ================= ADD USER TO GROUP ================= */
export const addUserToGroup = async (
  groupId: string,
  userId: string
) => {
  const response = await api.put(
    `/api/share/${groupId}/user/${userId}`
  );
  return response.data;
};



/* ================= REMOVE USER FROM GROUP ================= */
export const removeUserFromGroup = async (groupId: string, userId: string) => {
  const response = await api.delete(
    `/api/share/${groupId}/user/${userId}`
  );
  return response.data;
};

