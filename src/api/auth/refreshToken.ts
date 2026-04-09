import api from "@/config/axios";

export const refreshToken = async()=>{
    const response = await api.post("/api/refresh");
    return response.data;
}