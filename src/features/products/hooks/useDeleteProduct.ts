import { useMutation } from "@tanstack/react-query"
import * as api from "@/api"
export const useDeleteProduct = (id: string) => {
    return useMutation({
        mutationKey: ["products"],
        mutationFn: () => api.deleteProduct(id),
         onSuccess: () => (console.log(" product deleted")),
    })
}