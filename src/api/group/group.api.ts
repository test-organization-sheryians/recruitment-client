import api from "@/config/axios";

/* GET ALL */
export const getGroups = async () => {
  const res = await api.get("/api/share");
  return res.data.data;
};

/* GET ONE */
export const getGroupById = async (id: string) => {
  const res = await api.get(`/api/share/${id}`);
  return res.data.data;
};

/* CREATE */
export const createGroup = async (data: {
  groupName: string;
  users: string[];
}) => {
  const res = await api.post("/api/share", data);
  return res.data.data;
};

/* UPDATE */
export const updateGroup = async (
  id: string,
  data: { groupName?: string }
) => {
  const res = await api.put(`/api/share/${id}`, data);
  return res.data.data;
};

/* DELETE */
export const deleteGroup = async (id: string) => {
  const res = await api.delete(`/api/share/${id}`);
  return res.data.data;
};

/* ADD USER */
export const addUserToGroup = async (
  groupId: string,
  userId: string
) => {
  const res = await api.post(
    `/api/share/${groupId}/user`,
    { userId }
  );
  return res.data.data;
};

/* REMOVE USER */
export const removeUserFromGroup = async (
  groupId: string,
  userId: string
) => {
  const res = await api.delete(
    `/api/share/${groupId}/user/${userId}`
  );
  return res.data.data;
};
