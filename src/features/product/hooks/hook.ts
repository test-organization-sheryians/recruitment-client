// custom hook
//  useQuery use for fetch data from backend and cache and loading error handle karta hai
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/api/products/getProduct";
import { Product } from "@/types/product";

export const useCreateProduct = () =>
  //  when we are take action to create updaate and delet
  useMutation({
    mutationFn: (data: Omit<Product, "_id">) =>
      createProduct(data).then(res => res.data),
  });

  



