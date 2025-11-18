import api from "@/config/axios";

export const register = async (data: unknown) => {
    const response = await api.post("/api/auth/register", data);
    return response.data; 
};