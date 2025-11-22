 import api from "@/config/axios";



export const createExperience = async (data:any) => {
    console.log('create')
  const response = await api.post("/api/experience", data);
  console.log(response)
  return response.data;
};
