"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api"
export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["products"],
        mutationFn: ({ id, data }: { id: string; data:any}) => api.updateProduct(id, data),
    })
}