import api from "@/config/axios";
import { Test } from "@/types/Test";

export const getTestDetails = async (id: string): Promise<Test> => {
  const response = await api.get(`/api/tests/${id}`);
  console.log(response.data);
  return response.data.data as Test;
  
};
