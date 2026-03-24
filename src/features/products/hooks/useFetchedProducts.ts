import { useQuery } from "@tanstack/react-query"
import * as api from "@/api";

export const useFetchedProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: api.fetchedProducts
    })
}