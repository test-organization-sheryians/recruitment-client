import { createProduct } from "@/api/products/createProduct";
import { deleteProduct } from "@/api/products/deleteProduct";
import { getProducts } from "@/api/products/getProducts";
import { updateProduct } from "@/api/products/updateProduct";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: Infinity,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("product created, ", data);
    },
    onError: (error) => {
      console.log("error in creating product: ", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Product updated, ", data);
    },
    onError: (error) => {
      console.log("Error in updating product: ", error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Product Deleted, ", data);
    },
    onError: (error) => {
      console.log("Error in deleting product: ", error);
    },
  });
};
