import api from "@/config/axios";
import { Product } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getProductById = async (
  id: string
): Promise<Product> => {
  const res = await api.get<ApiResponse<Product>>(
    `/api/product/single-product/${id}`
  );
  return res.data.data;
};