import { useMutation } from "@tanstack/react-query";
import api from "@/config/axios";
import { useToast } from "@/components/ui/Toast";

export interface ResendEmailResponse {
  success: boolean;
  message: string;
}

export const useResendVerification = () => {
  const toast = useToast();

  return useMutation<ResendEmailResponse, any>({
    mutationFn: async () => {
      const { data } = await api.post(
        "/api/auth/resend-verification-email",
        {},
        { withCredentials: true }
      );
      return data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Verification email sent successfully");
    },

    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(msg);
    },
  });
};
