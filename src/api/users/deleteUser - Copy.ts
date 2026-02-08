import api from "@/config/axios";

export const deleteUser = async (userId: string) => {
  const res = await api.delete(`/api/users/${userId}`);
  return res.data;
};
