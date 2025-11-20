import api from "@/config/axios";
export const removeSkill = async (skillId: string) => {
  const res = await api.delete(
    `/api/candidate-profile/remove-skill/${skillId}`,
    { withCredentials: true }
  );
  return res.data;
};
