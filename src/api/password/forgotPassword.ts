import api from "@/config/axios";

export const forgotPassword = async (data: ForgotPasswordPayload) => {
    const response = await api.post("/api/password/forgot-password", data);
    console.log(response.data);
    return response.data; 
};