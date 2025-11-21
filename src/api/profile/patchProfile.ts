import api from "@/config/axios";
import { Profile } from "@/types/profile";

interface PatchData {
  [key: string]: unknown; // flexible but type-safe
}

export const patchProfile = async (
  userId: string,
  data: PatchData
): Promise<Profile> => {
  const res = await api.patch(
    `/api/candidate-profile/update-profile`,
    {
      userId,
      ...data,
    }
  );

  return res.data;
};
