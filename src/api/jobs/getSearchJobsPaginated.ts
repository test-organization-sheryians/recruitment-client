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

  const res = await api.get("/api/jobs/search", {
    params: {
      q: params.q,
      location: params.location,

      jobType: params.jobType?.join(","),        // 🔥 FIX
      experience: params.experience?.join(","),  // 🔥 FIX

      minSalary: params.minSalary,
      maxSalary: params.maxSalary,

      page,
      limit,
    },
  });

  return res.data as BackendPaginatedResponse<Job>;
};

