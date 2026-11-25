import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/api";

export const useGetAllProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: api.getAllProducts,
  });

export const useGetProduct = (id?: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
  });

const invalidate = (qc: any) => {
  qc.invalidateQueries({ queryKey: ["products"] });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => invalidate(qc),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateProduct,
    onSuccess: () => invalidate(qc),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => invalidate(qc),
  });
};
