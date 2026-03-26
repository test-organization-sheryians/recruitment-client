import api from "@/config/axios";

export const createCar = async (data:FormData)=>{
    const response = await api.post("/api/car/create",data);
    return response.data;
}


