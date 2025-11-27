
import api from "@/config/axios";

// Fetch all job categories (if you need it)
export const getJobCategories = async () => {
  const res = await api.get("/api/job-categories"); // adjust path
  return res.data.data;
};


export const getJobsByCategory = async (categoryId: string) => {
  const res = await api.get(`api/jobs/category/${categoryId}`);
  console.log(res.data);
  return res.data.data;
};


