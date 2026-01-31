
import api from '@/config/axios'
 
 export const  addCategoriess= async ( data:{name:string})=>{
    let response= await api.post("/api/categories",data)
    return response.data
 }