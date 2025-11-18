import api from "@/config/axios";

export const login = async (data: unknown) => {
    const response = await api.post("/api/auth/login", data);
    console.log(response.data);
    return response.data; 
};