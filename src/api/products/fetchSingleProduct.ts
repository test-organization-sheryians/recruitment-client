import api from "@/config/axios"
export const fetchSingleProduct = async (id:string) => {
    return await api.get(`/api/products/${id}`)
}