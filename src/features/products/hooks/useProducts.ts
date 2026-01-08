import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/api/products/getAllProducts";
import { Product } from "../types/product.types";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
};

