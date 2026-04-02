import { getSingleProduct } from "@/api/backendProducts/getSingleProducts";
import { useQuery } from "@tanstack/react-query";

export const useSingleProduct = (id:string) => {
  return useQuery({
    queryKey: ["getSingleProduct",id],
    queryFn: ()=>(getSingleProduct(id)),
    staleTime: 1000 * 60 * 5,
    enabled: !!id
  });
};
