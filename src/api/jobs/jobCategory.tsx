import api from "@/config/axios";

// Fetch all job categories (if you need it)
export const getJobCategories = async () => {
  const res = await api.get("/api/job-categories");
  return res.data.data;
};

// Optional: single page of categories
export const getJobCategoriesPage = async (page: number, limit: number) => {
  const res = await api.get("/api/job-categories", { params: { page, limit } });
  return res.data;
};

export const getJobsByCategory = async (categoryId: string) => {
  const res = await api.get(`/api/jobs/category/${categoryId}`);
  return res.data.data;
};

// Optional: single page of jobs by category
export const getJobsByCategoryPage = async (
  categoryId: string,
  page: number,
  limit: number
) => {
  const res = await api.get(`/api/jobs/category/${categoryId}`, {
    params: { page, limit },
  });
  return res.data;
};
