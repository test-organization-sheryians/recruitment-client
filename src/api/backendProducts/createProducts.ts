import api from "@/config/axios";
import { CreateProductInput } from "@/types/backendProducts";

export const createProducts = async (data: CreateProductInput) => {
  const response = await api.post("/api/products/create", data);
  return response.data;
};
