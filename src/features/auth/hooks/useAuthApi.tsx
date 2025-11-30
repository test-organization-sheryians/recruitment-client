import { useMutation } from "@tanstack/react-query";
import * as api from "@/api"; 

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: FormData) => api.register(data),
    retry: 0,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: FormData) => api.login(data),
    retry: 0,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.logout(),
    retry: 0,
  });
};

export const useVerifyUser = () => {
  return useMutation({
    mutationKey: ["verify-user"],
    mutationFn: (userId: string) => api.verifyUser(userId),
    retry: 1,
  });
};



