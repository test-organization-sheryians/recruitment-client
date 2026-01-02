import api from "@/config/axios";

interface EnrollUserData {
  testId: string;
  emails: string[];
}

export const enrollTestuser = async (data: EnrollUserData) => {
  const response = await api.post("/api/enrollments/bulk-enroll", data);
  console.log(response.data);
  return response.data;
};
