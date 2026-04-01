import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api"
export const useDeleteProduct = (id:string) => {
     const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [`products:${id}`],
        mutationFn: ({id}:any) => api.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["products"]
            })
        }
    })
}