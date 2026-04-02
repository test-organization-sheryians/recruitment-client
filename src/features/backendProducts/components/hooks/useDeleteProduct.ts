import { deleteProduct } from "@/api/backendProducts/deleteProducts";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct({id}),
    onSuccess: () => {
      // CRITICAL: This must match the key in your useGetAllProductsHook
      // It is likely ["getAllProducts"] or ["products"]
      queryClient.invalidateQueries({ queryKey: ["getAllProducts"] }); 
      
      console.log("Delete successful, refreshing list...");
    },
    onError: (error: any) => {
      console.error("Deletion failed:", error.message);
    },
  });
};