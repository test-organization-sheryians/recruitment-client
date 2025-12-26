import api from "@/config/axios";

/**
 * Update a user's role on the server.
 * Backend now expects a PUT to `/api/users/:id/role` with body `{ roleId }` and
 * returns `{ success, message, user }`.
 */
export const updateUserRole = async (userId: string, role: string) => {
  const res = await api.put(`/api/users/${userId}/role`, { roleId: role });
  return res.data;
};
