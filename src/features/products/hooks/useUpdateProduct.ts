"use-client"
import { useMutation } from "@tanstack/react-query"
import * as api from "@/api"
export const useUpdateProduct = () => {
    return useMutation({
        mutationKey: ["products"],
        mutationFn: ({ id, data }: { id: string; data:any}) => api.updateProduct(id, data),
         onSuccess: () => (console.log(" product updated")),
    })
}