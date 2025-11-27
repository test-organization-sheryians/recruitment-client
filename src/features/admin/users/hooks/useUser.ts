import axios from "axios";

export const getAllUsers = async () => {
  const res = await axios.get("/api/users");
  return res.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await axios.put(`/api/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (userId: string) => {
  return axios.delete(`http://localhost:9000/api/users/${userId}`);
};