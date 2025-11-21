import api from "@/config/axios";

export const addSkills = async (skills: string[]) => {
  const response = await api.post("/api/candidate/add-skills", { skills });
  return response.data;
};
