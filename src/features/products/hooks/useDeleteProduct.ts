import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/products/deleteProduct";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};