import api from "@/config/axios";
// import { TestFormValues } from "../../types/Test";

export const getTest = async () => {
  const response = await api.get("/api/tests/published/all");
//   server returns { success: true, data: [...] }
  return response.data?.data ?? [];
}

