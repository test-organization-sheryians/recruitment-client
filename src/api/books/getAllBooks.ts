import api from "@/config/axios";
import { Book } from "@/features/Rbooks/types/book";

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get("/api/books");
  return response.data.data;
};
