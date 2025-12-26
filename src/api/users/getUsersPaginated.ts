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
  role?: string
): Promise<BackendPaginatedResponse<User>> => {
  const params: Record<string, unknown> = { page, limit };
  if (role) params.role = role;

  const res = await api.get("/api/users/allUser", { params });
  const body = res.data;

  // If backend returns a plain array of users
  if (Array.isArray(body)) {
    return {
      data: body,
      pagination: {
        currentPage: page,
        limit,
        totalRecords: body.length,
        totalPages: 1,
      },
    };
  }

  // If backend returns { success, data: User[], message } possibly without pagination
  if (body && Array.isArray(body.data)) {
    return {
      ...body,
      pagination:
        body.pagination ?? {
          currentPage: page,
          limit,
          totalRecords: body.data.length,
          totalPages: 1,
        },
    } as BackendPaginatedResponse<User>;
  }

  // Fallback to empty paginated response
  return {
    data: [],
    pagination: { currentPage: page, limit, totalRecords: 0, totalPages: 0 },
  };
};
