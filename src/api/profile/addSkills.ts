import api from "@/config/axios";
export const addSkills = async (userId: string, skills: string[]) => {
  const res = await api.post(`/api/candidate-profile/${userId}/skills`, {
    skills,
  });
  return res.data;
};