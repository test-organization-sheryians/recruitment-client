interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
}

import { login, register } from '@/api';
import { useMutation } from '@tanstack/react-query'

interface LoginParams {
  data: LoginRequest;
  onProgress?: (progress: number) => void;
}

interface RegisterParams {
  data: RegisterRequest;
  onProgress?: (progress: number) => void;
}

const useAuthApi = () => {
  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ data }: RegisterParams) => {
      return register(data);
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ data }: LoginParams) => {
      return login(data);
    },
  });


  return {
    registerMutation,
    loginMutation
  };
}

export default useAuthApi
