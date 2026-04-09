import api from "@/config/axios";
import { UpdatePasswordPayload } from "@/types/auth";

export const updatePassword = async (payload: UpdatePasswordPayload) => {
  const response = await api.patch("/api/password/update-password", payload);
  return response.data;
};
