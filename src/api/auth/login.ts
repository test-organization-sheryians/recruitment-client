import api from "@/config/axios";
import { startSessionWatcher } from "@/lib/utils";

export const login = async (data: FormData) => {
    const response = await api.post("/api/auth/login", data);
    console.log(response.data);
    startSessionWatcher(response.data.expiresIn);
    return response.data; 
    
};
