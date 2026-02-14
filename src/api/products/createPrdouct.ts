import api from "@/config/axios";
import { Product } from "@/types/product";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateProductPayload {
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

export const createProduct = async (
    data: CreateProductPayload
): Promise<Product> => {
    const res = await api.post<ApiResponse<Product>>(
        "/api/product/create",
        data
    );
    return res.data.data;
};