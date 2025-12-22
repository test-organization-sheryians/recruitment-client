import api from "@/config/axios";

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

export interface CategoryItem {
  _id: string;
  name: string;
}

export const getCategoriesPaginated = async (
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<CategoryItem>> => {
  const res = await api.get("/api/job-categories", { params: { page, limit } });
  return res.data as BackendPaginatedResponse<CategoryItem>;
};
