import api from "@/config/axios";
import { Enrollment } from "@/types/Enrollment"

export const getCandidateEnrollments = async (email: string): Promise<Enrollment[]> => {
  const res = await api.get(`/api/enrollments/user/${email}`);
  return res.data.data;
};
