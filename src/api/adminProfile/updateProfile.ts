import api from "@/config/axios";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await api.patch("/api/admin-profile/update", payload);
  return response.data;
};
