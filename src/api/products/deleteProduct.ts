import api from "@/config/axios"
export const deleteProduct = async (id: string) => {
    return await api.delete(`/api/products/delete/${id}`)
}