import api from "@/config/axios";

export interface CreateProductPayload {
    name: string,
    description?:string,
    price:number,
}

export const createProduct =  async(data:CreateProductPayload) =>{
    const res = await api.post("/api/products/create", data)
    return res.data;
};