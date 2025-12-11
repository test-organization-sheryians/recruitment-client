import api from "@/config/axios";

export const updateUser = async (updates: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}) => {
  const response = await api.patch("/api/users/me", updates);
  return response.data;
};