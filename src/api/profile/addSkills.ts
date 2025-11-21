import api from "@/config/axios";
export const addSkills = async ( userId:string , skills:string[]) => {
  const res = await api.post(`/api/candidate-profile/add-skills`, {
    userId,
    skills,
  });
  return res.data;
};