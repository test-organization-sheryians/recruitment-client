import api from "@/config/axios/index";

export const getJobs = async () => {
  const url = "/api/jobs";
  const res = await api.get(url);
  return res.data.data;
};

// Optional: fetch a single page of jobs (kept separate to avoid breaking existing callers)
export const getJobsPage = async (page: number, limit: number) => {
  const url = "/api/jobs";
  const res = await api.get(url, { params: { page, limit } });
  return res.data;
};
