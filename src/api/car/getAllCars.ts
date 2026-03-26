import api from "@/config/axios";

export const getAllCars = async()=>{
    const response = await api.get(`/api/car/get-all`);
    return response.data.data || [];
}