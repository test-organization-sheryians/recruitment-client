import api from "@/config/axios";
import { TestFormValues } from "../../types/Test";

export const createTest = async (data: TestFormValues) => {
  const response = await api.post("/api/tests", data);
  return response.data;
}