import api from "@/config/axios/index";

export const getJobs = async (userId?: string) => {
  const url = "/api/jobs";
  const res = await api.get(url, {
    params: { userId }, // pass the current user's ID
  });
  return res.data.data;  // each job now has `applied` from aggregation
};
