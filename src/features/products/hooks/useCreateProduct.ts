"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as api from "@/api"

// Interface define karein taaki TS ko pata chale 'data' kya hai
interface ProductData {
    name: string;
    description: string;
    price: number;
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["products"],
        // ✅ MutationFn ko direct data pass karein, destructuring ki zarurat nahi agar single object hai
        mutationFn: (data: ProductData) => api.createProduct(data),
        
        onSuccess: () => {
            console.log("Product created");
            // ✅ Naya product aane par list ko refresh karna zaroori hai
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}