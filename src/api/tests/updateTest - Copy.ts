import api from "@/config/axios";
import { TestFormValues } from "../../types/Test";

export const updateTest = async (data: TestFormValues) => {
  const response = await api.patch(`/api/tests/${data.id}`, data);
  return response.data;
}