import api from "@/config/axios"

export const createProduct = async (data: FormData) => {
    const response = await api.post(`/api/product/create`, data);
    return response.data
}