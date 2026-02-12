import api from "@/config/axios";
import { Book } from "@/features/Rbooks/types/book";

export const updateBook = async (id: string, data: Partial<Book>): Promise<Book> => {
  const response = await api.put(`/api/books/${id}`, data);
  return response.data;
};
