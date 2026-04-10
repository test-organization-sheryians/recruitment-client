import axios from "axios";
import { ApiResponse, Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const productApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>("/products");
    return data.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );
    return data.data;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(
      `/products/category/${category}`
    );
    return data.data;
  },

  getAllCategories: async (): Promise<string[]> => {
    const { data } =
      await apiClient.get<ApiResponse<string[]>>("/products/categories");
    return data.data;
  },
};