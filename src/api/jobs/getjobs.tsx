import api from "@/config/axios/index";



export const getJobs = async (id?: string) => {
  const url = id ? `/api/jobs/${id}` : "/api/jobs";
  const res = await api.get(url);
  return res.data.data;  // <-- the real jobs array
};

