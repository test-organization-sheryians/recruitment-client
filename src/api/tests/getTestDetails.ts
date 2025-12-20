import api from "@/config/axios"; // or wherever your axios instance is
import { Test } from "@/types/Test";

export const getTestDetails = async (testId: string): Promise<Test> => {
  // Adjust URL to match your backend: e.g., /api/tests/64a... or /api/enrollments/test/64a...
  const response = await api.get(`/api/tests/${testId}`); 
  
  // Return the specific data object
  return response.data?.data || response.data;
};