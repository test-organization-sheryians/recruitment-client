import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/api/productApi";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  byId: (id: number) => ["products", id] as const,
  byCategory: (category: string) => ["products", "category", category] as const,
  categories: ["products", "categories"] as const,
};

export const useProducts = () => {
  return useQuery({
    queryKey: PRODUCT_KEYS.all,
    queryFn: productApi.getAllProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProductById = (id: number) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.byId(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.byCategory(category),
    queryFn: () => productApi.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: PRODUCT_KEYS.categories,
    queryFn: productApi.getAllCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes — categories rarely change
  });
};