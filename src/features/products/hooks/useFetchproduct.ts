import { useQuery } from "@tanstack/react-query"
import * as api from "@/api"
export const useFetchProduct = () => {
   return useQuery({
        queryKey: ["products"],
       queryFn: api.fetchProduct,
        staleTime:10000
    })
}

