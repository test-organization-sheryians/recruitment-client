import api from "@/config/axios"

export const createProduct = async () => {
    return await api.get("/api/products/create")
}