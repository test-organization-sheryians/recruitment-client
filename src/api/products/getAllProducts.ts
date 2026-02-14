import api from "@/config/axios";
import { Product } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get<ApiResponse<Product[]>>(
    "/api/product/"
  );
  console.log(res)
  return res.data.data;
};