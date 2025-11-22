 import api from "@/config/axios";


export const getCandidateExperience = async (data: any) => {
  const response = await api.get(`/api/experience/candidate/${data._id}`);
  return response.data;
};
