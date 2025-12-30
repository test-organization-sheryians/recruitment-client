import api from "@/config/axios";
import type { User } from "@/features/admin/users/hooks/useUser";

export interface BackendPagination {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface BackendPaginatedResponse<T> {
  success?: boolean;
  data: T[];
  pagination: BackendPagination;
  message?: string;
}

export const getUsersPaginated = async (
  page: number,
  limit: number,
  search : string
): Promise<BackendPaginatedResponse<User>> => {
  const res = await api.get("/api/users/allUser", { params: { page, limit,search } });
  return res.data as BackendPaginatedResponse<User>;
};
