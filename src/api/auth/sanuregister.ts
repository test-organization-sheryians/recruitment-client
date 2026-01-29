
import api from "@/config/axios";

export const register = async (data: FormData) => {
    const response = await api.post("/api/sanuauth/register", data);
    return response.data; 
};
