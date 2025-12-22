import * as api from "@/api"; 
import { useMutation } from "@tanstack/react-query";


export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: ForgotPasswordPayload) => api.forgotPassword(data),
    retry: 0,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: ResetPasswordPayload) => api.resetPassword(data),
    retry: 0,
  });
};

