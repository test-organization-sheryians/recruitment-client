import api from "@/config/axios";
import { Profile } from "@/types/profile";

export const patchProfile = async (
  userId: string,
  data: FormData
): Promise<Profile> => {
  // Append userId to the FormData if it's not already set
  if (!data.has('userId')) {
    data.append('userId', userId);
  }
  
  const res = await api.patch(
    `/api/candidate-profile/update-profile`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};
