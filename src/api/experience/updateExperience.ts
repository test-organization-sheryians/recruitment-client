 import api from "@/config/axios";


export const updateExperience = async (data: any) => {
  const { id, ...payload } = data; // remove id from body
  const response = await api.patch(`/api/experience/${id}`, payload); // send only the actual fields
  return response.data;
};
