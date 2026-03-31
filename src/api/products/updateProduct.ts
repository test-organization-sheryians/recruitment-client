import api from "@/config/axios"

export const updateProduct = async (id: string, data: any) => {
    return await api.patch(`/api/products/update/${id}`,data)
}