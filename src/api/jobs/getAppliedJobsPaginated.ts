// api/appliedJobs/getAppliedJobsPaginated.ts
import api from "@/config/axios/index";
import { AppliedJob } from "@/types/AppliedJob";
import type { Job } from "@/types/Job";

export interface BackendPagination {
  currentPage: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface BackendPaginatedJobResponse<T> {
  data: T[];
  pagination: BackendPagination;
}

export const getAppliedJobsPaginated = async (
  page: number,
  limit: number,
  status?: string
): Promise<BackendPaginatedJobResponse<AppliedJob>> => {
  const res = await api.get("/api/job-apply/my-applications", {
    params: {
      page,
      limit,
      status
    },
  });

  return res.data as BackendPaginatedJobResponse<AppliedJob>;
};
