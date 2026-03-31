import api from "@/config/axios"

export const fetchProductById = async(id:string)=>{
    const response = await api.get(`/api/product/${id}`);
    return response.data
}