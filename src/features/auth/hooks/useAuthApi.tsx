import { login, register, logout } from '@/api';
import { useMutation } from '@tanstack/react-query'

interface AuthParams {
  data: FormData;
  onProgress: (progress: number) => void;
}

const useAuthApi = () => {
  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ data }: AuthParams) => {
      return register(data);
    },
    retry: 1,
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ data }: AuthParams) => {
      return login(data);
    },
    retry: 1,
  });

   const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return logout();
    },
    retry: 1,
  }); 


  return {
    registerMutation,
    loginMutation,
    logoutMutation
  };
}

export default useAuthApi
