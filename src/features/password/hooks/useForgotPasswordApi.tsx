import * as api from "@/api"; 
import { ForgotPasswordPayload, ResetPasswordPayload } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";


export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (data: ForgotPasswordPayload) => api.forgotPassword(data),
    retry: 0,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: ResetPasswordPayload) => api.resetPassword(data),
    retry: 0,
  });
};

