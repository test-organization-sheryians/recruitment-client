import { Product } from "@/types/product";
import api from "@/config/axios"

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UpdateProductPayload {
    id: string
    name: string;
    description?: string;
    quantity: number;
    price: number;
}


export const updateProduct = async (
  id: string,
  data: UpdateProductPayload
): Promise<Product> => {
  const res = await api.patch<ApiResponse<Product>>(
    `/api/product/update/${id}`,
    data
  );
  return res.data.data;
};