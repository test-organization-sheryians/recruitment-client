

import api from "@/config/axios";

export const deleteSkill = async (id: string) => {
  console.log("API RECEIVED ID:", id);
  const response = await api.delete(`api/skills/${id}` );
  return response.data;
};