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

/* ============================
   GET USERS
============================ */
export const useGetUsers = () =>
  useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await api.getAllUsers();
      return Array.isArray(users) ? users : [];
    },
    retry: 0,
  });


interface UpdateRolePayload {
  userId: string;
  role: string;
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateRolePayload>({
    mutationFn: async ({ userId, role }) => {
      return api.updateUserRole(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 0,
  });
};


interface DeleteUserPayload {
  userId: string;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, DeleteUserPayload>({
    mutationFn: async ({ userId }) => {
      return api.deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retry: 0,
  });
};
