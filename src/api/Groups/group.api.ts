import api from "@/config/axios";

/* ============================= */
/* GET ALL GROUPS */
/* ============================= */
export const getGroups = async () => {
  const res = await api.get("/api/share");
  return res.data.data;   // backend returns { success, count, data }
};

/* ============================= */
/* CREATE GROUP */
/* ============================= */
export const createGroup = async (data: {
  groupName: string;
  users: string[];
}) => {
  const res = await api.post("/api/share", data);
  return res.data;
};

/* ============================= */
/* UPDATE GROUP */
/* ============================= */
export const updateGroup = async (
  id: string,
  data: { groupName?: string; selectedUsers?: string[] }
) => {
  const res = await api.put(`/api/share/${id}`, data);
  return res.data.data;
};

/* ============================= */
/* DELETE GROUP */
/* ============================= */
export const deleteGroup = async (id: string) => {
  const res = await api.delete(`/api/share/${id}`);
  return res.data;
};

/* ============================= */
/* REMOVE USER FROM GROUP */
/* ============================= */
export const removeUserFromGroup = async (
  groupId: string,
  userId: string
) => {
  const res = await api.delete(
    `/api/share/${groupId}/user/${userId}`
  );
  return res.data.data;
};
