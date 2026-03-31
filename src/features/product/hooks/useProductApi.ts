import { useMutation, useQuery } from "@tanstack/react-query"
import * as api from "@/api";
import { updateData } from "../components/UpdateProductForm";

export const useCreateProduct = () => {
    return useMutation({
        mutationKey: ["create-product"],
        mutationFn: (data: FormData) => api.createProduct(data)
    })
};

export const useFetchedAllProducts = () => {
    return useQuery({
        queryKey: ["allProducts"],
        queryFn: api.fetchAllProducts,
        staleTime: 5 * 60 * 1000
    })
};

export const useFetchProductById = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => api.fetchProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false
    })
}

export const useUpdateProduct = () => {
    return useMutation({
        mutationKey: ["updateProduct"],
        mutationFn: (payload: updateData) => api.updateProduct(payload)
    })
}

export const useDeleteProduct = () => {
    return useMutation({
        mutationKey: ["deleteProduct"],
        mutationFn: (id: string) => api.deleteProduct(id)
    })
}