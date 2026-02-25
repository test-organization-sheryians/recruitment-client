import api from "@/config/axios";

// Save job
export const saveJob = async (jobId: string) => {
  const res = await api.post(`/api/saved-jobs/${jobId}`);
  return res.data;
};

// Unsave job
export const unsaveJob = async (jobId: string) => {
  const res = await api.delete(`/api/saved-jobs/${jobId}`);
  return res.data;
};

// Get saved jobs
export const getSavedJobs = async () => {
  const res = await api.get("/api/saved-jobs");
  return res.data.data;
};
