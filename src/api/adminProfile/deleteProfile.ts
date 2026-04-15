import api from "@/config/axios";

export const deleteProfile = async () => {
  const response = await api.delete("/api/admin-profile/delete");
  return response.data;
};
