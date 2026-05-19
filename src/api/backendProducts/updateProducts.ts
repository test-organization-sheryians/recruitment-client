import api from "@/config/axios";
import { UpdateProductInput } from "@/types/backendProducts";

export const updateProduct= async (id: string, updates: UpdateProductInput) => {
    const response = await api.put(`/api/products/updateProduct/${id}`, updates);
    return response.data;
  }