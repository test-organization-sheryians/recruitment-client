interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
}

import api from "@/config/axios";

export const register = async (data: any) => {
    const response = await api.post("/api/auth/register", data);
    return response.data; 
};
