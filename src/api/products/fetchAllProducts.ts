import api from "@/config/axios"

export const fetchAllProducts = async()=>{
    const response = await api.get("/api/product/getAllProducts");
    return response.data
}