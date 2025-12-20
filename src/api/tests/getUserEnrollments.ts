import api from "@/config/axios";
import { Enrollment } from "@/types/Test"; // ✅ Import Enrollment

export const getUserEnrollments = async (email: string): Promise<Enrollment[]> => {
  const response = await api.get(`/api/enrollments/user/${email}`);
  // Return the array of enrollments
  return response.data?.data || response.data || []; 
};