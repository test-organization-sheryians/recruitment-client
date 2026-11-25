import api from "@/config/axios";


export const getProduct = async (id: string) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
}