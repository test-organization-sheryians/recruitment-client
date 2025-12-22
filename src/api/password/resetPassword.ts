import api from "@/config/axios";

interface ResetPasswordPayload {
  token: string;
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export const resetPassword = async (payload: ResetPasswordPayload) => {

   const response = await api.post("/api/password/reset-password", payload);
    console.log(response.data);
    return response.data; 

};