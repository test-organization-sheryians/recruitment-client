import api from "@/config/axios"

export const updateProduct = async (id: string, data: any) => {
    const res = await api.patch(`/api/products/update/${id}`, data)
    return res.data.product
    
}