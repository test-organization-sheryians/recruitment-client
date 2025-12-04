import { useMutation } from '@tanstack/react-query';
import api from '@/config/axios';

export interface ResendEmailResponse {
  success: boolean;
  message: string;
}

export const useResendVerification = () => {
  return useMutation<ResendEmailResponse, any>({
    mutationFn: async () => {
      const { data } = await api.post(
        '/api/auth/resend-verification-email',
        {},
        { withCredentials: true }
      );
      return data;
    },
  });
};
