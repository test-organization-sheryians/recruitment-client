import api from "@/config/axios";

export const updateUserRole = async (userId: string, role: string) => {
  const res = await api.post(`/api/auth/update?id=${userId}`, { roleId:role });
  return res.data;
};
