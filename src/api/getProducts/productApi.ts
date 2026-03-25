import axios from 'axios';
import { Product } from '@/types/product';

// 1. Create the Instance
const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Fetch All Products
export const fetchAllProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/products');
  return data;
};

// 3. Fetch Single Product (for Routing/Details)
export const fetchProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export default api;