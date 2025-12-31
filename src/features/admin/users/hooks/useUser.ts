import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import api from "@/config/axios";
import { getUsersPaginated, type BackendPaginatedResponse } from "@/api/users/getUsersPaginated";

/* ===== FIX: MERGE CONFLICT REMOVED ===== */
export interface Role {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: Role;
}

/* ===== USERS LIST ===== */
export const useInfiniteUsers = (search: string) => {
  return useInfiniteQuery<BackendPaginatedResponse<User>>({
    queryKey: ["users", search],
    queryFn: ({ pageParam = 1 }) =>
      getUsersPaginated(pageParam as number, 10, search),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

/* ===== DELETE USER ===== */
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      api.delete(`/api/users/${userId}`),
  });
};

/* ===== UPDATE ROLE ===== */
export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: string;
    }) =>
      api.put(`/api/users/update-role/${userId}`, { roleId: role }),
  });
};
