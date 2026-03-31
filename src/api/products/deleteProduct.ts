import api from "@/config/axios"

export const deleteProduct = async(id:string)=>{
    const response = await api.delete(`/api/product/delete/${id}`);
    return response.data
}