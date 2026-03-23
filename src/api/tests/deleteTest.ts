import api from "@/config/axios";

export const deleteTest = async (testId: string) => {
  const response = await api.delete(`/api/tests/${testId}`);
  return response.data;
};
