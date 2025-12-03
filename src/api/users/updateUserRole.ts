// import api from "@/config/axios";

// export const updateUserRole = async (userId: string, role: string) => {
//   const res = await api.put(`/api/users/${userId}/role`, { roleId: role });
//   return res.data;
// };


import api from "@/config/axios";

export const updateUserRole = async (userId: string, roleId: string) => {
  const res = await api.put(`/api/users/${userId}/role`, { roleId });
  return res.data;
};

// export const updateUserRole = async (userId: string, role: string) => {
//   const res = await api.put(`/api/users/${userId}/role`, { roleId: role });
//   return res.data;
// };
