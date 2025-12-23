
import api from "@/config/axios"
import { PaginatedJobsResponse } from "@/types/Job";


interface SearchJobParams {
  q?: string;
  location?: string;
   page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 10;

export const searchJob = async ({
  q,
  location,
  page = 1,
  limit = DEFAULT_LIMIT,
}: SearchJobParams): Promise<PaginatedJobsResponse> => {
  const res = await api.get("/api/jobs/search", {
    params: {
      q,
      location,
      page,
      limit,
    },
  });

//   console.log("search api response ===>", res.data);
console.log("search api response input and location api file ==>",res)
  return res.data;
};
