import api from "@/config/axios";
import { notifyManager } from "@tanstack/react-query";

export interface Category {
  _id: string;
  name: string;
}

export const getCategoriess = async (): Promise<Category[]> => {
  const response = await api.get("/api/categories");
  return response.data.data;
};
