const API_BASE = "http://localhost:9000/api";
import { Product } from "@/types/product";

export const productAPI = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    return data.data;
  },

  create: async (
    product: Omit<Product, "_id" | "createdAt" | "updatedAt">,
    token: string,
  ): Promise<Product> => {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.data;
  },

  update: async (
    id: string,
    product: Partial<Product>,
    token: string,
  ): Promise<Product> => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    return data.data;
  },

  delete: async (id: string, token: string): Promise<void> => {
    await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
