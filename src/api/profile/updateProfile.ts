import api from "@/config/axios";
import { Profile } from "@/types/profile";

interface UpdatePayload {
  [key: string]: unknown; // flexible, type-safe object
}

export const updateProfile = async (
  userId: string,
  data: UpdatePayload
): Promise<Profile> => {
  const res = await api.put(
    `/api/candidate-profile/update-profile`,
    {
      userId,
      ...data,
    }
  );

  return res.data;
};
