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
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ data }: AuthParams) => {
      return login(data);
    },
  });

   const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      return logout();
    },
  }); 


  return {
    registerMutation,
    loginMutation,
    logoutMutation
  };
}

export default useAuthApi
