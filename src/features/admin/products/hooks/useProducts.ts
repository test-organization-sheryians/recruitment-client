import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import * as api from "@/api";

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => api.getAllProducts(),
        retry: 0,
    });
};

export const useGetProduct = (id?: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => api.getProductById(id!),
        enabled: !!id,
        retry: 0,
    });
};

const invalidateProduct = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product"] });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createProduct "],
        mutationFn: (data: {
            name: string;
            price: number;
            description?: string;
            quantity: number;
        }) => api.createProduct(data),
        retry: 0,
        onSuccess: () => invalidateProduct(queryClient),
    });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: (data: {
      id: string;
      name: string;
      price: number;
      description?: string;
      quantity: number;
    }) => api.updateProduct(data.id, data),
    retry: 0,
    onSuccess: () => invalidateProduct(queryClient),
  });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["deleteSkill"],
        mutationFn: (id: string) => api.deleteProduc(id),
        retry: 0,
        onSuccess: () => invalidateProduct(queryClient),
    });
};
