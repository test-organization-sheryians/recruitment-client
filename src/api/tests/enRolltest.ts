import api from "@/config/axios";

export const enRolltest = async (data: any) => {
  const response = await api.post("/api/enrollments", data);
  return response.data;
}

// http://localhost:9000/api/enrollments