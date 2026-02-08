import api from "@/config/axios";
import { ResetPasswordPayload } from "@/types/auth";

export const resetPassword = async (payload: ResetPasswordPayload) => {

   const response = await api.post("/api/password/reset-password", payload);
    console.log(response.data);
    return response.data; 

};