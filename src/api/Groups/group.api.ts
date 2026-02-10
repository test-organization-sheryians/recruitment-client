import api from "@/config/axios";

// GET ALL GROUPS
export const getGroups = async () => {
  const res = await api.get("/api/share");
  return res.data.data;
};

// GET SINGLE GROUP
export const getGroupById = async (id: string) => {
  const res = await api.get(`/api/share/${id}`);
  return res.data.data;
};

// CREATE GROUP
export const createGroup = async (payload: {
  groupName: string;
  selectedUsers: string[];
}) => {
  const res = await api.post("/api/share", {
    groupName: payload.groupName,
    users: payload.selectedUsers, // backend expects `users`
  });

  return res.data.shareLink; // backend returning group inside shareLink
};

// UPDATE GROUP
export const updateGroup = async (
  id: string,
  payload: Partial<{ groupName: string; selectedUsers: string[] }>
) => {
  const res = await api.put(`/api/share/${id}`, payload);
  return res.data.data;
};

// DELETE GROUP
export const deleteGroup = async (id: string) => {
  const res = await api.delete(`/api/share/${id}`);
  return res.data;
};
