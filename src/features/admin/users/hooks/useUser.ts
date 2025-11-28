import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";

export interface Role {
  name: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: Role | null;
}


export const useGetUsers = () =>
  useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await api.getAllUsers(); 
      return Array.isArray(users) ? users : [];
    },
    retry: 0,
  });


export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, { userId: string; role: string }>({
    mutationFn: async ({ userId, role }) => {
      return api.updateUserRole(userId, role);
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 0,
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, { userId: string }>({
    mutationFn: async ({ userId }) => {
      return api.deleteUser(userId);
    },
    onSuccess: () => {
   
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 0,
  });
};
