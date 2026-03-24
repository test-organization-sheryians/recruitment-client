import api from "@/config/axios"

export const fetchedProducts = async()=>{
    const response = await api.get(`https://fakestoreapi.com/products`);
    return response.data
}