import { useQuery } from "@tanstack/react-query"
import * as api from "@/api"
export const useFetchSingleProduct = (id: string) => {
    return useQuery({
        queryKey: [`product:${id}`],
        queryFn:()=>api.fetchSingleProduct(id)
    })
}