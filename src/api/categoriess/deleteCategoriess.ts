import api from "@/config/axios";

export const deleteCategoriess = async (id: string) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};
