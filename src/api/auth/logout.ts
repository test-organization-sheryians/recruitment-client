import api from "@/config/axios";

export const logout = async () => {
    const response = await api.post("/api/sanuauth/logout");
    return response.data; 
};