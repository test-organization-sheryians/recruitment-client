import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products/getProduct";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};