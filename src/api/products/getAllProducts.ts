import api from "@/config/axios";

export const getAllProducts = async () =>{
    const res = await api.get("/api/products");
    return res.data;
}