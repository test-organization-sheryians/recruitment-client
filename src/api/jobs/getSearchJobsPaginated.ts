import api from "@/config/axios";
import type { Job } from "@/types/Job";
import type { SearchParams } from "@/types/Job";

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

export const searchJobsPaginated = async (
  params: SearchParams,
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<Job>> => {
  // ✅ Build queryParams safely
  const queryParams: Record<string, unknown> = {

    q: params.q || undefined,
    location: params.location || undefined,
    page,
    limit,
  };

  if (params.jobType?.length) queryParams.jobType = params.jobType.join(",");
  if (params.experience?.length) queryParams.experience = params.experience.join(",");
  if (params.minSalary != null) queryParams.minSalary = params.minSalary;
  if (params.maxSalary != null) queryParams.maxSalary = params.maxSalary;

  const res = await api.get("/api/jobs/search", { params: queryParams });

  return res.data as BackendPaginatedResponse<Job>;
};
