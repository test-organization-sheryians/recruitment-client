import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/api";
import { getUsersPaginated, type BackendPaginatedResponse } from "@/api/users/getUsersPaginated";

export interface Role {
<<<<<<< HEAD
  _id: string;
=======
    _id: string;
>>>>>>> bdd398f8305fd487a994e034adef62d087ae7122
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

<<<<<<< HEAD
const DEFAULT_LIMIT = 10;

export const useInfiniteUsers = (search: string, limit: number = DEFAULT_LIMIT) =>
  useInfiniteQuery<BackendPaginatedResponse<User>>({
    queryKey: ["users", { search, limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => getUsersPaginated(pageParam as number, limit, search),
=======
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

/* ============================
   INFINITE USERS
============================ */

  const DEFAULT_LIMIT = 10;

export const useInfiniteUsers = (
  limit: number = DEFAULT_LIMIT,
  query: string = ""  // <-- add query here
) =>
  useInfiniteQuery<BackendPaginatedResponse<User>>({
    queryKey: ["users", { limit, query }], // <-- include query in key
    initialPageParam: 1,

    queryFn: async ({ pageParam }) =>
      getUsersPaginated(pageParam as number, limit, query), // <-- pass query to API

>>>>>>> bdd398f8305fd487a994e034adef62d087ae7122
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination) return undefined;
      const next = (pagination.currentPage ?? 1) + 1;
      return next <= (pagination.totalPages ?? 0) ? next : undefined;
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
    mutationFn: async ({ userId, role }) => api.updateUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    retry: 0,
  });
};

interface DeleteUserPayload {
  userId: string;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, DeleteUserPayload>({
    mutationFn: async ({ userId }) => api.deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    retry: 0,
  });
};
