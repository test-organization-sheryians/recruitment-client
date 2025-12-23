import api from "@/config/axios/index";
import type { Job } from "@/types/Job";

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

export const getJobsPaginated = async (
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<Job>> => {
  const url = "/api/jobs";
  const res = await api.get(url, { params: { page, limit } });
  return res.data as BackendPaginatedResponse<Job>;
};
