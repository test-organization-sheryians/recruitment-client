import api from "@/config/axios";

export interface UpdateMeInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const updateMe = async (data: UpdateMeInput) => {
  const response = await api.patch("/api/users/me", data);
  return response.data;
};
