import api from "@/config/axios";

export const deleteBook = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/books/${id}`);
  return response.data;
};
