"use client";

import { createProducts } from "@/api/backendProducts/createProducts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProducts,
    // After a successful creation, tell TanStack to refetch the 'products' list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Product creation failed:", error.message);
    }
  });
};