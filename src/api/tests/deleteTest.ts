import api from "@/config/axios";

export const deleteTest = async (id: string) => {
  const response = await api.delete(`/api/tests/${id}`);
  return response.data;
};
