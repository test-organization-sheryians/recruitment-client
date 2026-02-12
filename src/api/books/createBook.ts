import api from "@/config/axios";
import { CreateBookPayload, Book } from "@/features/Rbooks/types/book";

export const createBook = async (data: CreateBookPayload): Promise<Book> => {
  const response = await api.post("/api/books", data);
  return response.data;
};
