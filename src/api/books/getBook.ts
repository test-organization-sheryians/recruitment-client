import api from "@/config/axios";
import { Book } from "@/features/Rbooks/types/book";

export const getBookById = async (id: string): Promise<Book> => {
  const response = await api.get(`/api/books/${id}`);
  return response.data;
};
