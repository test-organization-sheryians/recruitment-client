import api from "@/config/axios";
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

type SearchParams = {
  q: string;
  location: string;
};

export const searchJobsPaginated = async (
  params: SearchParams,
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<Job>> => {
    console.log("API Call Params check (request) ===>:", { params, page, limit });
  const res = await api.get("/api/jobs/search", {
    params: {
      q: params.q,
      location: params.location,
      page,
      limit,
    },
  });
console.log("API Call Response check (response) ===>:", res);
  return res.data as BackendPaginatedResponse<Job>;
};
