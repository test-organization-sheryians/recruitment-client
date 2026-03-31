import api from "@/config/axios"
export const deleteProduct = async (id: string) => {
    return await api.get(`/api/products/delete/${id}`)
}