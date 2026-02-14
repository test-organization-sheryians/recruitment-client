import api from "@/config/axios"

export const deleteClient = async( id: string)=>{
    const res = await api.delete(`/api/client/delete/${id}`)
    return res.data
}