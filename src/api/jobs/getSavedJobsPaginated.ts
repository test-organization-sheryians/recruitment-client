import api from "@/config/axios";
import type { SavedJob } from "@/types/Job";

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

export const getSavedJobsPaginated = async (
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<SavedJob>> => {
  const res = await api.get("/api/saved-jobs", { params: { page, limit } });
  return res.data as BackendPaginatedResponse<SavedJob>;
};
