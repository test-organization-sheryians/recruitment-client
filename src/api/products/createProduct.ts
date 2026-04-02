import api from "@/config/axios"

export const createProduct = async (data:any) => {
    return await api.post("/api/products/create",data)
}