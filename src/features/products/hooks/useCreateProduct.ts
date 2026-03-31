import { useMutation, useQueryClient} from "@tanstack/react-query"
import * as api from "@/api"
export const useCreteProduct = () => {
    return useMutation({
        mutationKey:["products"],
        mutationFn: api.createProduct,
        onSuccess: () => (console.log(" product created")),
    },
)
}

