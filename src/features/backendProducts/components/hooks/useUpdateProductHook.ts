import { updateProduct } from "@/api/backendProducts/updateProducts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProductInput } from "@/types/backendProducts";
import { toast } from "react-hot-toast";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduct"],
    // Clean data inside the mutation function
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProductInput }) => {
      const {
        // @ts-ignore - destructuring these even if not in type to be safe
        _id,
        // @ts-ignore
        createdAt,
        // @ts-ignore
        updatedAt,
        // @ts-ignore
        __v,
        ...cleanUpdates
      } = updates as any;

      return updateProduct(id, cleanUpdates);
    },

    onSuccess: (data, variables) => {
      // 1. Refresh the main list
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] });

      // 2. Refresh the specific product details
      queryClient.invalidateQueries({ 
        queryKey: ["getSingleProduct", variables.id] 
      });

      toast.success("Product updated successfully");
      console.log("Update successful");
    },
    
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Update failed";
      toast.error(errorMessage);
      console.error("Update failed:", errorMessage);
    },
  });
};