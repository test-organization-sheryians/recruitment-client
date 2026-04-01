import { useQuery } from "@tanstack/react-query"
import * as api from "@/api"
export const fetchProduct = () => {
   return useQuery({
        queryKey: ["products"],
      queryFn: api.fetchProduct,
       staleTime:5000
    },)
}