import api from "@/config/axios/index";
import type { Job } from "@/types/Job";
import type { BackendPaginatedResponse } from "./getJobsPaginated";

export const getJobsByCategoryPaginated = async (
  categoryId: string,
  page: number,
  limit: number
): Promise<BackendPaginatedResponse<Job>> => {
  const url = `/api/jobs/category/${categoryId}`;
  const res = await api.get(url, { params: { page, limit } });
  return res.data as BackendPaginatedResponse<Job>;
};
