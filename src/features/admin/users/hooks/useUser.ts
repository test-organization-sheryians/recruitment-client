import axios from "axios";

export const getAllUsers = async () => {
  const res = await axios.get("/api/users");
  return res.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await axios.put(`/api/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axios.delete(`/api/users/${id}`);
  return res.data;
};
